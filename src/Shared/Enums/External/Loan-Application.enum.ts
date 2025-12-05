export enum JenisPembiayaanEnum {
  BPJS = 'BPJS',
  BPKB = 'BPKB',
  SHM = 'SHM',
  UMKM = 'UMKM',
  KEDINASAN_MOU = 'KEDINASAN_MOU',
  KEDINASAN_NON_MOU = 'KEDINASAN_NON_MOU',
}

export enum StatusPinjamanEnum {
  BARU = 'baru',
  LAMA = 'lama',
}

export enum StatusPengajuanEnum {
  PENDING = 'pending',
  APPROVED_CA = 'approved ca',
  REJECTED_CA = 'rejected ca',
  APPROVED_HM = 'approved hm',
  REJECTED_HM = 'rejected hm',
  REVISI = 'revisi',
  REVISI_SPV = 'revisi spv',
  CHECKED_BY_SPV = 'checked by spv',
  BANDING = 'banding',
  APPROVED_BANDING_CA = 'approved banding ca',
  REJECTED_BANDING_CA = 'rejected banding ca',
  APPROVED_BANDING_HM = 'approved banding hm',
  REJECTED_BANDING_HM = 'rejected banding hm',
  PERLU_SURVEY = 'perlu survey',
  TIDAK_PERLU_SURVEY = 'tidak perlu survey',
  VERIFIKASI = 'verifikasi',
  SURVEY_SELESAI = 'survey selesai',
}

export enum StatusPengajuanAkhirEnum {
  DONE = 'done',
  CLOSED = 'closed',
}

export enum LoanType {
  UMKM = 'UMKM',
  SHM = 'SHM',
  KEDINASAN_MOU = 'KEDINASAN_MOU',
  KEDINASAN_NON_MOU = 'KEDINASAN_NON_MOU',
  BPJS = 'BPJS',
  BPKB = 'BPKB',
}
