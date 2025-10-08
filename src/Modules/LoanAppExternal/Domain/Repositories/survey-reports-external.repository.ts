// Domain/Repositories/approval-external.repository.ts
import { SurveyReports } from "../Entities/survey-reports-external.entity";

export const SURVEY_REPORTS_EXTERNAL_REPOSITORY = ' SURVEY_REPORTS_EXTERNAL_REPOSITORY';

export interface ISurveyReportsRepository {
  findById(id: number): Promise<SurveyReports | null>;
  findByPengajuanLuarId(loanApplicationExternalID: number): Promise<SurveyReports[]>;
  findAll(): Promise<SurveyReports[]>;
  save(address: SurveyReports): Promise<SurveyReports>;
  update(
    id: number,
    address: Partial<SurveyReports>,
  ): Promise<SurveyReports>;
  delete(id: number): Promise<void>;
}
