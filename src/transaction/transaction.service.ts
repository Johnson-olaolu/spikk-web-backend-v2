import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as moment from 'moment';
import * as uniqid from 'uniqid';
import { WalletService } from 'src/wallet/wallet.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ConfigService } from '@nestjs/config';
import { MonnifyService } from 'src/monnify/monnify.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { ConfirmCreditQueryDto } from './dto/confirm-credit.dto';
import { InitiateDebitDto } from './dto/initiate-debit.dto';
import { TransactionTypes } from 'src/utils/constants';

@Injectable()
export class TransactionService {
  constructor(
    private walletService: WalletService,
    private configService: ConfigService,
    private monnifyService: MonnifyService,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  generateReference(userName?: string) {
    const presentDate = moment().format('YYYYMMDD');
    const paymentReference = uniqid(
      `${(userName || 'SPIKK').toUpperCase()}-`,
      `-${presentDate}`,
    );
    return paymentReference;
  }

  async initiateDebit(createTransactionDto: CreateTransactionDto) {
    const wallet = await this.walletService.findOne(
      createTransactionDto.walletId,
    );
    const paymentReference = this.generateReference(wallet.user.userName);
    const payload = {
      name: wallet.user.name,
      email: wallet.user.email,
      amount: createTransactionDto.amount,
      paymentReference: paymentReference,
      currency: 'NGN',
      redirectUrl: `${this.configService.get(
        'BASE_URL',
      )}/transaction/confirm-credit`,
      paymentDescription: '',
    };

    const monnifyResponse = await this.monnifyService.initiateDebitTransaction(
      payload,
    );
    await this.transactionRepository.save({
      wallet: wallet,
      transactionType: TransactionTypes.MONNIFY_DEBIT,
      transactionReference: monnifyResponse.transactionReference,
      paymentReference: monnifyResponse.paymentReference,
      enabledPaymentMethod: JSON.stringify(
        monnifyResponse.enabledPaymentMethod,
      ),
      amount: createTransactionDto.amount,
      currency: payload.currency,
    });
    return monnifyResponse.checkoutUrl;
  }

  async confirmDebit(confirmCreditDto: ConfirmCreditQueryDto) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        paymentReference: confirmCreditDto.paymentReference,
      },
      relations: {
        wallet: true,
      },
    });
    const transactionDetails =
      await this.monnifyService.confirmDebitTransaction(
        transaction.transactionReference,
      );
    transaction.amountPaid = parseFloat(transactionDetails.amountPaid);
    transaction.totalPayable = parseFloat(transactionDetails.totalPayable);
    transaction.settlementAmount = transactionDetails.settlementAmount;
    transaction.paidOn = transactionDetails.paidOn;
    transaction.paymentStatus = transactionDetails.paymentStatus;
    transaction.paymentDescription = transactionDetails.paymentDescription;
    transaction.paymentMethod = transactionDetails.paymentMethod;
    transaction.product = JSON.stringify(transactionDetails.product || {});
    transaction.cardDetails = JSON.stringify(
      transactionDetails.cardDetails || {},
    );
    transaction.accountDetails = JSON.stringify(
      transactionDetails.accountDetails || {},
    );
    transaction.accountPayments = JSON.stringify(
      transactionDetails.accountPayments || [],
    );
    transaction.customer = JSON.stringify(transactionDetails.customer || {});
    transaction.metaData = JSON.stringify(transactionDetails.metaData || {});

    await transaction.save();

    if (transaction.paymentStatus === 'PAID') {
      await this.walletService.debitWallet(transaction.wallet.id, {
        amount: transaction.amount,
        description: transaction.paymentDescription,
        currency: transaction.currency,
        transactionReference: transaction.paymentReference,
      });
    }
  }

  async credit(initiateDebitDto: InitiateDebitDto) {
    const wallet = await this.walletService.findOne(initiateDebitDto.walletId);

    if (initiateDebitDto.amount > wallet.balance) {
      throw new UnauthorizedException(
        'You do not have enough balance for this transaction',
      );
    }

    const paymentReference = this.generateReference(wallet.user.userName);

    const monnifyResponse = await this.monnifyService.createCreditTransaction(
      paymentReference,
      initiateDebitDto.amount,
      {
        currency: 'NGN',
        destinationAccountName: initiateDebitDto.destinationAccountName,
        destinationAccountNumber: initiateDebitDto.destinationAccountNumber,
        destinationBankCode: initiateDebitDto.destinationBankCode,
        sourceAccountNumber: this.configService.get('MONNIFY_ACCOUNT_NO'),
      },
    );
    const transaction = await this.transactionRepository.save({
      wallet: wallet,
      transactionType: TransactionTypes.MONNIFY_CREDIT,
      transactionReference: monnifyResponse.sessionId,
      paymentReference: monnifyResponse.reference,
      amount: initiateDebitDto.amount,
      currency: 'NGN',
      destinationAccountName: monnifyResponse.destinationAccountName,
      destinationBankName: monnifyResponse.destinationBankName,
      destinationAccountNumber: monnifyResponse.destinationAccountNumber,
      destinationBankCode: monnifyResponse.destinationBankCode,
    });

    if (monnifyResponse.status === 'SUCCESS') {
      await this.walletService.creditWallet(transaction.wallet.id, {
        amount: transaction.amount,
        description: transaction.paymentDescription,
        currency: transaction.currency,
        transactionReference: transaction.paymentReference,
      });
    }

    return {
      amount: transaction.amount,
      destinationAccountName: transaction.destinationAccountName,
      destinationBankName: transaction.destinationBankName,
      destinationAccountNumber: transaction.destinationAccountNumber,
    };
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
