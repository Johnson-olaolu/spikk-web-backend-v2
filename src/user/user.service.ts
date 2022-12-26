import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { BCRYPT_HASH_ROUND, RoleTypes } from 'src/utils/constants';
import { WalletService } from 'src/wallet/wallet.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import User from './entities/user.entity';

@Injectable()
export class UserService {
  private superAdmin: Partial<User> = {
    name: 'Spikk Admin',
    userName: 'spikk_admin',
    email: 'spikk_admik@spikk.com',
    password: 'admin',
  };

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private walletService: WalletService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.userRepository.save(createUserDto);
    await this.walletService.create(newUser);
    return newUser;
  }

  async findUserByEmailOrUserName(userNameOrEmail: string) {
    const user = await this.userRepository.findOne({
      where: [{ userName: userNameOrEmail }, { email: userNameOrEmail }],
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findAll() {
    const allUsers = await this.userRepository.find();
    return allUsers;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async seedSuperAdmin() {
    const hashedPass = await bcrypt.hash(
      this.superAdmin.password,
      BCRYPT_HASH_ROUND,
    );
    const superAdmin = await this.userRepository.save({
      name: this.superAdmin.name,
      email: this.superAdmin.email,
      userName: this.superAdmin.userName,
      password: hashedPass,
      role: RoleTypes.SuperAdmin,
      isVerified: true,
    });
    console.log(superAdmin);
  }

  async remove(id: string) {
    const deleteResponse = await this.userRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
