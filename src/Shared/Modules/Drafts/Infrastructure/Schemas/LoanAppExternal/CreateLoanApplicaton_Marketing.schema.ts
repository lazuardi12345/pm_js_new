import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  DomisiliEnum,
  StatusRumahEnum,
} from 'src/Shared/Enums/External/Address.enum';
import {
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/External/Client-External.enum';
import { StatusKaryawanEnum } from 'src/Shared/Enums/External/Job.enum';
import {
  JenisPembiayaanEnum,
  StatusPengajuanAkhirEnum,
  StatusPengajuanEnum,
  StatusPinjamanEnum,
} from 'src/Shared/Enums/External/Loan-Application.enum';
import {
  HubunganPenjaminEnum,
  PersetujuanPenjaminEnum,
} from 'src/Shared/Enums/External/Loan-Guarantor.enum';
import { CicilanLainEnum } from 'src/Shared/Enums/External/Other-Exist-Loans.enum';
import { ExternalCollateralType } from 'src/Shared/Enums/General/General.enum';

// ================= Client =================
@Schema({ _id: false })
class ClientExternal {
  @Prop({ required: true }) nama_lengkap: string;
  @Prop({ required: true }) nik: string;
  @Prop({ required: true }) no_hp: string;
  @Prop({ required: true }) email: string;
  @Prop() no_kk: string;
  @Prop() no_rek: string;
  @Prop() tempat_lahir: string;
  @Prop() jenis_kelamin: GENDER;
  @Prop() tanggal_lahir: Date;
  @Prop() status_nikah: MARRIAGE_STATUS;
  @Prop() catatan: string;

  @Prop() foto_ktp_peminjam?: string;
  @Prop() foto_ktp_penjamin?: string;
  @Prop() foto_kk_peminjam?: string;
  @Prop() foto_kk_penjamin?: string;
  @Prop() dokumen_pendukung?: string;
  @Prop() foto_rekening?: string;
}
export const ClientExternalSchema =
  SchemaFactory.createForClass(ClientExternal);

// ================= Address =================
@Schema({ _id: false })
class AddressExternal {
  @Prop() alamat_ktp?: string;
  @Prop() rt_rw?: string;
  @Prop() kelurahan?: string;
  @Prop() kecamatan?: string;
  @Prop() kota?: string;
  @Prop() provinsi?: string;
  @Prop() status_rumah?: StatusRumahEnum;
  @Prop() alamat_lengkap?: string;
  @Prop() biaya_perbulan?: number;
  @Prop() biaya_pertahun?: number;
  @Prop() domisili?: string;
  @Prop() alamat_domisili?: string;
  @Prop() rumah_domisili?: string;
  @Prop() biaya_perbulan_domisili?: number;
  @Prop() biaya_pertahun_domisili?: number;
  @Prop() lama_tinggal?: string;
  @Prop() atas_nama_listrik?: string;
  @Prop() hubungan?: string;
  @Prop() validasi_alamat?: string;
  @Prop() catatan?: string;

  @Prop() share_loc_tempat_kerja?: string;
  @Prop() share_loc_usaha?: string;
  @Prop() share_loc_domisili?: string;
  @Prop() foto_meteran_listrik?: string;
}
export const AddressExternalSchema =
  SchemaFactory.createForClass(AddressExternal);

// ================= Job =================
@Schema({ _id: false })
class JobExternal {
  @Prop() perusahaan?: string;
  @Prop() alamat_perusahaan?: string;
  @Prop() kontak_perusahaan?: string;
  @Prop() jabatan?: string;
  @Prop() lama_kerja?: string;
  @Prop() status_karyawan?: StatusKaryawanEnum;
  @Prop() lama_kontrak?: string;
  @Prop() pendapatan_perbulan?: number;
  @Prop() validasi_pekerjaan?: boolean;
  @Prop() catatan?: string;

  @Prop() slip_gaji_peminjam?: string;
  @Prop() slip_gaji_penjamin?: string;
  @Prop() foto_id_card_peminjam: string;
  @Prop() id_card_penjamin?: string;
  @Prop() rekening_koran?: string;
}
export const JobExternalSchema = SchemaFactory.createForClass(JobExternal);

// ================= Loan Application =================
@Schema({ _id: false })
class LoanApplicationExternal {
  @Prop({ required: true }) nominal_pinjaman?: number;
  @Prop() jenis_pembiayaan?: JenisPembiayaanEnum;
  @Prop() pinjaman_ke?: number;
  @Prop() tenor?: number;
  @Prop() status_pinjaman?: StatusPinjamanEnum;
  @Prop() pinjaman_terakhir?: number;
  @Prop() sisa_pinjaman?: number;
  @Prop() realisasi_pinjaman?: string;
  @Prop() cicilan_perbulan?: number;
  @Prop() status_pengajuan?: StatusPengajuanEnum;
  @Prop() status_pengajuan_akhir?: StatusPengajuanAkhirEnum;
  @Prop() validasi_pengajuan?: boolean;
  @Prop() catatan?: string;
  @Prop() catatan_spv?: string;
  @Prop() catatan_marketing?: string;
  @Prop() is_banding?: boolean;
  @Prop() alasan_banding?: string;

  @Prop() berkas_jaminan?: number;
}
export const LoanApplicationExternalSchema = SchemaFactory.createForClass(
  LoanApplicationExternal,
);

@Schema({ _id: false })
export class EmergencyContactExternal {
  @Prop({ type: String })
  nama_kontak_darurat: string;

  @Prop({ type: String })
  hubungan_kontak_darurat: string;

  @Prop({ type: String })
  no_hp_kontak_darurat: string;

  @Prop({ type: Boolean, default: false })
  validasi_kontak_darurat?: boolean;

  @Prop({ type: String })
  catatan?: string;
}

export const EmergencyContactExternalSchema = SchemaFactory.createForClass(
  EmergencyContactExternal,
);

@Schema({ _id: false })
export class FinancialDependentsExternal {
  @Prop({ type: String })
  kondisi_tanggungan?: string;

  @Prop({ type: Boolean, default: false })
  validasi_tanggungan?: boolean;

  @Prop({ type: String })
  catatan?: string;
}

export const FinancialDependentsExternalSchema = SchemaFactory.createForClass(
  FinancialDependentsExternal,
);

@Schema({ _id: false })
export class LoanGuarantorExternal {
  @Prop({
    type: String,
    required: false,
    validate: {
      validator: function (v: string) {
        if (v === '') return true;
        return Object.values(HubunganPenjaminEnum).includes(
          v as HubunganPenjaminEnum,
        );
      },
      message: (props) =>
        `${props.value} is not a valid value for ${props.path}. Value must be in Enum or empty string.`,
    },
  })
  hubungan_penjamin: HubunganPenjaminEnum;

  @Prop({ type: String })
  nama_penjamin: string;

  @Prop({ type: String })
  pekerjaan_penjamin: string;

  @Prop({ type: Number })
  penghasilan_penjamin: number;

  @Prop({ type: String })
  no_hp_penjamin: string;

  @Prop({
    type: String,
    required: false,
    validate: {
      validator: function (v: string) {
        if (v === '') return true;
        return Object.values(PersetujuanPenjaminEnum).includes(
          v as PersetujuanPenjaminEnum,
        );
      },
      message: (props) =>
        `${props.value} is not a valid value for ${props.path}. Value must be in Enum or empty string.`,
    },
  })
  persetujuan_penjamin: PersetujuanPenjaminEnum;

  @Prop({ type: String })
  foto_ktp_penjamin: string;

  @Prop({ type: Boolean, default: false })
  validasi_penjamin?: boolean;

  @Prop({ type: String })
  catatan?: string;
}

export const LoanGuarantorExternalSchema = SchemaFactory.createForClass(
  LoanGuarantorExternal,
);

@Schema({ _id: false })
export class InstallmentItemsExternal {
  @Prop({ type: String, required: true })
  nama_pembiayaan: string;

  @Prop({ type: String })
  total_pinjaman?: string;

  @Prop({ type: Number, required: true })
  cicilan_perbulan: number;

  @Prop({ type: Number, required: true })
  sisa_tenor: number;
}

export const InstallmentItemSchema = SchemaFactory.createForClass(
  InstallmentItemsExternal,
);

@Schema({ _id: false })
export class OtherExistLoansExternal {
  @Prop({ type: String, enum: CicilanLainEnum, required: true })
  cicilan_lain: CicilanLainEnum;

  @Prop({ type: [InstallmentItemSchema], default: [] })
  cicilan: InstallmentItemsExternal[];

  @Prop({ type: Boolean, default: false })
  validasi_pinjaman_lain?: boolean;

  @Prop({ type: String })
  catatan?: string;
}

export const OtherExistLoansExternalSchema = SchemaFactory.createForClass(
  OtherExistLoansExternal,
);

// ================= Collateral =================
@Schema({ _id: false })
export class CollateralByBPJSExternal {
  @Prop({ type: Number })
  saldo_bpjs?: number;

  @Prop({ type: String })
  tanggal_bayar_terakhir?: string;

  @Prop({ type: String })
  username?: string;

  @Prop({ type: String })
  password?: string;

  @Prop({ type: String })
  foto_bpjs?: string;

  @Prop({ type: String })
  jaminan_tambahan?: string;
}

export const CollateralByBPJSExternalSchema = SchemaFactory.createForClass(
  CollateralByBPJSExternal,
);

@Schema({ _id: false })
export class CollateralByBPKBExternal {
  @Prop({ type: String })
  atas_nama_bpkb?: string;

  @Prop({ type: String })
  no_stnk?: string;

  @Prop({ type: String })
  alamat_pemilik_bpkb?: string;

  @Prop({ type: String })
  type_kendaraan?: string;

  @Prop({ type: String })
  tahun_perakitan?: string;

  @Prop({ type: String })
  warna_kendaraan?: string;

  @Prop({ type: String })
  stransmisi?: string;

  @Prop({ type: String })
  no_rangka?: string;

  @Prop({ type: String })
  foto_no_rangka?: string;

  @Prop({ type: String })
  no_mesin?: string;

  @Prop({ type: String })
  foto_no_mesin?: string;

  @Prop({ type: String })
  foto_faktur_kendaraan?: string;

  @Prop({ type: String })
  foto_snikb?: string;

  @Prop({ type: String })
  no_bpkb?: string;

  @Prop({ type: String })
  dokumen_bpkb?: string; // PDF

  @Prop({ type: String })
  foto_stnk_depan?: string;

  @Prop({ type: String })
  foto_stnk_belakang?: string;

  @Prop({ type: String })
  foto_kendaraan_depan?: string;

  @Prop({ type: String })
  foto_kendaraan_belakang?: string;

  @Prop({ type: String })
  foto_kendaraan_samping_kanan?: string;

  @Prop({ type: String })
  foto_kendaraan_samping_kiri?: string;

  @Prop({ type: String })
  foto_sambara?: string;

  @Prop({ type: String })
  foto_kwitansi_jual_beli?: string;

  @Prop({ type: String })
  foto_ktp_tangan_pertama?: string;
}

export const CollateralByBPKBExternalSchema = SchemaFactory.createForClass(
  CollateralByBPKBExternal,
);

@Schema({ _id: false })
export class CollateralBySHMExternal {
  @Prop({ type: String })
  atas_nama_shm?: string;

  @Prop({ type: String })
  hubungan_shm?: string;

  @Prop({ type: String })
  alamat_shm?: string;

  @Prop({ type: String })
  luas_shm?: string;

  @Prop({ type: String })
  njop_shm?: string;

  @Prop({ type: String })
  foto_shm?: string;

  @Prop({ type: String })
  foto_kk_pemilik_shm?: string;

  @Prop({ type: String })
  foto_pbb?: string;

  @Prop({ type: [String] })
  foto_objek_jaminan?: string[]; // ARRAY

  @Prop({ type: String })
  foto_buku_nikah_suami?: string;

  @Prop({ type: String })
  foto_buku_nikah_istri?: string;

  @Prop({ type: String })
  foto_npwp?: string;

  @Prop({ type: String })
  foto_imb?: string;

  @Prop({ type: String })
  foto_surat_ahli_waris?: string;

  @Prop({ type: String })
  foto_surat_akte_kematian?: string;

  @Prop({ type: String })
  foto_surat_pernyataan_kepemilikan_tanah?: string;

  @Prop({ type: String })
  foto_surat_pernyataan_tidak_dalam_sengketa?: string;
}

export const CollateralBySHMExternalSchema = SchemaFactory.createForClass(
  CollateralBySHMExternal,
);

@Schema({ _id: false })
export class CollateralByUMKMExternal {
  @Prop({ type: String })
  foto_sku?: string;

  @Prop({ type: [String] }) // ARRAY STRING
  foto_usaha?: string[];

  @Prop({ type: String })
  foto_pembukuan?: string;
}

export const CollateralByUMKMExternalSchema = SchemaFactory.createForClass(
  CollateralByUMKMExternal,
);

@Schema({ _id: false })
export class CollateralByKedinasanMOUExternal {
  @Prop({ type: String })
  instansi?: string;

  @Prop({ type: String })
  surat_permohonan_kredit?: string;

  @Prop({ type: String })
  surat_pernyataan_penjamin?: string;

  @Prop({ type: String })
  surat_persetujuan_pimpinan?: string;

  @Prop({ type: String })
  surat_keterangan_gaji?: string;

  @Prop({ type: String })
  foto_form_pengajuan?: string;

  @Prop({ type: String })
  foto_surat_kuasa_pemotongan?: string;

  @Prop({ type: String })
  foto_surat_pernyataan_peminjam?: string;

  @Prop({ type: String })
  foto_sk_golongan_terbaru?: string;

  @Prop({ type: String })
  foto_keterangan_tpp?: string;

  @Prop({ type: String })
  foto_biaya_operasional?: string;

  @Prop({ type: String })
  foto_surat_kontrak?: string; // fix, tetep string

  @Prop({ type: String })
  foto_rekomendasi_bendahara?: string;
}

export const CollateralByKedinasanMOUExternalSchema =
  SchemaFactory.createForClass(CollateralByKedinasanMOUExternal);

@Schema({ _id: false })
export class CollateralByKedinasanNonMOUExternal {
  @Prop({ type: String })
  instansi?: string;

  @Prop({ type: String })
  surat_permohonan_kredit?: string;

  @Prop({ type: String })
  surat_pernyataan_penjamin?: string;

  @Prop({ type: String })
  surat_persetujuan_pimpinan?: string;

  @Prop({ type: String })
  surat_keterangan_gaji?: string;

  @Prop({ type: String })
  foto_surat_kontrak?: string;

  @Prop({ type: String })
  foto_keterangan_tpp?: string;

  @Prop({ type: String })
  foto_biaya_operasional?: string;
}

export const CollateralByKedinasanNonMOUExternalSchema =
  SchemaFactory.createForClass(CollateralByKedinasanNonMOUExternal);

// ================= Root LoanApplication =================

@Schema({ timestamps: true })
export class LoanApplicationExt {
  @Prop({ required: true }) marketing_id: number;

  @Prop({ type: ClientExternalSchema })
  client_external: ClientExternal;
  @Prop({ type: AddressExternalSchema }) address_external?: AddressExternal;
  @Prop({ type: JobExternalSchema }) job_external?: JobExternal;
  @Prop({ type: LoanApplicationExternalSchema })
  loan_application_external?: LoanApplicationExternal;
  @Prop({ type: LoanGuarantorExternalSchema })
  loan_guarantor_external?: LoanGuarantorExternal;
  @Prop({ type: CollateralByBPJSExternalSchema })
  collateral_bpjs_external?: CollateralByBPJSExternal;
  @Prop({ type: CollateralByBPKBExternalSchema })
  collateral_bpkb_external?: CollateralByBPKBExternal;
  @Prop({ type: CollateralBySHMExternalSchema })
  collateral_shm_external?: CollateralBySHMExternal;
  @Prop({ type: CollateralByUMKMExternalSchema })
  collateral_umkm_external?: CollateralByUMKMExternal;
  @Prop({ type: CollateralByKedinasanMOUExternalSchema })
  collateral_kedinasan_mou_external?: CollateralByKedinasanMOUExternal;
  @Prop({ type: CollateralByKedinasanNonMOUExternalSchema })
  collateral_kedinasan_non_mou_external?: CollateralByKedinasanNonMOUExternal;
  @Prop({ type: OtherExistLoansExternalSchema })
  other_exist_loan_external?: OtherExistLoansExternal;
  @Prop({ type: InstallmentItemSchema })
  installment_items_external?: InstallmentItemsExternal;
  @Prop({ type: EmergencyContactExternalSchema })
  emergency_contact_external?: EmergencyContactExternal;
  @Prop({ type: FinancialDependentsExternalSchema })
  financial_dependents_external?: FinancialDependentsExternal;

  @Prop({ type: Object })
  uploaded_files?: Record<string, string[]>;
  @Prop({ default: '' }) loan_external_type!: ExternalCollateralType;
  @Prop({ default: false }) isDeleted: boolean; // flag soft delete
  @Prop({ default: false }) isCompleted?: boolean;
  @Prop({ default: false }) isNeedCheck?: boolean;
}

export type LoanApplicationExtDocument = HydratedDocument<LoanApplicationExt>;
export const LoanApplicationExtSchema =
  SchemaFactory.createForClass(LoanApplicationExt);
