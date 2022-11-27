import { IsNotEmpty, IsString } from 'class-validator';

export class ConfimUserDto {
  @IsString() @IsNotEmpty() email: string;
  @IsString() @IsNotEmpty() token: string;
}
