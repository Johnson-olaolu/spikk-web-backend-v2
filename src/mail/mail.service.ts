import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import User from 'src/user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserConfirmationMail(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Spikk! Confirm your Email',
      template: './registrationMail', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.name,
        token: user.confirmUserToken,
        date: moment().format('DD MMM'),
      },
    });
  }

  async sendChangePasswordMail(user: User) {
    const url = `${this.configService.get(
      'CLIENT_BASE_URL',
    )}/auth/change-password?email=${user.email}&token=${
      user.resetPasswordToken
    }`;
    console.log(url);
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Change Password',
      template: './changePasswordMail', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.name,
        url: url,
        date: moment().format('DD MMM'),
      },
    });
  }
}
