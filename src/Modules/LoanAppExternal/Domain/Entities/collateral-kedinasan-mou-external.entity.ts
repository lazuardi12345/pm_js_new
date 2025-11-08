export class CollateralByKedinasanMOU {
  constructor(
    public readonly pengajuan: { id: number },
    public readonly instansi?: string,

    public readonly surat_permohonan_kredit?: string,
    public readonly surat_pernyataan_penjamin?: string,
    public readonly surat_persetujuan_pimpinan?: string,
    public readonly surat_keterangan_gaji?: string,

    public readonly foto_form_pengajuan?: string,
    public readonly foto_surat_kuasa_pemotongan?: string,
    public readonly foto_surat_pernyataan_peminjam?: string,
    public readonly foto_sk_golongan_terbaru?: string,
    public readonly foto_keterangan_tpp?: string,
    public readonly foto_biaya_operasional?: string,
    public readonly foto_surat_kontrak?: string,
    public readonly foto_rekomendasi_bendahara?: string,

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
      !!this.foto_form_pengajuan &&
      !!this.foto_surat_kuasa_pemotongan &&
      !!this.foto_surat_pernyataan_peminjam &&
      !!this.foto_sk_golongan_terbaru &&
      !!this.foto_keterangan_tpp &&
      !!this.foto_biaya_operasional &&
      !!this.foto_surat_kontrak &&
      !!this.foto_rekomendasi_bendahara
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

    if (!this.foto_form_pengajuan) missing.push('Foto Form Pengajuan');
    if (!this.foto_surat_kuasa_pemotongan) missing.push('Foto Surat Kuasa Pemotongan');
    if (!this.foto_surat_pernyataan_peminjam) missing.push('Foto Surat Pernyataan Peminjam');
    if (!this.foto_sk_golongan_terbaru) missing.push('Foto SK Golongan Terbaru');
    if (!this.foto_keterangan_tpp) missing.push('Foto Keterangan TPP');
    if (!this.foto_biaya_operasional) missing.push('Foto Biaya Operasional');
    if (!this.foto_surat_kontrak) missing.push('Foto Surat Kontrak');
    if (!this.foto_rekomendasi_bendahara) missing.push('Foto Rekomendasi Bendahara');

    return missing;
  }
}
