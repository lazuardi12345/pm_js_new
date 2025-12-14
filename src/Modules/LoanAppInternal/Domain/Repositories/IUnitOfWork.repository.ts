import { IClientInternalRepository } from './client-internal.repository';
import { IAddressInternalRepository } from './address-internal.repository';
import { ICollateralInternalRepository } from './collateral-internal.repository';
import { IFamilyInternalRepository } from './family-internal.repository';
import { IJobInternalRepository } from './job-internal.repository';
import { ILoanApplicationInternalRepository } from './loanApp-internal.repository';
import { IRelativesInternalRepository } from './relatives-internal.repository';
import { IApprovalInternalRepository } from './approval-internal.repository';
import { IClientInternalProfileRepository } from './client-internal-profile.repository';
import { IClientExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/client-external.repository';
import { IClientExternalProfileRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/client-external-profile.repository';
import { IAddressExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/address-external.repository';
import { IApprovalExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/approval-external.repository';
import { IJobExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/job-external.repository';
import { ILoanApplicationExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';
import { ILoanGuarantorExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/loan-guarantor-external.repository';
import { IFinancialDependentsExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/financial-dependents-external.repository';
import { IEmergencyContactExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/emergency-contact-external.repository';
import { IOtherExistLoansExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/other-exist-loans-external.repository';
import { IDetailInstallmentItemsExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/detail-installment-items-external.repository';
import { ICollateralByBPJSRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/collateral-bpjs-external.repository';
import { ICollateralByBPKBRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/collateral-bpkb-external.repository';
import { ICollateralBySHMRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/collateral-shm-external.repository';
import { ICollateralByUMKMRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/collateral-umkm.repository';
import { ICollateralByKedinasanMOURepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/collateral-kedinasan-mou-external.repository';
import { ICollateralByKedinasan_Non_MOU_Repository } from 'src/Modules/LoanAppExternal/Domain/Repositories/collateral-kedinasan-non-mou-external.repository';
import { ISurveyPhotosRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/survey-photos-external.repository';
import { ISurveyReportsRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/survey-reports-external.repository';

export interface IUnitOfWork {
  //? Internal Repo
  clientInternalRepo: IClientInternalRepository;
  clientProfileInternalRepo: IClientInternalProfileRepository;
  addressInternalRepo: IAddressInternalRepository;
  approvalInternalRepo: IApprovalInternalRepository;
  collateralInternalRepo: ICollateralInternalRepository;
  familyInternalRepo: IFamilyInternalRepository;
  jobInternalRepo: IJobInternalRepository;
  loanAppInternalRepo: ILoanApplicationInternalRepository;
  relativeInternalRepo: IRelativesInternalRepository;

  //? External Repo
  clientExternalRepo: IClientExternalRepository;
  clientProfileExternalRepo: IClientExternalProfileRepository;
  addressExternalRepo: IAddressExternalRepository;
  approvalExternalRepo: IApprovalExternalRepository;
  jobExternalRepo: IJobExternalRepository;
  loanAppExternalRepo: ILoanApplicationExternalRepository;
  loanGuarantorExternalRepo: ILoanGuarantorExternalRepository;
  financialDependentsExternalRepo: IFinancialDependentsExternalRepository;
  emergencyContactExternalRepo: IEmergencyContactExternalRepository;
  otherExistLoanExternalRepo: IOtherExistLoansExternalRepository;
  detailInstallmentItemsExternalRepo: IDetailInstallmentItemsExternalRepository;
  collateralByBPJSRepo: ICollateralByBPJSRepository;
  collateralByBPKBRepo: ICollateralByBPKBRepository;
  collateralBySHMRepo: ICollateralBySHMRepository;
  collateralByUMKMRepo: ICollateralByUMKMRepository;
  collateralByKedinasanMOURepo: ICollateralByKedinasanMOURepository;
  collateralByKedinasan_NON_MOURepo: ICollateralByKedinasan_Non_MOU_Repository;
  //? External Extended
  surveyPhotosExternalRepo: ISurveyPhotosRepository;
  surveyReportsExternalRepo: ISurveyReportsRepository;

  start<T>(work: () => Promise<T>): Promise<T>;
  // commit(): Promise<void>;
  // rollback(): Promise<void>;
}

export const UNIT_OF_WORK = Symbol('UNIT_OF_WORK');
