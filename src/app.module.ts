import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { MonnifyModule } from './monnify/monnify.module';
import { OrderModule } from './order/order.module';
import { SpikkConstantsModule } from './spikk-constants/spikk-constants.module';
import { SeedModule } from './seed/seed.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './utils/ExceptionFilter';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    MailModule,
    WalletModule,
    TransactionModule,
    MonnifyModule,
    SeedModule,
    CacheModule.register({
      isGlobal: true,
    }),
    OrderModule,
    SpikkConstantsModule,
  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
    AppService,
  ],
})
export class AppModule {}
