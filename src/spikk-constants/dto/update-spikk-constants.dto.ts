import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsString,
  ValidateNested,
} from 'class-validator';

class ConstantsDto {
  @IsString() key: string;
  @IsDefined() value: string;
}

export class UpdateSpikkConstantsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({
    each: true,
  })
  @Type(() => ConstantsDto)
  items: ConstantsDto[];
}
