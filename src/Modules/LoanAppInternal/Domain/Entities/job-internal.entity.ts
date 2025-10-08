// src/Modules/LoanAppInternal/Domain/Entities/job-internal.entity.ts

import {
  PerusahaanEnum,
  GolonganEnum,
} from 'src/Shared/Enums/Internal/Job.enum';

export class JobInternal {
  constructor(
    // === Immutable ===
    public readonly nasabah: {id: number}, // ID of ClientInternal
    public readonly perusahaan: PerusahaanEnum,
    public readonly divisi: string,
    public readonly golongan: GolonganEnum,
    public readonly nama_atasan: string,
    public readonly nama_hrd: string,
    public readonly absensi: string,
    public readonly id?: number,
    public readonly created_at?: Date,
    public readonly deleted_at?: Date | null,

    // === Mutable ===
    public yayasan?: string,
    public lama_kerja_bulan?: number,
    public lama_kerja_tahun?: number,
    public bukti_absensi?: string,
    public updated_at?: Date,
  ) {}

  // === Business Rules ===
  public totalYearsOfExperience(): number {
    return (this.lama_kerja_tahun ?? 0) + (this.lama_kerja_bulan ?? 0) / 12;
  }

  public requiresYayasan(): boolean {
    return !!this.yayasan;
  }

  public isAbsensiValid(): boolean {
    return this.absensi.trim() !== '';
  }

  public hasProofOfAbsensi(): boolean {
    return !!this.bukti_absensi;
  }

  // === Update Methods ===
  public updateWorkDuration(tahun: number, bulan: number): void {
    this.lama_kerja_tahun = tahun;
    this.lama_kerja_bulan = bulan;
    this.updated_at = new Date();
  }

  public updateYayasan(yayasan: string): void {
    this.yayasan = yayasan;
    this.updated_at = new Date();
  }

  public updateAbsensi(buktiAbsensi: string): void {
    this.bukti_absensi = buktiAbsensi;
    this.updated_at = new Date();
  }
}
