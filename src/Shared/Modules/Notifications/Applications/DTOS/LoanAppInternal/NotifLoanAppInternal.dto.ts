import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsOptional()
  @IsString()
  id?: string; // biarin optional, biasanya auto-generate dari DB

  @IsNumber()
  @IsNotEmpty()
  user_id: number; // user yang dapat notif

  @IsNumber()
  @IsNotEmpty()
  loan_app_id: number; // referensi loan application

  @IsString()
  @IsNotEmpty()
  message: string; // isi notif

  @IsOptional()
  @Type(() => Date)
  createdAt?: Date; // timestamp otomatis dari DB

  @IsOptional()
  @Type(() => Date)
  updatedAt?: Date; // timestamp otomatis dari DB

  @IsOptional()
  isRead?: boolean; // default false
}
