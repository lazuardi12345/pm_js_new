import { StatusKaryawanEnum } from 'src/Shared/Enums/External/Job.enum';

export class JobExternal {
  constructor(
    public readonly nasabahId: number,
    public readonly perusahaan: string,
    public readonly alamatPerusahaan: string,
    public readonly kontakPerusahaan: string,
    public readonly jabatan: string,
    public readonly lamaKerja: string,
    public readonly statusKaryawan: StatusKaryawanEnum,
    public readonly pendapatanPerbulan: number,
    public readonly slipGaji: string,
    public readonly norek: string,
    public readonly idCard: string,
    public readonly lamaKontrak?: string,
    public readonly validasiPekerjaan?: boolean,
    public readonly catatan?: string,
    public readonly id?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date | null,
  ) {
    this.validatePendapatan();
  }

  private validatePendapatan(): void {
    if (this.pendapatanPerbulan < 0) {
      throw new Error('Pendapatan per bulan tidak boleh negatif');
    }
  }

  public isValidated(): boolean {
    return this.validasiPekerjaan === true;
  }

  public isContractWorker(): boolean {
    return this.statusKaryawan === StatusKaryawanEnum.KONTRAK;
  }

  public getSummary(): string {
    return `${this.jabatan} di ${this.perusahaan}, lama kerja: ${this.lamaKerja}`;
  }
}
