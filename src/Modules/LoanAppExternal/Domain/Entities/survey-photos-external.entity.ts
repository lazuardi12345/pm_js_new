export class SurveyPhotos {
  constructor(
    public readonly hasilSurveyId: number,
    public readonly id?: number,
    public readonly fotoSurvey?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date,
  ) {
    this.validate();
  }

  private validate() {
    if (!this.hasilSurveyId) throw new Error('hasilSurveyId wajib diisi');
    // fotoSurvey bersifat opsional, jadi tidak divalidasi ketat
    if (this.createdAt && !(this.createdAt instanceof Date))
      throw new Error('createdAt harus berupa Date jika diisi');
    if (this.updatedAt && !(this.updatedAt instanceof Date))
      throw new Error('updatedAt harus berupa Date jika diisi');
    if (this.deletedAt && !(this.deletedAt instanceof Date))
      throw new Error('deletedAt harus berupa Date jika diisi');
  }
}
