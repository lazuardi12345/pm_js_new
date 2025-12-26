// src/Modules/LoanAppInternal/Domain/Entities/loan-application-internal.entity.ts

import {
  StatusPinjamanEnum,
  StatusPengajuanEnum,
  StatusPengajuanAkhirEnum,
} from 'src/Shared/Enums/Internal/LoanApp.enum';

export class LoanApplicationInternal {
  constructor(
    // === Immutable ===
    public readonly nasabah: { id: number }, // ID of ClientInternal
    public readonly status_pinjaman: StatusPinjamanEnum,
    public readonly nominal_pinjaman: number,
    public readonly tenor: number, // bulan
    public readonly keperluan: string,
    public readonly id?: number,
    public readonly created_at?: Date,
    public readonly deleted_at?: Date | null,

    // === Mutable ===
    public status: StatusPengajuanEnum = StatusPengajuanEnum.PENDING,
    public status_akhir_pengajuan: StatusPengajuanAkhirEnum = StatusPengajuanAkhirEnum.DONE,
    public pinjaman_ke?: number,
    public riwayat_nominal?: number,
    public riwayat_tenor?: number,
    public sisa_pinjaman?: number,
    public notes?: string,
    public is_banding: boolean = false,
    public alasan_banding?: string,
    public draft_id?: string,
    public updated_at?: Date,
  ) {}

  // === Business Rules ===
  public canRequestBanding(): boolean {
    return this.status === StatusPengajuanEnum.REJECTED_CA && !this.is_banding;
  }

  public isOverdue(currentDate: Date): boolean {
    if (!this.created_at) return false;
    const loanEndDate = new Date(this.created_at);
    loanEndDate.setMonth(loanEndDate.getMonth() + this.tenor);
    return currentDate > loanEndDate;
  }

  public hasRemainingDebt(): boolean {
    return (this.sisa_pinjaman ?? 0) > 0;
  }

  public isActive(): boolean {
    return this.status === StatusPengajuanEnum.APPROVED_CA;
  }

  // === Update Methods ===
  public updateStatus(status: StatusPengajuanEnum, notes?: string): void {
    this.status = status;
    if (notes) this.notes = notes;
    this.updated_at = new Date();
  }

  public requestBanding(alasan: string): void {
    if (!this.canRequestBanding()) {
      throw new Error('Pengajuan tidak bisa diajukan banding.');
    }
    this.is_banding = true;
    this.alasan_banding = alasan;
    this.updated_at = new Date();
  }

  public updateRemainingDebt(sisa: number): void {
    this.sisa_pinjaman = sisa;
    this.updated_at = new Date();
  }
}
