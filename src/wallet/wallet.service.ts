import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
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
      throw new NotFoundException();
    }
    console.log(wallet);
    return wallet;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
