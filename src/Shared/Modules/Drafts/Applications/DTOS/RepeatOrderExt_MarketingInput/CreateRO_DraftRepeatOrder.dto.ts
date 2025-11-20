import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsBoolean,
  isNumber,
  IsDateString,
} from 'class-validator';

import {
  DomisiliEnum,
  RumahDomisiliEnum,
  StatusRumahEnum,
} from 'src/Shared/Enums/External/Address.enum';

import {
  CLIENT_TYPE,
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/External/Client-External.enum';
// import {
//   PenjaminEnum,
//   RiwayatPinjamPenjaminEnum,
// } from 'src/Shared/Enums/External/Collateral.enum';
import { StatusKaryawanEnum } from 'src/Shared/Enums/External/Job.enum';
import {
  JenisPembiayaanEnum,
  StatusPengajuanEnum,
  StatusPinjamanEnum,
} from 'src/Shared/Enums/External/Loan-Application.enum';
import {
  HubunganPenjaminEnum,
  PersetujuanPenjaminEnum,
} from 'src/Shared/Enums/External/Loan-Guarantor.enum';
import { CicilanLainEnum } from 'src/Shared/Enums/External/Other-Exist-Loans.enum';

// ================= Client =================
class ClientExternalDto {
  @IsString()
  nama_lengkap: string;

  @IsString()
  nik: string;

  @IsString()
  no_kk: string;

  @IsString()
  no_rek: string;

  @IsString()
  foto_rekening: string;

  @IsEnum(GENDER)
  jenis_kelamin: GENDER;

  @IsString()
  tempat_lahir: string;

  @Type(() => Date)
  @IsDate()
  tanggal_lahir: Date;

  @IsString()
  no_hp: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(MARRIAGE_STATUS)
  status_nikah: MARRIAGE_STATUS;

  @IsOptional()
  @IsString()
  foto_ktp_peminjam?: string;

  @IsOptional()
  @IsString()
  foto_ktp_penjamin?: string;

  @IsOptional()
  @IsString()
  foto_kk_peminjam?: string;

  @IsOptional()
  @IsString()
  foto_kk_penjamin?: string;

  @IsOptional()
  @IsString()
  dokumen_pendukung?: string;

  @IsOptional()
  @IsBoolean()
  validasi_nasabah?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;

  @IsOptional()
  @IsBoolean()
  enable_edit?: boolean;

  @IsOptional()
  @IsNumber()
  points?: number;

  @IsOptional()
  @IsEnum(CLIENT_TYPE)
  tipe_nasabah?: string;
}

// ================= Address =================
class AddressExternalDto {
  @IsString()
  @IsNotEmpty()
  alamat_ktp: string;

  @IsString()
  @IsNotEmpty()
  rt_rw: string;

  @IsString()
  @IsNotEmpty()
  kelurahan: string;

  @IsString()
  @IsNotEmpty()
  kecamatan: string;

  @IsString()
  @IsNotEmpty()
  kota: string;

  @IsString()
  @IsNotEmpty()
  provinsi: string;

  @IsEnum(StatusRumahEnum)
  status_rumah: StatusRumahEnum;

  @IsOptional()
  @IsNumber()
  biaya_perbulan?: number;

  @IsOptional()
  @IsNumber()
  biaya_pertahun?: number;

  @IsEnum(DomisiliEnum)
  domisili: DomisiliEnum;

  @IsOptional()
  @IsString()
  alamat_domisili?: string;

  @IsEnum(RumahDomisiliEnum)
  rumah_domisili: RumahDomisiliEnum;

  @IsOptional()
  @IsNumber()
  biaya_perbulan_domisili?: number;

  @IsOptional()
  @IsNumber()
  biaya_pertahun_domisili?: number;

  @IsOptional()
  @IsString()
  lama_tinggal?: string;

  @IsString()
  @IsNotEmpty()
  atas_nama_listrik: string;

  @IsString()
  @IsNotEmpty()
  hubungan: string;

  @IsOptional()
  @IsString()
  foto_meteran_listrik?: string;

  @IsNotEmpty()
  @IsString()
  share_loc_domisili?: string;

  @IsOptional()
  @IsString()
  share_loc_usaha?: string;

  @IsOptional()
  @IsString()
  share_loc_tempat_kerja?: string;

  @IsOptional()
  @IsBoolean()
  validasi_alamat?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;
}

// ================= Family =================
// class FamilyExternalDto {
//   @IsOptional() @IsString() hubungan?: string;
//   @IsOptional() @IsString() nama?: string;
//   @IsOptional() @IsString() bekerja?: string;
//   @IsOptional() @IsString() no_hp?: string;
//   @IsOptional() @IsString() nama_perusahaan?: string;
//   @IsOptional() @IsString() jabatan?: string;
//   @IsOptional() @IsNumber() penghasilan?: number;
//   @IsOptional() @IsString() alamat_kerja?: string;
// }

// ================= Job =================
class JobExternalDto {
  @IsString()
  @IsNotEmpty()
  perusahaan: string;

  @IsString()
  @IsNotEmpty()
  alamat_perusahaan: string;

  @IsString()
  @IsNotEmpty()
  kontak_perusahaan: string;

  @IsString()
  @IsNotEmpty()
  jabatan: string;

  @IsString()
  @IsNotEmpty()
  lama_kerja: string;

  @IsEnum(StatusKaryawanEnum)
  status_karyawan: StatusKaryawanEnum;

  @IsOptional()
  @IsString()
  lama_kontrak?: string;

  @IsNumber()
  @IsOptional()
  pendapatan_perbulan: number;

  @IsString()
  @IsOptional()
  slip_gaji_peminjam: string;

  @IsString()
  @IsOptional()
  slip_gaji_penjamin: string;

  @IsString()
  @IsOptional()
  id_card_peminjam: string;

  @IsString()
  @IsOptional()
  id_card_penjamin: string;

  @IsString()
  @IsOptional()
  rekening_koran: string;

  @IsOptional()
  @IsBoolean()
  validasi_pekerjaan?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;
}

// ================= Loan Application =================
class LoanApplicationExternalDto {
  @IsEnum(JenisPembiayaanEnum)
  jenis_pembiayaan: JenisPembiayaanEnum;

  @IsNumber()
  nominal_pinjaman: number;

  @IsNumber()
  tenor: number;

  @IsString()
  @IsNotEmpty()
  berkas_jaminan: string;

  @IsEnum(StatusPinjamanEnum)
  @IsOptional()
  status_pinjaman?: StatusPinjamanEnum;

  @IsOptional()
  @IsNumber()
  pinjaman_ke?: number;

  @IsOptional()
  @IsNumber()
  pinjaman_terakhir?: number;

  @IsOptional()
  @IsNumber()
  sisa_pinjaman?: number;

  @IsOptional()
  @IsString()
  realisasi_pinjaman?: string;

  @IsOptional()
  @IsNumber()
  cicilan_perbulan?: number;

  @IsOptional()
  @IsEnum(StatusPengajuanEnum)
  status_pengajuan?: StatusPengajuanEnum;

  @IsOptional()
  @IsBoolean()
  validasi_pengajuan?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;

  @IsOptional()
  @IsString()
  catatan_spv?: string;

  @IsOptional()
  @IsString()
  catatan_marketing?: string;

  @IsOptional()
  @IsBoolean()
  is_banding?: boolean;

  @IsOptional()
  @IsString()
  alasan_banding?: string;
}

// ================= Collateral =================
class CollateralByBPJSDto {
  @IsNumber()
  pengajuan_id: number;

  @IsOptional()
  @IsNumber()
  saldo_bpjs?: number;

  @IsOptional()
  @IsDateString()
  tanggal_bayar_terakhir?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  foto_bpjs?: string;

  @IsOptional()
  @IsString()
  jaminan_tambahan?: string;
}

class CollateralByBPKBDto {
  @IsOptional()
  @IsString()
  atas_nama_bpkb?: string;

  @IsOptional()
  @IsString()
  no_stnk?: string;

  @IsOptional()
  @IsString()
  alamat_pemilik_bpkb?: string;

  @IsOptional()
  @IsString()
  type_kendaraan?: string;

  @IsOptional()
  @IsString()
  tahun_perakitan?: string;

  @IsOptional()
  @IsString()
  warna_kendaraan?: string;

  @IsOptional()
  @IsString()
  stransmisi?: string;

  @IsOptional()
  @IsString()
  no_rangka?: string;

  @IsOptional()
  @IsString()
  foto_no_rangka?: string;

  @IsOptional()
  @IsString()
  no_mesin?: string;

  @IsOptional()
  @IsString()
  foto_no_mesin?: string;

  @IsOptional()
  @IsString()
  foto_faktur_kendaraan?: string;

  @IsOptional()
  @IsString()
  foto_snikb?: string;

  @IsOptional()
  @IsString()
  no_bpkb?: string;

  @IsOptional()
  @IsString()
  dokumen_bpkb?: string; //pdf

  @IsOptional()
  @IsString()
  foto_stnk_depan?: string;

  @IsOptional()
  @IsString()
  foto_stnk_belakang?: string;

  @IsOptional()
  @IsString()
  foto_kendaraan_depan?: string;

  @IsOptional()
  @IsString()
  foto_kendaraan_belakang?: string;

  @IsOptional()
  @IsString()
  foto_kendaraan_samping_kanan?: string;

  @IsOptional()
  @IsString()
  foto_kendaraan_samping_kiri?: string;

  @IsOptional()
  @IsString()
  foto_sambara?: string;

  @IsOptional()
  @IsString()
  foto_kwitansi_jual_beli?: string;

  @IsOptional()
  @IsString()
  foto_ktp_tangan_pertama?: string;
}

class CollateralByKedinasanMOUDto {
  @IsOptional()
  @IsString()
  instansi?: string;

  @IsOptional()
  @IsString()
  surat_permohonan_kredit?: string;

  @IsOptional()
  @IsString()
  surat_pernyataan_penjamin?: string;

  @IsOptional()
  @IsString()
  surat_persetujuan_pimpinan?: string;

  @IsOptional()
  @IsString()
  surat_keterangan_gaji?: string;

  @IsOptional()
  @IsString()
  foto_form_pengajuan?: string;

  @IsOptional()
  @IsString()
  foto_surat_kuasa_pemotongan?: string;

  @IsOptional()
  @IsString()
  foto_surat_pernyataan_peminjam?: string;

  @IsOptional()
  @IsString()
  foto_sk_golongan_terbaru?: string;

  @IsOptional()
  @IsString()
  foto_keterangan_tpp?: string;

  @IsOptional()
  @IsString()
  foto_biaya_operasional?: string;

  @IsOptional()
  @IsString()
  foto_surat_kontrak?: string; //!! MASIH BINGUNG

  @IsOptional()
  @IsString()
  foto_rekomendasi_bendahara?: string;
}

class CollateralByKedinasanNonMOUDto {
  @IsOptional()
  @IsString()
  instansi?: string;

  @IsOptional()
  @IsString()
  surat_permohonan_kredit?: string;

  @IsOptional()
  @IsString()
  surat_pernyataan_penjamin?: string;

  @IsOptional()
  @IsString()
  surat_persetujuan_pimpinan?: string;

  @IsOptional()
  @IsString()
  surat_keterangan_gaji?: string;

  @IsOptional()
  @IsString()
  foto_surat_kontrak?: string;

  @IsOptional()
  @IsString()
  foto_keterangan_tpp?: string;

  @IsOptional()
  @IsString()
  foto_biaya_operasional?: string;
}

class CollateralByKedinasanSHMDto {
  @IsOptional()
  @IsString()
  atas_nama_shm?: string;

  @IsOptional()
  @IsString()
  hubungan_shm?: string;

  @IsOptional()
  @IsString()
  alamat_shm?: string;

  @IsOptional()
  @IsString()
  luas_shm?: string;

  @IsOptional()
  @IsString()
  njop_shm?: string;

  @IsOptional()
  @IsString()
  foto_shm?: string;

  @IsOptional()
  @IsString()
  foto_kk_pemilik_shm?: string;

  @IsOptional()
  @IsString()
  foto_pbb?: string;

  @IsOptional()
  @IsString()
  foto_objek_jaminan?: string; //array

  @IsOptional()
  @IsString()
  foto_buku_nikah_suami?: string;

  @IsOptional()
  @IsString()
  foto_buku_nikah_istri?: string;

  @IsOptional()
  @IsString()
  foto_npwp?: string;

  @IsOptional()
  @IsString()
  foto_imb?: string;

  @IsOptional()
  @IsString()
  foto_surat_ahli_waris?: string;

  @IsOptional()
  @IsString()
  foto_surat_akte_kematian?: string;

  @IsOptional()
  @IsString()
  foto_surat_pernyataan_kepemilikan_tanah?: string;

  @IsOptional()
  @IsString()
  foto_surat_pernyataan_tidak_dalam_sengketa?: string;
}

class CollateralByKedinasanUMKMDto {
  @IsOptional()
  @IsString()
  foto_sku?: string;

  @IsOptional()
  @IsString()
  foto_usaha?: string; //!! AARAYYYY MASSSS

  @IsOptional()
  @IsString()
  foto_pembukuan?: string;
}

class EmergencyContactDto {
  @IsString()
  @IsNotEmpty()
  nama_kontak_darurat: string;

  @IsString()
  @IsNotEmpty()
  hubungan_kontak_darurat: string;

  @IsString()
  @IsNotEmpty()
  no_hp_kontak_darurat: string;

  @IsOptional()
  @IsBoolean()
  validasi_kontak_darurat?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;
}

class FinancialDependentsDto {
  @IsOptional()
  @IsString()
  kondisi_tanggungan?: string;

  @IsOptional()
  @IsBoolean()
  validasi_tanggungan?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;
}

class LoanGuarantorDto {
  @IsEnum(HubunganPenjaminEnum)
  hubungan_penjamin: HubunganPenjaminEnum;

  @IsString()
  @IsNotEmpty()
  nama_penjamin: string;

  @IsString()
  @IsNotEmpty()
  pekerjaan_penjamin: string;

  @IsNumber()
  penghasilan_penjamin: number;

  @IsString()
  @IsNotEmpty()
  no_hp_penjamin: string;

  @IsEnum(PersetujuanPenjaminEnum)
  persetujuan_penjamin: PersetujuanPenjaminEnum;

  @IsString()
  @IsNotEmpty()
  foto_ktp_penjamin: string;

  @IsOptional()
  @IsBoolean()
  validasi_penjamin?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;
}

class OtherExistLoanDto {
  @IsEnum(CicilanLainEnum)
  cicilan_lain: CicilanLainEnum;

  @IsString()
  @IsNotEmpty()
  nama_pembiayaan: string;

  @IsOptional()
  @IsString()
  total_pinjaman?: string;

  @IsNumber()
  cicilan_perbulan: number;

  @IsNumber()
  sisa_tenor: number;

  @IsOptional()
  @IsBoolean()
  validasi_pinjaman_lain?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;
}

// ================= Relative =================
// class RelativeExternalDto {
//   @IsOptional() @IsString() kerabat_kerja?: string;
//   @IsOptional() @IsString() nama?: string;
//   @IsOptional() @IsString() alamat?: string;
//   @IsOptional() @IsString() no_hp?: string;
//   @IsOptional() @IsString() status_hubungan?: string;
//   @IsOptional() @IsString() nama_perusahaan?: string;
// }

// ================= Uploaded Files =================
class UploadedFilesDto {
  @IsOptional() @IsString() foto_ktp?: string;
  @IsOptional() @IsString() foto_kk?: string;
  @IsOptional() @IsString() foto_id_card?: string;
  @IsOptional() @IsString() foto_rekening?: string;
}

export class PayloadExternalDTO {
  @ValidateNested()
  @Type(() => ClientExternalDto)
  client_external: ClientExternalDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressExternalDto)
  address_external?: AddressExternalDto;

  // @IsOptional()
  // @ValidateNested()
  // @Type(() => FamilyExternalDto)
  // family_external?: FamilyExternalDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => JobExternalDto)
  job_external?: JobExternalDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LoanApplicationExternalDto)
  loan_application_external?: LoanApplicationExternalDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergency_contact_dto?: EmergencyContactDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FinancialDependentsDto)
  financial_dependents?: FinancialDependentsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LoanGuarantorDto)
  loan_guarantor?: LoanGuarantorDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => OtherExistLoanDto)
  other_exist_loan?: OtherExistLoanDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CollateralByBPJSDto)
  collateral_bpjs?: CollateralByBPJSDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CollateralByBPKBDto)
  collateral_bpkb?: CollateralByBPKBDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CollateralByKedinasanMOUDto)
  collateral_kedinasan_mou?: CollateralByKedinasanMOUDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CollateralByKedinasanNonMOUDto)
  collateral_kedinasan_non_mou?: CollateralByKedinasanNonMOUDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CollateralByKedinasanSHMDto)
  collateral_shm?: CollateralByKedinasanSHMDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CollateralByKedinasanUMKMDto)
  collateral_umkm?: CollateralByKedinasanUMKMDto;

  // @IsOptional()
  // @ValidateNested()
  // @Type(() => RelativeExternalDto)
  // relative_external?: RelativeExternalDto;

  marketing_id: number;
}

export class CreateDraftRepeatOrderDto {
  @ValidateNested()
  @Type(() => PayloadExternalDTO)
  payload: PayloadExternalDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => UploadedFilesDto)
  uploaded_files?: UploadedFilesDto;
}
