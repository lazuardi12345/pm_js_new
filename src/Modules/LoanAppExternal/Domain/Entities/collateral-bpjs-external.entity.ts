export class CollateralByBPJS {
  constructor(
    public readonly pengajuanId: number,
    public readonly saldoBpjs?: number,
    public readonly tanggalBayarTerakhir?: Date,
    public readonly username?: string,
    public readonly password?: string,
    public readonly fotoBpjs?: string,
    public readonly fotoJaminanTambahan?: string,
    public readonly id?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date | null,
  ) {
    this.validateMinimalRequirements();
  }

  //! RULE: Minimal saldo dan tanggal bayar terakhir harus ada
  private validateMinimalRequirements(): void {
    if (this.saldoBpjs === undefined || this.saldoBpjs === null) {
      throw new Error('Saldo BPJS harus diisi.');
    }

    if (!this.tanggalBayarTerakhir) {
      throw new Error('Tanggal bayar terakhir BPJS harus diisi.');
    }
  }

  public isAccountCredentialComplete(): boolean {
    return !!this.username && !!this.password;
  }

  public isPhotoComplete(): boolean {
    return !!this.fotoBpjs && !!this.fotoJaminanTambahan;
  }

  public isValidForCollateral(): boolean {
    return this.saldoBpjs! > 0 && this.isPhotoComplete();
  }
}
