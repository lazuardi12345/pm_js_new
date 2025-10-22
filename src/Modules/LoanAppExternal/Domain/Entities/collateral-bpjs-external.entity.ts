export class CollateralByBPJS {
  constructor(
    public readonly pengajuan: { id: number },
    public readonly saldo_bpjs?: number,
    public readonly tanggal_bayar_terakhir?: Date,
    public readonly username?: string,
    public readonly password?: string,
    public readonly foto_bpjs?: string,
    public readonly foto_ktp_suami_istri?: string,
    public readonly foto_ktp_penjamin?: string,
    public readonly foto_kk_pemohon_penjamin?: string,
    public readonly foto_id_card_suami_istri?: string,
    public readonly slip_gaji?: string,
    public readonly rekening_koran?: string,
    public readonly foto_jaminan_tambahan?: string,
    public readonly id?: number,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
    public readonly deleted_at?: Date | null,
  ) {
    this.validateMinimalRequirements();
  }

  //! RULE: Minimal saldo dan tanggal bayar terakhir harus ada
  private validateMinimalRequirements(): void {
    if (this.saldo_bpjs === undefined || this.saldo_bpjs === null) {
      throw new Error('Saldo BPJS harus diisi.');
    }

    if (!this.tanggal_bayar_terakhir) {
      throw new Error('Tanggal bayar terakhir BPJS harus diisi.');
    }
  }

  public isAccountCredentialComplete(): boolean {
    return !!this.username && !!this.password;
  }

  public isPhotoComplete(): boolean {
    return !!this.foto_bpjs && !!this.foto_jaminan_tambahan;
  }

  public isValidForCollateral(): boolean {
    return this.saldo_bpjs! > 0 && this.isPhotoComplete();
  }
}
