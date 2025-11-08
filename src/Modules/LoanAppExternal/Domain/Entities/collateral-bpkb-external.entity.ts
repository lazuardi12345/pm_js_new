export class CollateralByBPKB {
  constructor(
    public readonly pengajuan: { id: number },

    // Data dasar BPKB/STNK
    public readonly atas_nama_bpkb?: string,
    public readonly no_stnk?: string,
    public readonly alamat_pemilik_bpkb?: string,
    public readonly type_kendaraan?: string,
    public readonly tahun_perakitan?: string,
    public readonly warna_kendaraan?: string,
    public readonly stransmisi?: string,
    public readonly no_rangka?: string,
    public readonly foto_no_rangka?: string,
    public readonly no_mesin?: string,
    public readonly foto_no_mesin?: string,
    public readonly no_bpkb?: string,
    public readonly dokumen_bpkb?: string, // file PDF

    // Foto-foto kendaraan & dokumen
    public readonly foto_stnk_depan?: string,
    public readonly foto_stnk_belakang?: string,
    public readonly foto_kendaraan_depan?: string,
    public readonly foto_kendaraan_belakang?: string,
    public readonly foto_kendaraan_samping_kanan?: string,
    public readonly foto_kendaraan_samping_kiri?: string,
    public readonly foto_sambara?: string,
    public readonly foto_kwitansi_jual_beli?: string,
    public readonly foto_ktp_tangan_pertama?: string,
    public readonly foto_faktur_kendaraan?: string,
    public readonly foto_snikb?: string,

    // Metadata
    public readonly id?: number,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
    public readonly deleted_at?: Date | null,
  ) {
    this.validate_minimal_fields();
  }

  //! Validasi minimal field wajib
  private validate_minimal_fields(): void {
    if (!this.no_bpkb || !this.no_stnk) {
      throw new Error('Nomor BPKB dan nomor STNK wajib diisi.');
    }
  }

  //! Cek apakah semua foto kendaraan lengkap
  public is_vehicle_photo_complete(): boolean {
    return (
      !!this.foto_kendaraan_depan &&
      !!this.foto_kendaraan_belakang &&
      !!this.foto_kendaraan_samping_kanan &&
      !!this.foto_kendaraan_samping_kiri
    );
  }

  //! Cek apakah semua dokumen pendukung lengkap
  public is_document_complete(): boolean {
    return (
      !!this.foto_no_rangka &&
      !!this.foto_no_mesin &&
      !!this.dokumen_bpkb &&
      !!this.foto_stnk_depan &&
      !!this.foto_stnk_belakang
    );
  }

  //! Cek apakah semua data kendaraan (info + foto) lengkap
  public is_fully_complete(): boolean {
    return (
      this.is_vehicle_photo_complete() &&
      this.is_document_complete() &&
      !!this.type_kendaraan &&
      !!this.tahun_perakitan &&
      !!this.warna_kendaraan &&
      !!this.no_rangka &&
      !!this.no_mesin
    );
  }
}
