import {
  CLIENT_TYPE,
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/Internal/Clients.enum';
import { FileMetadata } from 'src/Shared/Modules/Storage/Domain/Repositories/IFileStorage.repository';

export class ClientExternalProfile {
  public readonly nasabah: { id: number }; // ubah, biar sama dengan ORM
  public readonly pengajuan: { id: number } | undefined;
  public readonly id?: number;
  public readonly created_at: Date;
  public readonly deleted_at?: Date | null;

  public nama_lengkap: string;
  public no_rek: string;
  public jenis_kelamin: GENDER;
  public no_hp: string;
  public status_nikah: MARRIAGE_STATUS;

  public email?: string;
  public foto_rekening?: string;
  public foto_ktp_peminjam?: string;
  public foto_ktp_penjamin?: string;
  public foto_kk_peminjam?: string;
  public foto_kk_penjamin?: string;
  public dokumen_pendukung?: string;
  public validasi_nasabah?: boolean;
  public catatan?: string;
  public enable_edit?: boolean;
  public points?: number;
  public tipe_nasabah?: string;

  public updated_at?: Date;

  constructor(
    nasabah: { id: number },
    pengajuan: { id: number } | undefined,
    nama_lengkap: string,
    no_rek: string,
    jenis_kelamin: GENDER,
    no_hp: string,
    status_nikah: MARRIAGE_STATUS,
    id?: number,
    email?: string,
    foto_rekening?: string,
    foto_ktp_peminjam?: string,
    foto_ktp_penjamin?: string,
    foto_kk_peminjam?: string,
    foto_kk_penjamin?: string,
    dokumen_pendukung?: string,
    validasi_nasabah?: boolean,
    catatan?: string,
    enable_edit?: boolean,
    created_at: Date = new Date(),
    updated_at: Date = new Date(),
    deleted_at: Date | null = null,
  ) {
    this.nasabah = typeof nasabah === 'number' ? { id: nasabah } : nasabah;
    this.pengajuan =
      typeof pengajuan === 'number' ? { id: pengajuan } : pengajuan;
    this.nama_lengkap = nama_lengkap;
    this.no_rek = no_rek;
    this.foto_rekening = foto_rekening;
    this.jenis_kelamin = jenis_kelamin;
    this.no_hp = no_hp;
    this.status_nikah = status_nikah;

    this.id = id;
    this.email = email;
    this.foto_ktp_peminjam = foto_ktp_peminjam;
    this.foto_ktp_penjamin = foto_ktp_penjamin;
    this.foto_kk_peminjam = foto_kk_peminjam;
    this.foto_kk_penjamin = foto_kk_penjamin;
    this.dokumen_pendukung = dokumen_pendukung;
    this.validasi_nasabah = validasi_nasabah;
    this.catatan = catatan;
    this.enable_edit = enable_edit;

    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted_at = deleted_at;
  }

  public isMarriageStatusValid(): boolean {
    return Object.values(MARRIAGE_STATUS).includes(this.status_nikah);
  }
}
