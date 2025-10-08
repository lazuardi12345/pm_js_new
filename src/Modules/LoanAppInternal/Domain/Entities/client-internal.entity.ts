import { GENDER, MARRIAGE_STATUS } from "src/Shared/Enums/Internal/Clients.enum";

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
  public no_hp: string;
  public status_nikah: MARRIAGE_STATUS;
  public email?: string;
  public foto_ktp?: string;
  public foto_kk?: string;
  public foto_id_card?: string;
  public foto_rekening?: string;
  public no_rekening?: string;
  public enable_edit: boolean;
  public points?: string;
  public updated_at: Date;

  constructor(
    marketing: { id: number },
    nama_lengkap: string,
    no_ktp: string,
    jenis_kelamin: GENDER,
    tempat_lahir: string,
    tanggal_lahir: Date,
    no_hp: string,
    status_nikah: MARRIAGE_STATUS,
    id?: number,
    email?: string,
    foto_ktp?: string,
    foto_kk?: string,
    foto_id_card?: string,
    foto_rekening?: string,
    no_rekening?: string,
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
    this.no_hp = no_hp;
    this.status_nikah = status_nikah;

    this.id = id;
    this.email = email;
    this.foto_ktp = foto_ktp;
    this.foto_kk = foto_kk;
    this.foto_id_card = foto_id_card;
    this.foto_rekening = foto_rekening;
    this.no_rekening = no_rekening;
    this. enable_edit =  enable_edit;
    this.points = points;

    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted_at = deleted_at;
  }
    // Validations
  public isKtpValid(): boolean {
    return this.no_ktp.length === 16;
  }

  public isMarriageStatusValid(): boolean {
    return Object.values(MARRIAGE_STATUS).includes(this.status_nikah);
  }

}
