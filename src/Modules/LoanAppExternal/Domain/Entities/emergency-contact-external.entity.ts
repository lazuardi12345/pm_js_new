export class EmergencyContactExternal {
  constructor(
    public readonly nasabah: { id: number },
    public readonly nama_kontak_darurat: string,
    public readonly hubungan_kontak_darurat: string,
    public readonly no_hp_kontak_darurat: string,
    public readonly validasi_kontak_darurat?: boolean,
    public readonly id?: number,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
    public readonly deleted_at?: Date | null,
  ) {
    this.validate_phone_number();
  }

  //! RULE: Nomor HP tidak boleh kosong dan harus valid (minimal 10 digit)
  private validate_phone_number(): void {
    if (!this.no_hp_kontak_darurat) {
      throw new Error('Nomor HP kontak darurat wajib diisi.');
    }

    const is_valid = /^[0-9]{10,}$/.test(this.no_hp_kontak_darurat);
    if (!is_valid) {
      throw new Error(
        'Nomor HP kontak darurat tidak valid. Minimal 10 digit angka.',
      );
    }
  }

  public is_validated(): boolean {
    return this.validasi_kontak_darurat === true;
  }

  public get_display_name(): string {
    return `${this.nama_kontak_darurat} (${this.hubungan_kontak_darurat})`;
  }
}
