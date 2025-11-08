export class CollateralByUMKM {
  constructor(
    public readonly pengajuan: { id: number },

    public readonly foto_sku?: string,
    public readonly foto_usaha?: string[], // array foto usaha
    public readonly foto_pembukuan?: string,

    public readonly id?: number,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
    public readonly deleted_at?: Date | null,
  ) {
    this.validateMinimalRequirements();
  }

  //! RULE: Minimal harus ada foto SKU dan minimal 1 foto usaha
  private validateMinimalRequirements(): void {
    if (!this.foto_sku) {
      throw new Error('Foto SKU wajib dilampirkan.');
    }

    if (!this.foto_usaha || this.foto_usaha.length === 0) {
      throw new Error('Minimal satu foto usaha harus dilampirkan.');
    }
  }

  //! Cek apakah semua foto pendukung sudah lengkap
  public isPhotoComplete(): boolean {
    return (
      !!this.foto_sku &&
      !!this.foto_usaha &&
      this.foto_usaha.length > 0 &&
      !!this.foto_pembukuan
    );
  }

  //! Menentukan apakah data UMKM ini layak untuk dilanjutkan prosesnya
  public isValidForCollateral(): boolean {
    return this.isPhotoComplete();
  }
}
