import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import User from 'src/user/entities/user.entity';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import RoleGuard from 'src/auth/guards/roleGuards.guard';
import { RoleTypes } from 'src/utils/constants';

@UseGuards(AuthGuard('jwt'))
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request,
  ) {
    const data = await this.orderService.createOrder(
      createOrderDto,
      req.user as User,
    );
    return {
      success: true,
      message: 'order created succesfully',
      data,
    };
  }

  @UseGuards(RoleGuard([RoleTypes.Admin, RoleTypes.SuperAdmin]))
  @Post('confirm')
  async confirmOrder(@Body() confirmOrderDto: ConfirmOrderDto) {
    const data = await this.orderService.confirmOrder(confirmOrderDto);
    return {
      success: true,
      message: 'order confirmed sucessfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.orderService.findAll();
    return {
      success: true,
      message: 'orders fetched successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.orderService.findOrder(id);
    return {
      success: true,
      message: 'order fetched successfully',
      data,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
