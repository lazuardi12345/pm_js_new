export class CollateralByBPKB {
  constructor(
    public readonly pengajuanId: number,
    public readonly atasNamaBpkb?: string,
    public readonly noStnk?: string,
    public readonly alamatPemilikBpkb?: string,
    public readonly typeKendaraan?: string,
    public readonly tahunPerakitan?: string,
    public readonly warnaKendaraan?: string,
    public readonly stransmisi?: string,
    public readonly noRangka?: string,
    public readonly noMesin?: string,
    public readonly noBpkb?: string,
    public readonly fotoStnk?: string,
    public readonly fotoBpkb?: string,
    public readonly fotoMotor?: string,
    public readonly id?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date | null,
  ) {
    this.validateMinimalFields();
  }

  //! Business Rule: Minimal no BPKB dan no STNK harus ada
  private validateMinimalFields(): void {
    if (!this.noBpkb || !this.noStnk) {
      throw new Error('Nomor BPKB dan nomor STNK wajib diisi.');
    }
  }

  public isBpkbPhotoComplete(): boolean {
    return !!this.fotoBpkb && !!this.fotoStnk && !!this.fotoMotor;
  }

  public isVehicleInfoComplete(): boolean {
    return (
      !!this.typeKendaraan &&
      !!this.tahunPerakitan &&
      !!this.warnaKendaraan &&
      !!this.stransmisi &&
      !!this.noRangka &&
      !!this.noMesin
    );
  }

  public isDocumentFullyComplete(): boolean {
    return this.isVehicleInfoComplete() && this.isBpkbPhotoComplete();
  }
}
