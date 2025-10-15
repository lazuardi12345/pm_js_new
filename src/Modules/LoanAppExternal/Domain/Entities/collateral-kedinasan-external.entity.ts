export class CollateralByKedinasan {
  constructor(
    public readonly pengajuan: { id: number },
    public readonly instansi?: string,
    public readonly surat_permohonan_kredit?: string,
    public readonly surat_pernyataan_penjamin?: string,
    public readonly surat_persetujuan_pimpinan?: string,
    public readonly surat_keterangan_gaji?: string,
    public readonly id?: number,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
    public readonly deleted_at?: Date | null,
  ) {
    this.validateMinimumDocuments();
  }

  //! RULE: Minimal satu dokumen harus ada
  private validateMinimumDocuments(): void {
    const docs = [
      this.surat_permohonan_kredit,
      this.surat_pernyataan_penjamin,
      this.surat_persetujuan_pimpinan,
      this.surat_keterangan_gaji,
    ];

    const hasAtLeastOne = docs.some((doc) => !!doc);
    if (!hasAtLeastOne) {
      throw new Error('Minimal satu dokumen kedinasan harus dilampirkan.');
    }
  }

  public has_complete_documents(): boolean {
    return (
      !!this.surat_permohonan_kredit &&
      !!this.surat_pernyataan_penjamin &&
      !!this.surat_persetujuan_pimpinan &&
      !!this.surat_keterangan_gaji
    );
  }

  public get_missing_documents(): string[] {
    const missing: string[] = [];
    if (!this.surat_permohonan_kredit) missing.push('Surat Permohonan Kredit');
    if (!this.surat_pernyataan_penjamin) missing.push('Surat Pernyataan Penjamin');
    if (!this.surat_persetujuan_pimpinan) missing.push('Surat Persetujuan Pimpinan');
    if (!this.surat_keterangan_gaji) missing.push('Surat Keterangan Gaji');
    return missing;
  }
}
