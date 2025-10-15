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
    public readonly id?: number,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
    public readonly deleted_at?: Date | null,
  ) {
    this.validateEssentialFields();
  }

  //! RULE: Setidaknya harus ada NJOP & Foto SHM
  private validateEssentialFields(): void {
    if (!this.njop_shm) {
      throw new Error('NJOP wajib diisi.');
    }
    if (!this.foto_shm) {
      throw new Error('Foto SHM wajib dilampirkan.');
    }
  }

  public isPhotoComplete(): boolean {
    return !!this.foto_shm && !!this.foto_kk_pemilik_shm && !!this.foto_pbb;
  }

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

