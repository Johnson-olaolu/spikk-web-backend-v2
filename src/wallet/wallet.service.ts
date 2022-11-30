import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import User from 'src/user/entities/user.entity';
import { TransactionStatus, TransactionTypes } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { WalletTransaction } from './entities/walletTransaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(WalletTransaction)
    private walletTransactionRepository: Repository<WalletTransaction>,
    private mailService: MailService,
  ) {}
  async create(user: User) {
    const wallet = await this.walletRepository.save({
      user: user,
    });
    return wallet;
  }

  findAll() {
    return `This action returns all wallet`;
  }

  async findOne(id: string) {
    const wallet = await this.walletRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
    if (!wallet) {
      throw new NotFoundException('No Wallet found for this id');
    }
    return wallet;
  }

  async debitWallet(
    walletId: string,
    payload: {
      amount: number;
      description: string;
      currency: string;
      transactionReference: string;
    },
  ) {
    const wallet = await this.findOne(walletId);
    await this.walletTransactionRepository.save({
      wallet: wallet,
      currBalance: wallet.balance + payload.amount,
      prevBalance: wallet.balance,
      transactionReference: payload.transactionReference,
      description: payload.description,
      amount: payload.amount,
      currency: payload.currency,
      transactionType: TransactionTypes.MONNIFY_CREDIT,
      transactionStatus: TransactionStatus.CONFIRMED,
    });

    wallet.balance = wallet.balance + payload.amount;
    wallet.ledgerBalance = wallet.ledgerBalance + payload.amount;
    wallet.save();

    await this.mailService.sendDebitConfirmedMail(wallet.user, {
      currency: payload.currency,
      amount: payload.amount,
    });
    return;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
