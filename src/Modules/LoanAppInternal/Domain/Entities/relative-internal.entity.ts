// src/Modules/LoanAppInternal/Domain/Entities/relative-internal.entity.ts
import { KerabatKerjaEnum } from 'src/Shared/Enums/Internal/Relative.enum';

export class RelativesInternal {
  constructor(
    public nasabah: {id: number}, // ID of ClientInternal
    public kerabat_kerja: KerabatKerjaEnum,
    public id?: number,
    public nama?: string,
    public alamat?: string,
    public no_hp?: string,
    public status_hubungan?: string,
    public nama_perusahaan?: string,
    public created_at?: Date,
    public updated_at?: Date,
    public deleted_at?: Date | null,
  ) {}

  // Business rule: Check if the relative is considered as 'kerabat kerja' (working relative)
  public isKerabatKerja(): boolean {
    return this.kerabat_kerja === KerabatKerjaEnum.YA;
  }

  // Business rule: Check if the relative has a valid contact number
  public hasValidContact(): boolean {
    return !!this.no_hp;
  }
}
