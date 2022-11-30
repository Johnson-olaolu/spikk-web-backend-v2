import { Injectable } from '@nestjs/common';
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

@Injectable()
export class TransactionService {
  constructor(
    private walletService: WalletService,
    private configService: ConfigService,
    private monnifyService: MonnifyService,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}
  async create(createTransactionDto: CreateTransactionDto) {
    const wallet = await this.walletService.findOne(
      createTransactionDto.walletId,
    );

    const presentDate = moment().format('YYYYMMDD');
    const paymentReference = uniqid(
      `${wallet.user.userName.toUpperCase()}|`,
      `|${presentDate}`,
    );
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

  async confirmCredit(confirmCreditDto: ConfirmCreditQueryDto) {
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
