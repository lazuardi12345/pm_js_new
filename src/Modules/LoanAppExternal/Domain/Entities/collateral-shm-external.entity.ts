export class CollateralBySHM {
  constructor(
    public readonly pengajuan: { id: number },

    public readonly atas_nama_shm?: string,
    public readonly hubungan_shm?: string,
    public readonly alamat_shm?: string,
    public readonly luas_shm?: string,
    public readonly njop_shm?: string,

    public readonly foto_shm?: string,
    public readonly foto_kk_pemilik_shm?: string,
    public readonly foto_pbb?: string,
    public readonly foto_objek_jaminan?: string,

    public readonly foto_buku_nikah_suami?: string,
    public readonly foto_buku_nikah_istri?: string,
    public readonly foto_npwp?: string,
    public readonly foto_imb?: string,
    public readonly foto_surat_ahli_waris?: string,
    public readonly foto_surat_akte_kematian?: string,
    public readonly foto_surat_pernyataan_kepemilikan_tanah?: string,
    public readonly foto_surat_pernyataan_tidak_dalam_sengketa?: string,

    public readonly id?: number,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
    public readonly deleted_at?: Date | null,
  ) {
    this.validateEssentialFields();
  }

  //! RULE: Minimal harus punya NJOP & Foto SHM
  private validateEssentialFields(): void {
    if (!this.njop_shm) {
      throw new Error('NJOP wajib diisi.');
    }
    if (!this.foto_shm) {
      throw new Error('Foto SHM wajib dilampirkan.');
    }
  }

  //! Cek apakah semua foto utama sudah ada
  public isPhotoComplete(): boolean {
    return (
      !!this.foto_shm &&
      !!this.foto_kk_pemilik_shm &&
      !!this.foto_pbb &&
      !!this.foto_objek_jaminan
    );
  }

  //! Cek apakah semua data & foto penting sudah lengkap
  public isDataLengkap(): boolean {
    return (
      !!this.atas_nama_shm &&
      !!this.hubungan_shm &&
      !!this.alamat_shm &&
      !!this.luas_shm &&
      !!this.njop_shm &&
      this.isPhotoComplete()
    );
  }
}
