export class FinancialDependentsExternal {
  constructor(
    public readonly nasabah: { id: number },
    public readonly kondisi_tanggungan?: string,
    public readonly validasi_tanggungan?: boolean,
    public readonly id?: number,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
    public readonly deleted_at?: Date | null,
  ) {
    this.validate_kondisi_tanggungan();
  }

  //! RULE: Jika validasi true, maka kondisi tanggungan wajib ada
  private validate_kondisi_tanggungan(): void {
    if (this.validasi_tanggungan && !this.kondisi_tanggungan) {
      throw new Error('Kondisi tanggungan wajib diisi jika sudah divalidasi.');
    }
  }

  public is_validated(): boolean {
    return this.validasi_tanggungan === true;
  }

  public has_dependents(): boolean {
    return (
      !!this.kondisi_tanggungan && this.kondisi_tanggungan.trim().length > 0
    );
  }

  public get_summary(): string {
    return (
      this.kondisi_tanggungan?.substring(0, 100) +
      (this.kondisi_tanggungan && this.kondisi_tanggungan.length > 100
        ? '...'
        : '')
    );
  }
}
