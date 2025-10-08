// import {
//   IsString,
//   IsNotEmpty,
//   IsNumber,
//   IsEnum,
//   IsOptional,
//   IsBoolean,
// } from 'class-validator';
// import { StatusKonsumenEnum } from '../entities/repeat-orders.entity';

// export class CreateRepeatOrdersDto {
//   @IsNumber()
//   marketing_id: number;

//   @IsString()
//   @IsNotEmpty()
//   nama_lengkap: string;

//   @IsString()
//   @IsNotEmpty()
//   nik: string;

//   @IsString()
//   @IsNotEmpty()
//   no_hp: string;

//   @IsNumber()
//   nominal_pinjaman: number;

//   @IsNumber()
//   tenor: number;

//   @IsNumber()
//   pinjaman_ke: number;

//   @IsString()
//   @IsNotEmpty()
//   nama_marketing: string;

//   @IsEnum(StatusKonsumenEnum)
//   status_konsumen: StatusKonsumenEnum;

//   @IsOptional()
//   @IsString()
//   alasan_topup?: string;

//   @IsOptional()
//   @IsBoolean()
//   is_clear?: boolean;
// }
