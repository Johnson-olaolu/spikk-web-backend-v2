import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import User from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const newUser = await this.userRepository.save(createUserDto);
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

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
