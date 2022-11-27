import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import User from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfimUserDto } from './dto/confirm-user.dto';
import { GenerateConfirmAccountToken } from './dto/generateConfirmUserToken.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async registerNewUser(@Body() registerUserDto: RegisterDto) {
    await this.authService.registerNewUser(registerUserDto);
    return {
      success: true,
      message:
        'user registered successfully, please check your email to confirm account',
    };
  }

  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async loginUser(@Req() request: Request) {
    const user = request.user as User;
    const data = await this.authService.loginUser(user);
    return {
      success: true,
      message: 'user logged in successfully',
      data: data,
    };
  }

  @Get('confirm-account')
  async getNewConfirmAccountToken(
    @Query() generateConfirmAccountToken: GenerateConfirmAccountToken,
  ) {
    const data = await this.authService.generateConfirmAccountToken(
      generateConfirmAccountToken.email,
    );
    return {
      success: true,
      message: ' please check your email to confirm account',
      data: data,
    };
  }

  @Post('confirm-account')
  async confirmAccount(@Body() confirmUsertDto: ConfimUserDto) {
    const data = await this.authService.confirmNewUser(confirmUsertDto);
    return {
      success: true,
      message: 'user account confirmed',
      data: data,
    };
  }

  @Get('change-password')
  async getChangePasswordLink(
    @Query() generatePasswordToken: GenerateConfirmAccountToken,
  ) {
    const data = await this.authService.getPasswordResetLink(
      generatePasswordToken.email,
    );
    return {
      success: true,
      message: 'password reset link shas been sent to your email',
      data: data,
    };
  }

  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const data = await this.authService.confirmNewPassword(changePasswordDto);
    return {
      success: true,
      message: 'your password has been changed succesfully',
      data: data,
    };
  }
}
