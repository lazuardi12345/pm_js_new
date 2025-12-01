import { StatusKaryawanEnum } from 'src/Shared/Enums/External/Job.enum';

export class JobExternal {
  constructor(
    public readonly nasabah: { id: number },

    public readonly perusahaan: string,
    public readonly alamat_perusahaan: string,
    public readonly kontak_perusahaan: string,
    public readonly jabatan: string,
    public readonly lama_kerja: string,
    public readonly status_karyawan: StatusKaryawanEnum,
    public readonly pendapatan_perbulan: number,
    public readonly slip_gaji_peminjam?: string,
    public readonly slip_gaji_penjamin?: string,
    public readonly norek?: string,
    public readonly id_card_peminjam?: string,
    public readonly id_card_penjamin?: string,
    public readonly rekening_koran?: string,
    public readonly lama_kontrak?: string,
    public readonly validasi_pekerjaan?: boolean,
    public readonly catatan?: string,
    public readonly id?: number,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
    public readonly deleted_at?: Date | null,
  ) {
    this.validatePendapatan();
  }

  private validatePendapatan(): void {
    if (this.pendapatan_perbulan < 0) {
      throw new Error('Pendapatan per bulan tidak boleh negatif');
    }
  }

  public isValidated(): boolean {
    return this.validasi_pekerjaan === true;
  }

  public isContractWorker(): boolean {
    return this.status_karyawan === StatusKaryawanEnum.KONTRAK;
  }

  public getSummary(): string {
    return `${this.jabatan} di ${this.perusahaan}, lama kerja: ${this.lama_kerja}`;
  }
}
