// domain/entities/address-internal.entity.ts

import {
  StatusRumahEnum,
  DomisiliEnum,
} from 'src/Shared/Enums/Internal/Address.enum';

export class AddressInternal {
  constructor(
    // === Immutable (readonly, gak boleh berubah setelah konstruksi) ===
    public readonly nasabah: { id: number },
    public readonly alamat_ktp: string,
    public readonly rt_rw: string,
    public readonly kelurahan: string,
    public readonly kecamatan: string,
    public readonly kota: string,
    public readonly provinsi: string,
    public readonly status_rumah: StatusRumahEnum,
    public readonly domisili: DomisiliEnum,
    public readonly id?: number,
    public readonly created_at?: Date,
    public readonly deleted_at?: Date | null,

    // === Mutable (bisa diupdate) ===
    public status_rumah_ktp?: StatusRumahEnum,
    public alamat_lengkap?: string,
    public updated_at?: Date,
  ) {
    this.ensureAlamatLengkap();
    this.nasabah = typeof nasabah === 'number' ? { id: nasabah } : nasabah;
  }

  //! Business Rule: Alamat Lengkap wajib kalau domisili ≠ KTP
  private ensureAlamatLengkap(): void {
    if (
      this.domisili === DomisiliEnum.TIDAK_SESUAI_KTP &&
      !this.alamat_lengkap
    ) {
      throw new Error(
        'Alamat lengkap harus diisi karena domisili tidak sesuai KTP.',
      );
    }
  }

  // === Business Logic Helpers ===
  public isKtpAddressMatch(): boolean {
    return this.domisili === DomisiliEnum.SESUAI_KTP;
  }

  public isOwnedProperty(): boolean {
    return this.status_rumah === StatusRumahEnum.PRIBADI;
  }

  public getFullAddress(): string {
    return (
      this.alamat_lengkap ||
      `${this.alamat_ktp}, RT/RW ${this.rt_rw}, ${this.kelurahan}, ${this.kecamatan}, ${this.kota}, ${this.provinsi}`
    );
  }

  // === Update Hook ===
  public updateAlamatLengkap(alamat: string): void {
    this.alamat_lengkap = alamat;
    this.updated_at = new Date();
  }
}
