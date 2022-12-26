import { IsOptional, IsString } from 'class-validator';

export class ConfirmOrderDto {
  @IsString() orderId: string;
  @IsString() @IsOptional() spikkerId: string;
}
