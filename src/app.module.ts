import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { MonnifyModule } from './monnify/monnify.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    MailModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../assets'),
      serveStaticOptions: {
        index: false,
      },
    }),
    WalletModule,
    TransactionModule,
    MonnifyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
