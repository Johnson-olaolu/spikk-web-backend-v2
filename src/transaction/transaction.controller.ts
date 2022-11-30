import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '@nestjs/passport';
import { ConfirmCreditQueryDto } from './dto/confirm-credit.dto';
import { Response } from 'express';
import { join } from 'path';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @Post('initiate-credit')
  async initiateCredit(@Body() createTransactionDto: CreateTransactionDto) {
    const data = await this.transactionService.create(createTransactionDto);
    return {
      success: true,
      message: 'transaction link generated',
      data,
    };
  }

  @Get('confirm-credit')
  async confirmCredit(
    @Query() confirmCreditDto: ConfirmCreditQueryDto,
    @Res() res: Response,
  ) {
    await this.transactionService.confirmCredit(confirmCreditDto);
    return res.sendFile(
      join(__dirname + '../templates/html/payment-successful.html'),
    );
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
