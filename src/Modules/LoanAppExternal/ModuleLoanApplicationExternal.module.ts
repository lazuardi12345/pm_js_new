import { Module } from '@nestjs/common';
import { AddressExternalModule } from './Modules/address-external.module';
import { ApprovalExternalModule } from './Modules/approval-external.module';
import { ClientExternalModule } from './Modules/client-external.module';
import { ClientExternalProfileModule } from './Modules/client-external-profile.module';
import { CollateralByBPJS_External_Module } from './Modules/collateral-bpjs-external.module';
import { CollateralByBPKB_External_Module } from './Modules/collateral-bpkb-external.module';
import { CollateralBySHM_External_Module } from './Modules/collateral-shm-external.module';
import { CollateralByUMKM_External_Module } from './Modules/collateral-umkm.module';
import { CollateralByKedinasan_MOU_External_Module } from './Modules/collateral-kedinasan-mou-external.module';
import { CollateralByKedinasan_Non_MOU_External_Module } from './Modules/collateral-kedinasan-non-mou-external.module';
import { EmergencyContactExternalModule } from './Modules/emergency-contact-external.module';
import { FinancialDependentsExternalModule } from './Modules/financial-dependents-external.module';
import { JobsExternalModule } from './Modules/job-external.module';
import { LoanGuarantorExternalModule } from './Modules/loan-guarantor-external.module';
import { LoanApplicationExternalModule } from './Modules/loanApp-external.module';
import { OtherExistLoansExternalModule } from './Modules/other-exist-loans-external.module';
import { SurveyPhotos_External_Module } from './Modules/survey-photos-external.module';
import { SurveyReports_External_Module } from './Modules/survey-reports-external.module';

//Controller
import { AddressExternalController } from './Presentation/Controllers/address-external.controller';
import { ClientExternalController } from './Presentation/Controllers/client-external.controller';
import { ClientExternalProfileController } from './Presentation/Controllers/client-external-profile.controller';
import { JobExternalController } from './Presentation/Controllers/job-external.controller';
import { ApprovalExternalController } from './Presentation/Controllers/approval-external.controller';
import { LoanApplicationExternalController } from './Presentation/Controllers/loanApp-external.controller';
import { ColleteralBpjsExternalController } from './Presentation/Controllers/collateral-bpjs-external.controller';
import { CollateralBpkbExternalController } from './Presentation/Controllers/collateral-bpkb-external.controller';
import { CollateralKedinasanExternalController } from './Presentation/Controllers/collateral-kedinasan-mou-external.controller';
import { CollateralShmExternalController } from './Presentation/Controllers/collateral-shm-external.controller';
import { EmergencyContactExternalController } from './Presentation/Controllers/emergency-contact-external.controller';
import { FinancialDependentsExternalController } from './Presentation/Controllers/financial-dependents-external.controller';
import { LoanGuarantorExternalController } from './Presentation/Controllers/loan-guarantor-external.controller';
import { OtherExistLoansExternalController } from './Presentation/Controllers/other-exist-loan-external.controller';
import { CollateralByUmkmExternalController } from './Presentation/Controllers/colleteral-umkm.controller';
import { CollateralKedinasan_Non_MOU_ExternalController } from './Presentation/Controllers/collateral-kedinasan-non-mou-external.controller';
import { DetailInstallmentItemsExternalModule } from './Modules/detail-installment-items-external.module';
import { DetailInstallmentItemsExternalController } from './Presentation/Controllers/detail-installment-items-external.controller';

@Module({
  imports: [
    AddressExternalModule,
    ApprovalExternalModule,
    ClientExternalModule,
    ClientExternalProfileModule,
    CollateralByBPJS_External_Module,
    CollateralByBPKB_External_Module,
    CollateralBySHM_External_Module,
    CollateralByKedinasan_MOU_External_Module,
    CollateralByKedinasan_Non_MOU_External_Module,
    CollateralByUMKM_External_Module,
    EmergencyContactExternalModule,
    FinancialDependentsExternalModule,
    JobsExternalModule,
    LoanGuarantorExternalModule,
    LoanApplicationExternalModule,
    OtherExistLoansExternalModule,
    DetailInstallmentItemsExternalModule,
    SurveyPhotos_External_Module,
    SurveyReports_External_Module,
  ],
  controllers: [
    AddressExternalController,
    ClientExternalController,
    ClientExternalProfileController,
    JobExternalController,
    ApprovalExternalController,
    LoanApplicationExternalController,
    ColleteralBpjsExternalController,
    CollateralBpkbExternalController,
    CollateralKedinasanExternalController,
    CollateralKedinasan_Non_MOU_ExternalController,
    CollateralShmExternalController,
    CollateralByUmkmExternalController,
    EmergencyContactExternalController,
    FinancialDependentsExternalController,
    LoanGuarantorExternalController,
    OtherExistLoansExternalController,
    DetailInstallmentItemsExternalController,
  ],
  exports: [
    AddressExternalModule,
    ApprovalExternalModule,
    ClientExternalModule,
    ClientExternalProfileModule,
    CollateralByBPJS_External_Module,
    CollateralByBPKB_External_Module,
    CollateralBySHM_External_Module,
    CollateralByUMKM_External_Module,
    CollateralByKedinasan_MOU_External_Module,
    CollateralByKedinasan_Non_MOU_External_Module,
    EmergencyContactExternalModule,
    FinancialDependentsExternalModule,
    JobsExternalModule,
    LoanGuarantorExternalModule,
    LoanApplicationExternalModule,
    OtherExistLoansExternalModule,
    DetailInstallmentItemsExternalModule,
    SurveyPhotos_External_Module,
    SurveyReports_External_Module,
  ],
})
export class ModuleLoanApplicationExternal {}
