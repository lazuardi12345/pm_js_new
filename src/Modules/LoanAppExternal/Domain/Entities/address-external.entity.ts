import {
  StatusRumahEnum,
  DomisiliEnum,
  RumahDomisiliEnum,
} from 'src/Shared/Enums/External/Address.enum';

export class AddressExternal {
  constructor(
    public readonly nasabahId: number,
    public readonly alamatKtp: string,
    public readonly rtRw: string,
    public readonly kelurahan: string,
    public readonly kecamatan: string,
    public readonly kota: string,
    public readonly provinsi: string,
    public readonly statusRumah: StatusRumahEnum,
    public readonly domisili: DomisiliEnum,
    public readonly rumahDomisili: RumahDomisiliEnum,
    public readonly id?: number,
    public readonly alamatDomisili?: string,
    public readonly biayaPerBulan?: number,
    public readonly biayaPerTahun?: number,
    public readonly biayaPerBulanDomisili?: number,
    public readonly biayaPerTahunDomisili?: number,
    public readonly lamaTinggal?: string,
    public readonly atasNamaListrik?: string,
    public readonly hubungan?: string,
    public readonly fotoMeteranListrik?: string,
    public readonly shareLocLink?: string,
    public readonly validasiAlamat?: boolean,
    public readonly catatan?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date | null,
  ) {
    this.ensureAlamatDomisiliIfNeeded();
  }

  //! Business Rule: Alamat Domisili harus diisi kalau domisili != SESUAI_KTP
  private ensureAlamatDomisiliIfNeeded(): void {
    if (
      this.domisili === DomisiliEnum.TIDAK_SESUAI_KTP &&
      !this.alamatDomisili
    ) {
      throw new Error(
        'Alamat domisili wajib diisi karena domisili tidak sesuai KTP.',
      );
    }
  }

  // Business Logic Helpers
  public isDomisiliSesuaiKtp(): boolean {
    return this.domisili === DomisiliEnum.SESUAI_KTP;
  }

  public isRumahMilikSendiri(): boolean {
    return this.statusRumah === StatusRumahEnum.PRIBADI;
  }

  public getFullKtpAddress(): string {
    return `${this.alamatKtp}, RT/RW ${this.rtRw}, ${this.kelurahan}, ${this.kecamatan}, ${this.kota}, ${this.provinsi}`;
  }

  public getFullDomisiliAddress(): string | null {
    if (this.isDomisiliSesuaiKtp()) {
      return this.getFullKtpAddress();
    }

    return this.alamatDomisili || null;
  }
}
