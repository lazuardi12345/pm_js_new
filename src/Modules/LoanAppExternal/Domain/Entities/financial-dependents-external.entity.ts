export class FinancialDependentsExternal {
  constructor(
    public readonly nasabahId: number,
    public readonly kondisiTanggungan?: string,
    public readonly validasiTanggungan?: boolean,
    public readonly catatan?: string,
    public readonly id?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date | null,
  ) {
    this.validateKondisiTanggungan();
  }

  //! RULE: Jika validasi true, maka kondisi tanggungan wajib ada
  private validateKondisiTanggungan(): void {
    if (this.validasiTanggungan && !this.kondisiTanggungan) {
      throw new Error('Kondisi tanggungan wajib diisi jika sudah divalidasi.');
    }
  }

  public isValidated(): boolean {
    return this.validasiTanggungan === true;
  }

  public hasDependents(): boolean {
    return !!this.kondisiTanggungan && this.kondisiTanggungan.trim().length > 0;
  }

  public getSummary(): string {
    return this.kondisiTanggungan?.substring(0, 100) + (this.kondisiTanggungan && this.kondisiTanggungan.length > 100 ? '...' : '');
  }
}
