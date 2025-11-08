import { GENDER, MARRIAGE_STATUS } from 'src/Shared/Enums/External/Client-External.enum';

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
  public nik: string;
  public no_kk: string;
  public no_rek: string;
  public foto_rekening: string;
  public jenis_kelamin: GENDER;
  public tempat_lahir: string;
  public tanggal_lahir: Date;
  public no_hp: string;
  public status_nikah: MARRIAGE_STATUS;

  // Informasi tambahan
  public email?: string;
  public foto_ktp_peminjam?: string;
  public foto_ktp_penjamin?: string;
  public foto_kk_peminjam?: string;
  public foto_kk_penjamin?: string;
  public dokumen_pendukung?: string;
  public validasi_nasabah?: boolean;
  public catatan?: string;

  constructor(
    marketing: { id: number },
    nama_lengkap: string,
    nik: string,
    no_kk: string,
    no_rek: string,
    foto_rekening: string,
    jenis_kelamin: GENDER,
    tempat_lahir: string,
    tanggal_lahir: Date,
    no_hp: string,
    status_nikah: MARRIAGE_STATUS,
    id?: number,
    email?: string,
    foto_ktp_peminjam?: string,
    foto_ktp_penjamin?: string,
    foto_kk_peminjam?: string,
    foto_kk_penjamin?: string,
    dokumen_pendukung?: string,
    validasi_nasabah?: boolean,
    catatan?: string,
    created_at: Date = new Date(),
    updated_at: Date = new Date(),
    deleted_at: Date | null = null,
  ) {
    this.marketing = marketing;
    this.nama_lengkap = nama_lengkap;
    this.nik = nik;
    this.no_kk = no_kk;
    this.no_rek = no_rek;
    this.foto_rekening = foto_rekening;
    this.jenis_kelamin = jenis_kelamin;
    this.tempat_lahir = tempat_lahir;
    this.tanggal_lahir = tanggal_lahir;
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

    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted_at = deleted_at;
  }

  // ==========================
  //        VALIDATION
  // ==========================
  public validate_for_create_or_update(): void {
    this.validate_nik();
    this.validate_no_hp();
  }

  private validate_nik(): void {
    if (!this.nik || !/^\d{16}$/.test(this.nik)) {
      throw new Error('NIK harus terdiri dari 16 digit angka.');
    }
  }

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
  public is_valid_email(): boolean {
    return !!this.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

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

  public is_validated(): boolean {
    return this.validasi_nasabah === true;
  }
}
