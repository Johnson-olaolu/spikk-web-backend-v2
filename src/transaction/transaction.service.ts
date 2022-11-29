import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as uniqid from 'uniqid';
import { WalletService } from 'src/wallet/wallet.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ConfigService } from '@nestjs/config';
import { MonnifyService } from 'src/monnify/monnify.service';

@Injectable()
export class TransactionService {
  constructor(
    private walletService: WalletService,
    private configService: ConfigService,
    private monnifyService: MonnifyService,
  ) {}
  async create(createTransactionDto: CreateTransactionDto) {
    const wallet = await this.walletService.findOne(
      createTransactionDto.walletId,
    );

    const presentDate = moment().format('YYYYMMDD');
    const paymentReference = uniqid(
      `${wallet.user.userName}-`,
      `-${presentDate}`,
    );
    const payload = {
      name: wallet.user.name,
      email: wallet.user.email,
      amount: createTransactionDto.amount,
      paymentReference: paymentReference,
      redirectUrl: `${this.configService.get(
        'BASE_URL',
      )}/transaction/confirm-credit`,
      paymentDescription: '',
    };

    const monnifyResponse = await this.monnifyService.initiateDebitTransaction(
      payload,
    );
    return monnifyResponse;
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
