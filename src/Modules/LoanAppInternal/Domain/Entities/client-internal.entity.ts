import {
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/Internal/Clients.enum';
import { FileMetadata } from 'src/Shared/Modules/Storage/Domain/Repositories/IFileStorage.repository';

export class ClientInternal {
  public readonly id?: number;
  public readonly marketing: { id: number }; // ubah, biar sama dengan ORM
  public readonly created_at: Date;
  public readonly deleted_at?: Date | null;

  public nama_lengkap: string;
  public no_ktp: string;
  public jenis_kelamin: GENDER;
  public tempat_lahir: string;
  public tanggal_lahir: Date;
  public enable_edit: boolean;
  public points?: string;
  public updated_at: Date;
  foto_ktp_penjamin?: FileMetadata;
  foto_id_card_penjamin?: FileMetadata;
  bukti_absensi_file?: FileMetadata;

  constructor(
    marketing: { id: number },
    nama_lengkap: string,
    no_ktp: string,
    jenis_kelamin: GENDER,
    tempat_lahir: string,
    tanggal_lahir: Date,
    id?: number,
    enable_edit: boolean = false,
    points?: string,
    created_at: Date = new Date(),
    updated_at: Date = new Date(),
    deleted_at: Date | null = null,
  ) {
    this.marketing = marketing;
    this.nama_lengkap = nama_lengkap;
    this.no_ktp = no_ktp;
    this.jenis_kelamin = jenis_kelamin;
    this.tempat_lahir = tempat_lahir;
    this.tanggal_lahir = tanggal_lahir;

    this.id = id;
    this.enable_edit = enable_edit;
    this.points = points;

    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted_at = deleted_at;
  }
  // Validations
  public isKtpValid(): boolean {
    return this.no_ktp.length === 16;
  }
}
