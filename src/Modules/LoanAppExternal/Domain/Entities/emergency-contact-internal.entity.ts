export class EmergencyContactExternal {
  constructor(
    public readonly nasabahId: number,
    public readonly namaKontakDarurat: string,
    public readonly hubunganKontakDarurat: string,
    public readonly noHpKontakDarurat: string,
    public readonly validasiKontakDarurat?: boolean,
    public readonly catatan?: string,
    public readonly id?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date | null,
  ) {
    this.validatePhoneNumber();
  }

  //! RULE: Nomor HP tidak boleh kosong dan harus valid (minimal 10 digit)
  private validatePhoneNumber(): void {
    if (!this.noHpKontakDarurat) {
      throw new Error('Nomor HP kontak darurat wajib diisi.');
    }

    const isValid = /^[0-9]{10,}$/.test(this.noHpKontakDarurat);
    if (!isValid) {
      throw new Error('Nomor HP kontak darurat tidak valid. Minimal 10 digit angka.');
    }
  }

  public isValidated(): boolean {
    return this.validasiKontakDarurat === true;
  }

  public getDisplayName(): string {
    return `${this.namaKontakDarurat} (${this.hubunganKontakDarurat})`;
  }
}
