import { IsNotEmpty, IsString } from 'class-validator';

export class LoginSchema {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
