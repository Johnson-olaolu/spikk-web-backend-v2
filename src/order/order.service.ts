import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpikkConstantsService } from 'src/spikk-constants/spikk-constants.service';
import User from 'src/user/entities/user.entity';
import { OrderStatuses } from 'src/utils/constants';
import { WalletService } from 'src/wallet/wallet.service';
import { Repository } from 'typeorm';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';

@Injectable()
export class OrderService {
  constructor(
    private walletService: WalletService,
    private spikkConstantService: SpikkConstantsService,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async findOrder(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
      relations: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(' could not find order for this id ');
    }
    return order;
  }

  async createOrder(createOrderDto: CreateOrderDto, user: User) {
    const estimatedPrice = createOrderDto.items.reduce(
      (a, b) => b.higherPriceEstimate + a,
      0,
    );
    let deliveryFee: any = await this.spikkConstantService.getConstant(
      'DELIVERY_FEE',
    );
    deliveryFee = parseFloat(deliveryFee);

    const walletTransaction = await this.walletService.initiateEscrowCredit(
      user.wallet.id,
      {
        amount: estimatedPrice + deliveryFee,
        currency: 'NGN',
      },
    );

    const newOrder = await this.orderRepository.save({
      user: user,
      deliveryAddress: createOrderDto.deliveryAddress,
      pickupAddress: createOrderDto.pickupAddress,
      status: OrderStatuses.INITIATED,
      deliveryPrice: deliveryFee,
      transactionReference: walletTransaction.transactionReference,
      estimatedAmount: estimatedPrice,
      extraInfo: createOrderDto.extraInfo,
      totalPrice: estimatedPrice + deliveryFee,
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

  async confirmOrder(confirmOrderDto: ConfirmOrderDto) {
    const order = await this.findOrder(confirmOrderDto.orderId);
    await this.walletService.confirmEscrowCredit(order.transactionReference);
    order.status = OrderStatuses.COMPLETED;
    await order.save();
    return order;
  }

  async findAll() {
    return await this.orderRepository.find();
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
