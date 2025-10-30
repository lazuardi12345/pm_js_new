import {
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/Internal/Clients.enum';
import { FileMetadata } from 'src/Shared/Modules/Storage/Domain/Repositories/IFileStorage.repository';

export class ClientInternalProfile {
  public readonly nasabah: { id: number }; // ubah, biar sama dengan ORM
  public readonly id?: number;
  public readonly created_at: Date;
  public readonly deleted_at?: Date | null;

  public nama_lengkap: string;
  public jenis_kelamin: GENDER;
  public no_hp: string;
  public status_nikah: MARRIAGE_STATUS;
  public email?: string;
  public foto_ktp?: string;
  public foto_kk?: string;
  public foto_id_card?: string;
  public foto_rekening?: string;
  public no_rekening?: string;
  public updated_at: Date;
  foto_ktp_penjamin?: FileMetadata;
  foto_id_card_penjamin?: FileMetadata;
  bukti_absensi_file?: FileMetadata;

  constructor(
    nasabah: { id: number },
    nama_lengkap: string,
    jenis_kelamin: GENDER,
    no_hp: string,
    status_nikah: MARRIAGE_STATUS,
    id?: number,
    email?: string,
    foto_ktp?: string,
    foto_kk?: string,
    foto_id_card?: string,
    foto_rekening?: string,
    no_rekening?: string,
    created_at: Date = new Date(),
    updated_at: Date = new Date(),
    deleted_at: Date | null = null,
  ) {
    this.nasabah = typeof nasabah === 'number' ? { id: nasabah } : nasabah;
    this.nama_lengkap = nama_lengkap;
    this.jenis_kelamin = jenis_kelamin;
    this.no_hp = no_hp;
    this.status_nikah = status_nikah;

    this.id = id;
    this.email = email;
    this.foto_ktp = foto_ktp;
    this.foto_kk = foto_kk;
    this.foto_id_card = foto_id_card;
    this.foto_rekening = foto_rekening;
    this.no_rekening = no_rekening;

    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted_at = deleted_at;
  }

  public isMarriageStatusValid(): boolean {
    return Object.values(MARRIAGE_STATUS).includes(this.status_nikah);
  }
}
