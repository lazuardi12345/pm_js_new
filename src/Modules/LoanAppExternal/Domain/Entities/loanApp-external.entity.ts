import {
  JenisPembiayaanEnum,
  StatusPinjamanEnum,
  StatusPengajuanEnum,
  StatusPengajuanAkhirEnum,
} from 'src/Shared/Enums/External/Loan-Application.enum';

export class LoanApplicationExternal {
  constructor(
    public readonly nasabah: { id: number },
    public readonly jenis_pembiayaan: JenisPembiayaanEnum,
    public readonly nominal_pinjaman: number,
    public readonly tenor: number,
    public readonly berkas_jaminan?: string | null,
    public readonly status_pinjaman: StatusPinjamanEnum = StatusPinjamanEnum.BARU,
    public readonly id?: number,
    public readonly pinjaman_ke?: number,
    public readonly pinjaman_terakhir?: number,
    public readonly sisa_pinjaman?: number,
    public readonly realisasi_pinjaman?: string,
    public readonly cicilan_perbulan?: number,
    public status_pengajuan: StatusPengajuanEnum = StatusPengajuanEnum.PENDING,
    public status_pengajuan_akhir?: StatusPengajuanAkhirEnum | null,
    public readonly validasi_pengajuan?: boolean,
    public readonly catatan_spv?: string,
    public readonly catatan_marketing?: string,
    public readonly is_banding: boolean = false,
    public readonly alasan_banding?: string,
    public survey_schedule?: Date,
    public draft_id?: string,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
    public readonly deleted_at?: Date | null,
  ) {
    this.validate();
  }

  private validate() {
    if (this.nominal_pinjaman <= 0) {
      throw new Error('Nominal pinjaman harus lebih besar dari nol.');
    }
    if (this.tenor <= 0) {
      throw new Error('Tenor harus lebih besar dari nol.');
    }
    // Tambah validasi domain sesuai aturan bisnis
  }
}
