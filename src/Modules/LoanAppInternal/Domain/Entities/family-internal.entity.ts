// domain/entities/family-internal.entity.ts

import {
  BekerjaEnum,
  HubunganEnum,
} from 'src/Shared/Enums/Internal/Family.enum';

export class FamilyInternal {
  constructor(
    // === Immutable ===
    public readonly nasabah: {id: number}, // ID of ClientInternal
    public readonly hubungan: HubunganEnum,
    public readonly nama: string,
    public readonly bekerja: BekerjaEnum,
    public readonly id?: number,
    public readonly created_at?: Date,
    public readonly deleted_at?: Date | null,

    // === Mutable ===
    public nama_perusahaan?: string,
    public jabatan?: string,
    public penghasilan?: number,
    public alamat_kerja?: string,
    public no_hp?: string,
    public updated_at?: Date,
  ) {}

  // === Business Rules ===
  public isEmployed(): boolean {
    return this.bekerja === BekerjaEnum.YA;
  }

  public hasCompanyInfo(): boolean {
    return !!this.nama_perusahaan && !!this.jabatan;
  }

  public hasIncome(): boolean {
    return this.isEmployed() && (this.penghasilan ?? 0) > 0;
  }

  public isEmergencyContact(): boolean {
    return this.hubungan === HubunganEnum.SUAMI ||
           this.hubungan === HubunganEnum.ISTRI ||
           this.hubungan === HubunganEnum.ORANG_TUA;
  }

  // === Update Methods ===
  public updateJobInfo(
    nama_perusahaan?: string,
    jabatan?: string,
    penghasilan?: number,
    alamat_kerja?: string,
  ): void {
    this.nama_perusahaan = nama_perusahaan;
    this.jabatan = jabatan;
    this.penghasilan = penghasilan;
    this.alamat_kerja = alamat_kerja;
    this.updated_at = new Date();
  }

  public updateContact(noHp: string): void {
    this.no_hp = noHp;
    this.updated_at = new Date();
  }
}
