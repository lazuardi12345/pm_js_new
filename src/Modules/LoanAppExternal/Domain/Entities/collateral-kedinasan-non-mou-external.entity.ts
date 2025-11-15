export class CollateralByKedinasanNonMOU {
  constructor(
    public readonly pengajuan: { id: number },
    public readonly instansi?: string,

    public readonly surat_permohonan_kredit?: string,
    public readonly surat_pernyataan_penjamin?: string,
    public readonly surat_persetujuan_pimpinan?: string,
    public readonly surat_keterangan_gaji?: string,

    public readonly foto_sk?: string,
    public readonly foto_keterangan_tpp?: string,
    public readonly foto_biaya_operasional?: string,

    public readonly id?: number,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
    public readonly deleted_at?: Date | null,
  ) {
    this.validateMinimumDocuments();
  }

  //! RULE: Minimal satu dokumen utama harus ada
  private validateMinimumDocuments(): void {
    const docsUtama = [
      this.surat_permohonan_kredit,
      this.surat_pernyataan_penjamin,
      this.surat_persetujuan_pimpinan,
      this.surat_keterangan_gaji,
    ];

    const hasAtLeastOne = docsUtama.some((doc) => !!doc);
    if (!hasAtLeastOne) {
      throw new Error('Minimal satu dokumen kedinasan utama harus dilampirkan.');
    }
  }

  //! Cek apakah dokumen utama sudah lengkap semua
  public hasCompleteMainDocuments(): boolean {
    return (
      !!this.surat_permohonan_kredit &&
      !!this.surat_pernyataan_penjamin &&
      !!this.surat_persetujuan_pimpinan &&
      !!this.surat_keterangan_gaji
    );
  }

  //! Cek apakah foto-foto pelengkap sudah lengkap semua
  public hasCompletePhotos(): boolean {
    return (
      !!this.foto_sk &&
      !!this.foto_keterangan_tpp &&
      !!this.foto_biaya_operasional
    );
  }

  //! Cek apakah semua dokumen + foto pendukung lengkap
  public isCompleteForCollateral(): boolean {
    return this.hasCompleteMainDocuments() && this.hasCompletePhotos();
  }

  //! Menampilkan daftar dokumen yang belum dilampirkan
  public getMissingDocuments(): string[] {
    const missing: string[] = [];

    if (!this.surat_permohonan_kredit) missing.push('Surat Permohonan Kredit');
    if (!this.surat_pernyataan_penjamin) missing.push('Surat Pernyataan Penjamin');
    if (!this.surat_persetujuan_pimpinan) missing.push('Surat Persetujuan Pimpinan');
    if (!this.surat_keterangan_gaji) missing.push('Surat Keterangan Gaji');
    if (!this.foto_sk) missing.push('Foto SK');
    if (!this.foto_keterangan_tpp) missing.push('Foto Keterangan TPP');
    if (!this.foto_biaya_operasional) missing.push('Foto Biaya Operasional');

    return missing;
  }
}
