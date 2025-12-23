export interface SurveyReportExternal {
  id: number;
  berjumpa_siapa: string;
  hubungan: string;
  status_rumah: string;
  hasil_cekling1: string;
  hasil_cekling2: string;
  kesimpulan: string;
  rekomendasi: string;
  created_at: string;
  updated_at: string;
  pengajuan_id: number;
}

export interface SurveyPhotoExternal {
  id: number;
  foto_survey: string;
  created_at: string;
  updated_at: string;
  hasil_survey_id: number;
}

export interface HistorySurveyExternalData {
  survey_report: SurveyReportExternal | null;
  survey_photos: SurveyPhotoExternal[];
}
