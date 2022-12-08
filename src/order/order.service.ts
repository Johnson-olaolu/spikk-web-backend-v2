import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/user/entities/user.entity';
import { OrderStatuses } from 'src/utils/constants';
import { WalletService } from 'src/wallet/wallet.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';

@Injectable()
export class OrderService {
  constructor(
    private walletService: WalletService,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, user: User) {
    const estimatedPrice = createOrderDto.items.reduce(
      (a, b) => b.higherPriceEstimate + a,
      0,
    );

    const walletTransaction = await this.walletService.initiateEscrowCredit(
      user.wallet.id,
      {
        amount: estimatedPrice,
        currency: 'NGN',
      },
    );
    const newOrder = await this.orderRepository.save({
      user: user,
      deliveryAddress: createOrderDto.deliveryAddress,
      pickupAddress: createOrderDto.pickupAddress,
      status: OrderStatuses.INITIATED,
      deliveryPrice: 0,
      transactionReference: walletTransaction.transactionReference,
      estimatedAmount: estimatedPrice,
      extraInfo: createOrderDto.extraInfo,
      totalPrice: estimatedPrice + 0,
    });
    for (const item of createOrderDto.items) {
      await this.orderItemRepository.save({
        lowerPriceEstimate: item.lowerPriceEstimate,
        higherPriceEstimate: item.higherPriceEstimate,
        image: item.image,
        name: item.name,
        description: item.description,
        order: newOrder,
      });
    }
    return newOrder;
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
