import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as otpGenerator from 'otp-generator';
import * as moment from 'moment';
import User from 'src/user/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { BCRYPT_HASH_ROUND, MYSQL_ERROR_CODES } from 'src/utils/constants';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfimUserDto } from './dto/confirm-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser(user: User) {
    const payload = { username: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken: accessToken,
      user: user,
    };
  }

  public async getAuthenticatedUser(email: string, hashedPassword: string) {
    const user = await this.userService.findUserByEmailOrUserName(email);
    const isPasswordMatching = await user.comparePasswords(
      user.password,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!user.isVerified) {
      throw new HttpException('User not verified', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async registerNewUser(registerUserDto: RegisterDto) {
    const hashedPass = await bcrypt.hash(
      registerUserDto.password,
      BCRYPT_HASH_ROUND,
    );
    const newUserDetails: Partial<User> = {
      ...registerUserDto,
      password: hashedPass,
    };
    try {
      const newUser = await this.userService.create(newUserDetails as User);
      await this.generateConfirmAccountToken(newUser.email);
    } catch (error) {
      if (error?.code == MYSQL_ERROR_CODES.ER_DUP_ENTRY) {
        throw new HttpException(error?.sqlMessage, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateConfirmAccountToken(email: string) {
    const user = await this.userService.findUserByEmailOrUserName(email);
    const verificationToken = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });

    const expire = moment().add(15, 'minutes');

    user.confirmUserToken = verificationToken;
    user.tokenTimeToLive = moment(expire, true).toDate();
    await user.save();
    await this.mailService.sendUserConfirmationMail(user);
  }

  async confirmNewUser(confirmUsertDto: ConfimUserDto) {
    const { email, token } = confirmUsertDto;
    const user = await this.userService.findUserByEmailOrUserName(email);
    const currentDate = moment().valueOf();

    console.log({
      currentDate,
      today: moment(),
      time: user.tokenTimeToLive,
      ttl: moment(user.tokenTimeToLive).valueOf(),
    });
    console.log(
      currentDate - (moment(user.tokenTimeToLive).valueOf() + 3600 * 1000),
    );
    if (currentDate > moment(user.tokenTimeToLive).valueOf()) {
      throw new HttpException('Token Expired', HttpStatus.UNAUTHORIZED);
    }
    if (token !== user.confirmUserToken) {
      throw new HttpException('Token Doesnt Match', HttpStatus.UNAUTHORIZED);
    }
    user.isVerified = true;
    user.confirmUserToken = null;
    user.tokenTimeToLive = null;
    await user.save();
  }

  async getPasswordResetLink(email: string) {
    const user = await this.userService.findUserByEmailOrUserName(email);
    const resetPasswordToken = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });

    const expire = moment().add(15, 'minutes').format('YYYY-MM-DD hh:mm:ss');

    user.resetPasswordToken = resetPasswordToken;
    user.tokenTimeToLive = new Date(expire);

    await user.save();
    await this.mailService.sendChangePasswordMail(user);
  }

  async confirmNewPassword(changePasswordDto: ChangePasswordDto) {
    const { email, token, password } = changePasswordDto;
    const user = await this.userService.findUserByEmailOrUserName(email);
    const currentDate = moment().valueOf();

    if (currentDate > moment(user.tokenTimeToLive).valueOf()) {
      throw new HttpException('Token Expired', HttpStatus.UNAUTHORIZED);
    }
    console.log({
      token,
      userToken: user.resetPasswordToken,
    });
    if (token !== user.resetPasswordToken) {
      throw new HttpException('Token Doesnt Match', HttpStatus.UNAUTHORIZED);
    }
    const hashedPass = await bcrypt.hash(password, BCRYPT_HASH_ROUND);
    user.password = hashedPass;
    user.confirmUserToken = null;
    user.tokenTimeToLive = null;
    await user.save();
  }
}
