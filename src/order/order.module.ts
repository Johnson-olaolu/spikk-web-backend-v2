import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { WalletModule } from 'src/wallet/wallet.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    WalletModule,
    UserModule,
    TypeOrmModule.forFeature([Order, OrderItem]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
