// domain/entities/address-external.entity.ts
import {
  StatusRumahEnum,
  DomisiliEnum,
  RumahDomisiliEnum,
} from 'src/Shared/Enums/External/Address.enum';

export class AddressExternal {
  constructor(
    // === Immutable / Required ===
    public readonly nasabah: { id: number },
    public readonly alamat_ktp: string,
    public readonly rt_rw: string,
    public readonly kelurahan: string,
    public readonly kecamatan: string,
    public readonly kota: string,
    public readonly provinsi: string,
    public readonly status_rumah: StatusRumahEnum,
    public readonly domisili: DomisiliEnum,
    public readonly rumah_domisili: RumahDomisiliEnum,
    public readonly id?: number,
    public readonly created_at?: Date,
    public readonly deleted_at?: Date | null,

    // === Mutable ===
    public alamat_domisili?: string,
    public biaya_perbulan?: number,
    public biaya_pertahun?: number,
    public biaya_perbulan_domisili?: number,
    public biaya_pertahun_domisili?: number,
    public lama_tinggal?: string,
    public atas_nama_listrik?: string,
    public hubungan?: string,
    public foto_meteran_listrik?: string,
    public share_loc_domisili?: string,
    public share_loc_usaha?: string,
    public share_loc_tempat_kerja?: string,
    public validasi_alamat?: boolean,
    public updated_at?: Date,
  ) {
    this.ensureAlamatLengkap();
    this.nasabah = typeof nasabah === 'number' ? { id: nasabah } : nasabah;
  }

  //! Business Rule: Alamat lengkap wajib kalau domisili ≠ KTP
  private ensureAlamatLengkap(): void {
    if (
      this.domisili === DomisiliEnum.TIDAK_SESUAI_KTP &&
      !this.alamat_domisili
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
      this.alamat_domisili ||
      `${this.alamat_ktp}, RT/RW ${this.rt_rw}, ${this.kelurahan}, ${this.kecamatan}, ${this.kota}, ${this.provinsi}`
    );
  }

  // === Update Hook ===
  public updateAlamatLengkap(alamat: string): void {
    this.alamat_domisili = alamat;
    this.updated_at = new Date();
  }
}
