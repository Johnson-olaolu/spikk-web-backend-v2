import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class OrderDto {
  @IsString() name: string;
  @IsString() @IsOptional() image: string;
  @IsNumber() lowerPriceEstimate: number;
  @IsNumber() higherPriceEstimate: number;
  @IsString() description: string;
}

export class CreateOrderDto {
  @IsString() extraInfo: string;
  @IsString() pickupAddress: string;
  @IsString() deliveryAddress: string;
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({
    each: true,
  })
  @Type(() => OrderDto)
  items: OrderDto[];
}
