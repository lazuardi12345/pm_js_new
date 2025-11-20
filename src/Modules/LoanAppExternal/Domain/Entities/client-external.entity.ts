import {
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/External/Client-External.enum';

export class ClientExternal {
  // Identitas dan relasi
  public readonly id?: number;
  public readonly marketing: { id: number };

  // Metadata
  public readonly created_at: Date;
  public readonly updated_at: Date;
  public readonly deleted_at?: Date | null;

  // Informasi personal
  public nama_lengkap: string;
  public nik: number;
  public no_kk: string;
  public no_rek: string;
  public jenis_kelamin: GENDER;
  public tempat_lahir: string;
  public tanggal_lahir: Date;
  public no_hp: string;
  public status_nikah: MARRIAGE_STATUS;

  // Informasi tambahan
  public points?: number;

  constructor(
    marketing: { id: number },
    nama_lengkap: string,
    nik: number,
    no_kk: string,
    tempat_lahir: string,
    tanggal_lahir: Date,
    id?: number,
    points?: number,
    created_at: Date = new Date(),
    updated_at: Date = new Date(),
    deleted_at: Date | null = null,
  ) {
    this.marketing = marketing;
    this.nama_lengkap = nama_lengkap;
    this.nik = nik;
    this.no_kk = no_kk;
    this.tempat_lahir = tempat_lahir;
    this.tanggal_lahir = tanggal_lahir;

    this.id = id;
    this.points = points;

    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted_at = deleted_at;
  }

  // ==========================
  //        VALIDATION
  // ==========================
  public validate_for_create_or_update(): void {
    // this.validate_nik();
    this.validate_no_hp();
  }

  // private validate_nik(): void {
  //   if (!this.nik || !/^\d{16}$/.test(this.nik)) {
  //     throw new Error('NIK harus terdiri dari 16 digit angka.');
  //   }
  // }

  private validate_no_hp(): void {
    if (!this.no_hp || !/^08\d{8,12}$/.test(this.no_hp)) {
      throw new Error(
        'Nomor HP tidak valid. Harus diawali 08 dan terdiri dari 10-14 digit.',
      );
    }
  }

  // ==========================
  //        UTILITIES
  // ==========================
  public get_age(as_of: Date = new Date()): number {
    const birth = new Date(this.tanggal_lahir);
    let age = as_of.getFullYear() - birth.getFullYear();
    const month_diff = as_of.getMonth() - birth.getMonth();
    const day_diff = as_of.getDate() - birth.getDate();

    if (month_diff < 0 || (month_diff === 0 && day_diff < 0)) {
      age--;
    }

    return age;
  }

  public is_married(): boolean {
    return this.status_nikah === MARRIAGE_STATUS.MENIKAH;
  }
}
