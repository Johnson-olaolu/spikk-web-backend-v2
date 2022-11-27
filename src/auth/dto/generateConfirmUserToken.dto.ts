import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateConfirmAccountToken {
  @IsString() @IsNotEmpty() email: string;
}
