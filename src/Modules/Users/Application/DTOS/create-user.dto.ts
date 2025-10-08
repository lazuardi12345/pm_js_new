import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TYPE, USERTYPE, USERSTATUS } from 'src/Shared/Enums/Users/Users.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(USERTYPE)
  @IsOptional()
  usertype?: USERTYPE = USERTYPE.MARKETING;

  @IsEnum(TYPE)
  type: TYPE;

  @IsOptional()
  @IsString()
  marketing_code?: string;

  @IsOptional()
  @IsEnum(USERSTATUS)
  is_active?: USERSTATUS = USERSTATUS.ACTIVE;

  @IsOptional()
  @IsNumber()
  spvId?: number;
}
