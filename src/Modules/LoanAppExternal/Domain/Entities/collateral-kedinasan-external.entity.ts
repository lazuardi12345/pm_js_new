export class CollateralByKedinasan {
  constructor(
    public readonly pengajuanId: number,
    public readonly instansi?: string,
    public readonly suratPermohonanKredit?: string,
    public readonly suratPernyataanPenjamin?: string,
    public readonly suratPersetujuanPimpinan?: string,
    public readonly suratKeteranganGaji?: string,
    public readonly id?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date | null,
  ) {
    this.validateMinimumDocuments();
  }

  //! RULE: Minimal satu dokumen harus ada
  private validateMinimumDocuments(): void {
    const docs = [
      this.suratPermohonanKredit,
      this.suratPernyataanPenjamin,
      this.suratPersetujuanPimpinan,
      this.suratKeteranganGaji,
    ];

    const hasAtLeastOne = docs.some((doc) => !!doc);
    if (!hasAtLeastOne) {
      throw new Error('Minimal satu dokumen kedinasan harus dilampirkan.');
    }
  }

  public hasCompleteDocuments(): boolean {
    return (
      !!this.suratPermohonanKredit &&
      !!this.suratPernyataanPenjamin &&
      !!this.suratPersetujuanPimpinan &&
      !!this.suratKeteranganGaji
    );
  }

  public getMissingDocuments(): string[] {
    const missing: string[] = [];
    if (!this.suratPermohonanKredit) missing.push('Surat Permohonan Kredit');
    if (!this.suratPernyataanPenjamin)
      missing.push('Surat Pernyataan Penjamin');
    if (!this.suratPersetujuanPimpinan)
      missing.push('Surat Persetujuan Pimpinan');
    if (!this.suratKeteranganGaji) missing.push('Surat Keterangan Gaji');
    return missing;
  }
}
