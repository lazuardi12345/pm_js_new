import { GENDER, MARRIAGE_STATUS } from 'src/Shared/Enums/External/Client-External.enum';

export class ClientExternal {
  constructor(
    public readonly marketing: {id: number},
    public readonly namaLengkap: string,
    public readonly nik: string,
    public readonly noKk: string,
    public readonly jenisKelamin: GENDER,
    public readonly tempatLahir: string,
    public readonly tanggalLahir: Date,
    public readonly noHp: string,
    public readonly statusNikah: MARRIAGE_STATUS,
    public readonly email?: string,
    public readonly fotoKtp?: string,
    public readonly fotoKk?: string,
    public readonly dokumenPendukung?: string,
    public readonly validasiNasabah?: boolean,
    public readonly catatan?: string,
    public readonly id?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date | null,
  ) {
    this.validateNik();
    this.validateNoHp();
  }

  // Business Rules
  private validateNik(): void {
    if (!/^\d{16}$/.test(this.nik)) {
      throw new Error('NIK harus terdiri dari 16 digit angka.');
    }
  }

  private validateNoHp(): void {
    if (!/^08\d{8,12}$/.test(this.noHp)) {
      throw new Error('Nomor HP tidak valid. Harus diawali 08 dan terdiri dari 10-14 digit.');
    }
  }

  public isValidEmail(): boolean {
    return this.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) : false;
  }

  public getAge(asOf: Date = new Date()): number {
    const birth = new Date(this.tanggalLahir);
    let age = asOf.getFullYear() - birth.getFullYear();
    const m = asOf.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && asOf.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  public isMarried(): boolean {
    return this.statusNikah === MARRIAGE_STATUS.MENIKAH;
  }

  public isValidated(): boolean {
    return this.validasiNasabah === true;
  }
}
