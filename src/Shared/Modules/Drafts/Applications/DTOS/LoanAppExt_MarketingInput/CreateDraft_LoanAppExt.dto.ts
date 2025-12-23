import { Transform, Type } from 'class-transformer';
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
import { ExternalCollateralType } from 'src/Shared/Enums/General/General.enum';
import { IsArray } from 'class-validator';

// ================= Client =================
class ClientExternalDto {
  @IsString()
  nama_lengkap: string;

  @IsString()
  nik: string;

  @IsOptional()
  @IsString()
  no_kk?: string;

  @IsNotEmpty()
  @IsString()
  no_rek: string;

  @IsOptional()
  @IsString()
  foto_rekening: string;

  @IsOptional()
  @IsEnum(GENDER)
  jenis_kelamin: GENDER;

  @IsOptional()
  @IsString()
  tempat_lahir: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggal_lahir: Date;

  @IsOptional()
  @IsString()
  no_hp: string;

  @IsOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
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
  @IsOptional()
  alamat_ktp: string;

  @IsString()
  @IsOptional()
  rt_rw: string;

  @IsString()
  @IsOptional()
  kelurahan: string;

  @IsString()
  @IsOptional()
  kecamatan: string;

  @IsString()
  @IsOptional()
  kota: string;

  @IsString()
  @IsOptional()
  provinsi: string;

  @IsOptional()
  @IsEnum(StatusRumahEnum)
  status_rumah: StatusRumahEnum;

  @IsOptional()
  @IsNumber()
  biaya_perbulan?: number;

  @IsOptional()
  @IsNumber()
  biaya_pertahun?: number;

  @IsOptional()
  @IsEnum(DomisiliEnum)
  domisili: DomisiliEnum;

  @IsOptional()
  @IsString()
  alamat_domisili?: string;

  @IsOptional()
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
  @IsOptional()
  atas_nama_listrik: string;

  @IsString()
  @IsOptional()
  hubungan: string;

  @IsOptional()
  @IsString()
  foto_meteran_listrik?: string;

  @IsOptional()
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
  @IsOptional()
  perusahaan: string;

  @IsString()
  @IsOptional()
  alamat_perusahaan: string;

  @IsString()
  @IsOptional()
  kontak_perusahaan: string;

  @IsString()
  @IsOptional()
  jabatan: string;

  @IsString()
  @IsOptional()
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
  @IsNotEmpty()
  foto_id_card_peminjam: string;

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
  @IsOptional()
  @IsEnum(JenisPembiayaanEnum)
  jenis_pembiayaan: JenisPembiayaanEnum;

  @IsNumber()
  nominal_pinjaman: number;

  @IsOptional()
  @IsNumber()
  tenor: number;

  @IsString()
  @IsOptional()
  berkas_jaminan?: string;

  @IsEnum(StatusPinjamanEnum)
  @IsNotEmpty()
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

class CollateralBySHMDto {
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
  foto_objek_jaminan?: string;

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

class CollateralByUMKMDto {
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
  @IsOptional()
  nama_kontak_darurat: string;

  @IsString()
  @IsOptional()
  hubungan_kontak_darurat: string;

  @IsString()
  @IsOptional()
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
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(HubunganPenjaminEnum)
  @IsOptional()
  hubungan_penjamin?: HubunganPenjaminEnum;

  @IsString()
  @IsOptional()
  nama_penjamin: string;

  @IsString()
  @IsOptional()
  pekerjaan_penjamin: string;

  @IsOptional()
  @IsNumber()
  penghasilan_penjamin: number;

  @IsString()
  @IsOptional()
  no_hp_penjamin: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(PersetujuanPenjaminEnum)
  @IsOptional()
  persetujuan_penjamin?: PersetujuanPenjaminEnum;

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

  @IsOptional()
  @IsString()
  nama_pembiayaan?: string;

  @IsOptional()
  @IsString()
  total_pinjaman?: string;

  @Type(() => Number)
  @IsNumber()
  cicilan_perbulan: number;

  @Type(() => Number)
  @IsNumber()
  sisa_tenor: number;

  @IsOptional()
  @IsBoolean()
  validasi_pinjaman_lain?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;
}

// ================= Uploaded Files =================
class UploadedFilesDto {
  @IsOptional() @IsString() foto_ktp_peminjam?: string;
}

export class PayloadExternalDTO {
  @ValidateNested()
  @Type(() => ClientExternalDto)
  client_external: ClientExternalDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressExternalDto)
  address_external?: AddressExternalDto;

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
  emergency_contact_external?: EmergencyContactDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FinancialDependentsDto)
  financial_dependents_external?: FinancialDependentsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LoanGuarantorDto)
  loan_guarantor_external?: LoanGuarantorDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OtherExistLoanDto)
  other_exist_loan_external?: OtherExistLoanDto[];

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
  @Type(() => CollateralBySHMDto)
  collateral_shm?: CollateralBySHMDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CollateralByUMKMDto)
  collateral_umkm?: CollateralByUMKMDto;

  @IsNotEmpty({ message: 'Marketing ID is required' })
  marketing_id: number;

  @IsNotEmpty({ message: 'Loan external type is required' })
  @IsEnum(ExternalCollateralType, {
    message:
      'Invalid collateral type. Must be one of: BPJS, BPKB, KEDINASAN_MOU, KEDINASAN_NON_MOU, SHM, UMKM',
  })
  loan_external_type: ExternalCollateralType;
}

export class CreateDraftLoanApplicationExtDto {
  @ValidateNested()
  @Type(() => PayloadExternalDTO)
  payload: PayloadExternalDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => UploadedFilesDto)
  uploaded_files?: UploadedFilesDto;
}
