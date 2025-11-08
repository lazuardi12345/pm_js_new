export class CollateralByBPJS {
  constructor(
    public readonly pengajuan: { id: number },
    public readonly saldo_bpjs?: number,
    public readonly tanggal_bayar_terakhir?: Date,
    public readonly username?: string,
    public readonly password?: string,
    public readonly foto_bpjs?: string,
    public readonly jaminan_tambahan?: string,
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

  //! Cek apakah kredensial akun BPJS sudah lengkap
  public isAccountCredentialComplete(): boolean {
    return !!this.username && !!this.password;
  }

  //! Cek apakah foto dan dokumen pendukung sudah lengkap
  public isPhotoComplete(): boolean {
    return !!this.foto_bpjs && !!this.jaminan_tambahan;
  }

  //! Validasi umum untuk menentukan kelayakan BPJS sebagai jaminan
  public isValidForCollateral(): boolean {
    return this.saldo_bpjs! > 0 && this.isPhotoComplete();
  }
}
