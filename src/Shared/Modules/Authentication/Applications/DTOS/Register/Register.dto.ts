import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  nama: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  usertype: string;
  @IsString()
  type: string;
  @IsString()
  marketing_code: string;
  @IsOptional()
  @IsNumber()
  spv_id?: number;
  @IsBoolean()
  is_active: boolean;
}
