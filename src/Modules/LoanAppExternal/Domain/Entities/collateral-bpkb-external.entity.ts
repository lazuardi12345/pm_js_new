export class CollateralByBPKB {
  constructor(
    public readonly pengajuan: { id: number },
    public readonly atas_nama_bpkb?: string,
    public readonly no_stnk?: string,
    public readonly alamat_pemilik_bpkb?: string,
    public readonly type_kendaraan?: string,
    public readonly tahun_perakitan?: string,
    public readonly warna_kendaraan?: string,
    public readonly stransmisi?: string,
    public readonly no_rangka?: string,
    public readonly no_mesin?: string,
    public readonly no_bpkb?: string,
    public readonly foto_stnk?: string,
    public readonly foto_bpkb?: string,
    public readonly foto_motor?: string,
    public readonly id?: number,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
    public readonly deleted_at?: Date | null,
  ) {
    this.validate_minimal_fields();
  }

  //! Business Rule: Minimal no BPKB dan no STNK harus ada
  private validate_minimal_fields(): void {
    if (!this.no_bpkb || !this.no_stnk) {
      throw new Error('Nomor BPKB dan nomor STNK wajib diisi.');
    }
  }

  public is_bpkb_photo_complete(): boolean {
    return !!this.foto_bpkb && !!this.foto_stnk && !!this.foto_motor;
  }

  public is_vehicle_info_complete(): boolean {
    return (
      !!this.type_kendaraan &&
      !!this.tahun_perakitan &&
      !!this.warna_kendaraan &&
      !!this.stransmisi &&
      !!this.no_rangka &&
      !!this.no_mesin
    );
  }

  public is_document_fully_complete(): boolean {
    return this.is_vehicle_info_complete() && this.is_bpkb_photo_complete();
  }
}
