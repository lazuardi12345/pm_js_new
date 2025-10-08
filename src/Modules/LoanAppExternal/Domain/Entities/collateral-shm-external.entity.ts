export class CollateralBySHM {
  constructor(
    public readonly pengajuanId: number,
    public readonly atasNamaShm?: string,
    public readonly hubunganShm?: string,
    public readonly alamatShm?: string,
    public readonly luasShm?: string,
    public readonly njopShm?: string,
    public readonly fotoShm?: string,
    public readonly fotoKkPemilikShm?: string,
    public readonly fotoPbb?: string,
    public readonly id?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date | null,
  ) {
    this.validateEssentialFields();
  }

  //! RULE: Setidaknya harus ada NJOP & Foto SHM
  private validateEssentialFields(): void {
    if (!this.njopShm) {
      throw new Error('NJOP wajib diisi.');
    }
    if (!this.fotoShm) {
      throw new Error('Foto SHM wajib dilampirkan.');
    }
  }

  public isPhotoComplete(): boolean {
    return !!this.fotoShm && !!this.fotoKkPemilikShm && !!this.fotoPbb;
  }

  public isDataLengkap(): boolean {
    return (
      !!this.atasNamaShm &&
      !!this.hubunganShm &&
      !!this.alamatShm &&
      !!this.luasShm &&
      !!this.njopShm &&
      this.isPhotoComplete()
    );
  }
}
