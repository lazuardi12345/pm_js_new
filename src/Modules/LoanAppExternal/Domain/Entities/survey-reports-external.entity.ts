export class SurveyReports {
  constructor(
    public readonly pengajuanLuarId: number,
    public readonly berjumpaSiapa: string,
    public readonly hubungan: string,
    public readonly statusRumah: string,
    public readonly hasilCekling1: string,
    public readonly hasilCekling2: string,
    public readonly kesimpulan: string,
    public readonly rekomendasi: string,
    public readonly id?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date,
  ) {
    this.validate();
  }

  private validate() {
    if (!this.pengajuanLuarId) throw new Error('pengajuanLuarId wajib diisi');
    if (!this.berjumpaSiapa) throw new Error('berjumpaSiapa wajib diisi');
    if (!this.hubungan) throw new Error('hubungan wajib diisi');
    if (!this.statusRumah) throw new Error('statusRumah wajib diisi');
    if (!this.hasilCekling1) throw new Error('hasilCekling1 wajib diisi');
    if (!this.hasilCekling2) throw new Error('hasilCekling2 wajib diisi');
    if (!this.kesimpulan) throw new Error('kesimpulan wajib diisi');
    if (!this.rekomendasi) throw new Error('rekomendasi wajib diisi');

    if (this.createdAt && !(this.createdAt instanceof Date))
      throw new Error('createdAt harus berupa Date jika diisi');
    if (this.updatedAt && !(this.updatedAt instanceof Date))
      throw new Error('updatedAt harus berupa Date jika diisi');
    if (this.deletedAt && !(this.deletedAt instanceof Date))
      throw new Error('deletedAt harus berupa Date jika diisi');
  }
}
