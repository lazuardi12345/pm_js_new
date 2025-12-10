import { IsString, IsNumber, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateRepaymentDataDto {
  @IsString()
  @IsNotEmpty()
  id_pinjam: string;

  @IsString()
  @IsNotEmpty()
  nama_konsumen: string;

  @IsString()
  divisi: string;

  @IsDateString()
  tgl_pencairan: Date;

  @IsNumber()
  pokok_pinjaman: number;

  @IsString()
  jumlah_tenor_seharusnya: string;

  @IsNumber()
  cicilan_per_bulan: number;

  @IsNumber()
  pinjaman_ke: number;

  @IsString()
  sisa_tenor: string;

  @IsNumber()
  sisa_pinjaman: number;
}
