import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
export class CreateUserDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() userName: string;
  @IsString() @IsEmail() email: string;
  @IsString() @Length(6) password: string;
}
