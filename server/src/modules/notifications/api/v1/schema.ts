import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterSchema {
  @IsString()
  @IsNotEmpty()
  token: string;
}
