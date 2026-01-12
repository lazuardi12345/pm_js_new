import { DataSource, QueryRunner } from 'typeorm';
import { IUnitOfWork } from '../../Domain/Repositories/IUnitOfWork.repository';

// repo interfaces
import { IClientInternalRepository } from '../../Domain/Repositories/client-internal.repository';
import { IAddressInternalRepository } from '../../Domain/Repositories/address-internal.repository';
import { ICollateralInternalRepository } from '../../Domain/Repositories/collateral-internal.repository';
import { IFamilyInternalRepository } from '../../Domain/Repositories/family-internal.repository';
import { IJobInternalRepository } from '../../Domain/Repositories/job-internal.repository';
import { ILoanApplicationInternalRepository } from '../../Domain/Repositories/loanApp-internal.repository';
import { IRelativesInternalRepository } from '../../Domain/Repositories/relatives-internal.repository';

// repo implementations
import { ClientInternalRepositoryImpl } from './client-internal.repository.impl';
import { AddressInternalRepositoryImpl } from './address-internal.repository.impl';
import { CollateralInternalRepositoryImpl } from './collateral-internal.repository.impl';
import { FamilyInternalRepositoryImpl } from './family-internal.repository.impl';
import { JobInternalRepositoryImpl } from './job-internal.repository.impl';
import { LoanApplicationInternalRepositoryImpl } from './loanApp-internal.repository.impl';
import { RelativeInternalRepositoryImpl } from './relative-internal.repository.impl';

// ORM entities
import { ClientInternal_ORM_Entity } from '../Entities/client-internal.orm-entity';
import { AddressInternal_ORM_Entity } from '../Entities/address-internal.orm-entity';
import { CollateralInternal_ORM_Entity } from '../Entities/collateral-internal.orm-entity';
import { FamilyInternal_ORM_Entity } from '../Entities/family-internal.orm-entity';
import { JobInternal_ORM_Entity } from '../Entities/job-internal.orm-entity';
import { LoanApplicationInternal_ORM_Entity } from '../Entities/loan-application-internal.orm-entity';
import { RelativeInternal_ORM_Entity } from '../Entities/relative-internal.orm-entity';
import { IApprovalInternalRepository } from '../../Domain/Repositories/approval-internal.repository';
import { ApprovalInternalRepositoryImpl } from './approval-internal.repository.impl';
import { ApprovalInternal_ORM_Entity } from '../Entities/approval-internal.orm-entity';
import { IClientInternalProfileRepository } from '../../Domain/Repositories/client-internal-profile.repository';
import { ClientInternalProfileRepositoryImpl } from './client-internal-profile.repository.impl';
import { ClientInternalProfile_ORM_Entity } from '../Entities/client-internal-profile.orm-entity';
import { ClientExternalRepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/client-external.repository.impl';
import { IClientExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/client-external.repository';
import { ClientExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/client-external.orm-entity';
import { IClientExternalProfileRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/client-external-profile.repository';
import { ClientExternalProfileRepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/client-external-profile.repository.impl';
import { ClientExternalProfile_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/client-external-profile.orm-entity';
import { IAddressExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/address-external.repository';
import { AddressExternalRepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/address-external.repository.impl';
import { AddressExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/address-external.orm-entity';
import { IApprovalExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/approval-external.repository';
import { ApprovalExternalRepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/approval-external.repository.impl';
import { LoanApplicationExternalRepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/loanApp-external.repository.impl';
import { LoanApplicationExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/loan-application-external.orm-entity';
import { ApprovalExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/approval-external.orm-entity';
import { IJobExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/job-external.repository';
import { JobExternalRepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/job-external.repository.impl';
import { JobExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/job.orm-entity';
import { ILoanApplicationExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';
import { ILoanGuarantorExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/loan-guarantor-external.repository';
import { LoanGuarantorExternalRepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/loan-guarantor-external.repository.impl';
import { LoanGuarantorExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/loan-guarantor.orm-entity';
import { IFinancialDependentsExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/financial-dependents-external.repository';
import { FinancialDependentsExternalRepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/financial-dependents-external.repository.impl';
import { FinancialDependentsExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/financial-dependents.orm-entity';
import { IEmergencyContactExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/emergency-contact-external.repository';
import { EmergencyContactExternalRepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/emergency-contact-external.repository.impl';
import { EmergencyContactExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/emergency-contact.orm-entity';
import { IOtherExistLoansExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/other-exist-loans-external.repository';
import { OtherExistLoansExternalRepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/other-exist-loans-external.repository.impl';
import { OtherExistLoansExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/other-exist-loans.orm-entity';
import { IDetailInstallmentItemsExternalRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/detail-installment-items-external.repository';
import { DetailInstallmentItemsExternalRepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/detail-installment-items-external.repository.impl';
import { DetailInstallmentItemsExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/detail-installment-items.orm-entity';
import { ICollateralByBPJSRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/collateral-bpjs-external.repository';
import { CollateralByBPJSRepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/collateral-bpjs-external.repository.impl';
import { CollateralByBPJS_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/collateral-bpjs.orm-entity';
import { ICollateralByBPKBRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/collateral-bpkb-external.repository';
import { CollateralByBPKBRepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/collateral-bpkb-external.repository.impl';
import { CollateralByBPKB_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/collateral-bpkb.orm-entity';
import { ICollateralBySHMRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/collateral-shm-external.repository';
import { CollateralBySHMRepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/collateral-shm-external.repository.impl';
import { CollateralBySHM_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/collateral-shm.orm-entity';
import { ICollateralByUMKMRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/collateral-umkm.repository';
import { CollateralByUMKM_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/collateral-umkm.orm.entity';
import { CollateralByKedinasanMouRepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/collateral-kedinasan-mou-external.repository.impl';
import { CollateralByUMKMRepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/collateral-umkm.repository.impl';
import { ICollateralByKedinasanMOURepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/collateral-kedinasan-mou-external.repository';
import { CollateralByKedinasan_Non_MOU_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/collateral-kedinasan-non-mou.orm-entity';
import { ICollateralByKedinasan_Non_MOU_Repository } from 'src/Modules/LoanAppExternal/Domain/Repositories/collateral-kedinasan-non-mou-external.repository';
import { CollateralByKedinasan_Non_MOU_RepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/collateral-kedinasan-non-mou-external.repository.impl';
import { ISurveyPhotosRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/survey-photos-external.repository';
import { SurveyPhotosRepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/survey-photos-external.repository.impl';
import { SurveyPhotos_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/survey-photos.orm-entity';
import { ISurveyReportsRepository } from 'src/Modules/LoanAppExternal/Domain/Repositories/survey-reports-external.repository';
import { SurveyReportsRepositoryImpl } from 'src/Modules/LoanAppExternal/Infrastructure/Repositories/survey-reports-external.repository.impl';
import { SurveyReports_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/survey-reports.orm-entity';
import { CollateralByKedinasan_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/collateral-kedinasan-mou.orm-entity';

export class TypeOrmUnitOfWork implements IUnitOfWork {
  private queryRunner: QueryRunner | null = null;

  constructor(private readonly dataSource: DataSource) {
    console.log('=== TypeOrmUnitOfWork Constructor ===');
    console.log('DataSource received:', !!this.dataSource);
    console.log('DataSource type:', typeof this.dataSource);
    console.log('DataSource isInitialized:', this.dataSource?.isInitialized);
    console.log('=====================================');
  }

  // Repos --- selalu ambil dari queryRunner yang aktif
  get clientInternalRepo(): IClientInternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new ClientInternalRepositoryImpl(
      this.queryRunner.manager.getRepository(ClientInternal_ORM_Entity),
    );
  }

  get clientProfileInternalRepo(): IClientInternalProfileRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new ClientInternalProfileRepositoryImpl(
      this.queryRunner.manager.getRepository(ClientInternalProfile_ORM_Entity),
    );
  }

  get addressInternalRepo(): IAddressInternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new AddressInternalRepositoryImpl(
      this.queryRunner.manager.getRepository(AddressInternal_ORM_Entity),
    );
  }

  get approvalInternalRepo(): IApprovalInternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new ApprovalInternalRepositoryImpl(
      this.queryRunner.manager.getRepository(ApprovalInternal_ORM_Entity),
      new LoanApplicationInternalRepositoryImpl(
        this.queryRunner.manager.getRepository(
          LoanApplicationInternal_ORM_Entity,
        ),
      ),
    );
  }

  get collateralInternalRepo(): ICollateralInternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new CollateralInternalRepositoryImpl(
      this.queryRunner.manager.getRepository(CollateralInternal_ORM_Entity),
    );
  }

  get familyInternalRepo(): IFamilyInternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new FamilyInternalRepositoryImpl(
      this.queryRunner.manager.getRepository(FamilyInternal_ORM_Entity),
    );
  }

  get jobInternalRepo(): IJobInternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new JobInternalRepositoryImpl(
      this.queryRunner.manager.getRepository(JobInternal_ORM_Entity),
    );
  }

  get loanAppInternalRepo(): ILoanApplicationInternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new LoanApplicationInternalRepositoryImpl(
      this.queryRunner.manager.getRepository(
        LoanApplicationInternal_ORM_Entity,
      ),
    );
  }

  get relativeInternalRepo(): IRelativesInternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new RelativeInternalRepositoryImpl(
      this.queryRunner.manager.getRepository(RelativeInternal_ORM_Entity),
    );
  }

  // =====================
  // External Repositories
  // =====================

  get clientExternalRepo(): IClientExternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new ClientExternalRepositoryImpl(
      this.queryRunner.manager.getRepository(ClientExternal_ORM_Entity),
    );
  }

  get clientProfileExternalRepo(): IClientExternalProfileRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new ClientExternalProfileRepositoryImpl(
      this.queryRunner.manager.getRepository(ClientExternalProfile_ORM_Entity),
    );
  }

  get addressExternalRepo(): IAddressExternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new AddressExternalRepositoryImpl(
      this.queryRunner.manager.getRepository(AddressExternal_ORM_Entity),
    );
  }

  get approvalExternalRepo(): IApprovalExternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new ApprovalExternalRepositoryImpl(
      this.queryRunner.manager.getRepository(ApprovalExternal_ORM_Entity),
    );
  }

  get jobExternalRepo(): IJobExternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new JobExternalRepositoryImpl(
      this.queryRunner.manager.getRepository(JobExternal_ORM_Entity),
    );
  }

  get loanAppExternalRepo(): ILoanApplicationExternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new LoanApplicationExternalRepositoryImpl(
      this.queryRunner.manager.getRepository(
        LoanApplicationExternal_ORM_Entity,
      ),
    );
  }

  get loanGuarantorExternalRepo(): ILoanGuarantorExternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new LoanGuarantorExternalRepositoryImpl(
      this.queryRunner.manager.getRepository(LoanGuarantorExternal_ORM_Entity),
    );
  }

  get financialDependentsExternalRepo(): IFinancialDependentsExternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new FinancialDependentsExternalRepositoryImpl(
      this.queryRunner.manager.getRepository(
        FinancialDependentsExternal_ORM_Entity,
      ),
    );
  }

  get emergencyContactExternalRepo(): IEmergencyContactExternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new EmergencyContactExternalRepositoryImpl(
      this.queryRunner.manager.getRepository(
        EmergencyContactExternal_ORM_Entity,
      ),
    );
  }

  get otherExistLoanExternalRepo(): IOtherExistLoansExternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new OtherExistLoansExternalRepositoryImpl(
      this.queryRunner.manager.getRepository(
        OtherExistLoansExternal_ORM_Entity,
      ),
    );
  }

  get detailInstallmentItemsExternalRepo(): IDetailInstallmentItemsExternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new DetailInstallmentItemsExternalRepositoryImpl(
      this.queryRunner.manager.getRepository(
        DetailInstallmentItemsExternal_ORM_Entity,
      ),
    );
  }

  // =====================
  // External Collateral
  // =====================

  get collateralByBPJSRepo(): ICollateralByBPJSRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new CollateralByBPJSRepositoryImpl(
      this.queryRunner.manager.getRepository(CollateralByBPJS_ORM_Entity),
    );
  }

  get collateralByBPKBRepo(): ICollateralByBPKBRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new CollateralByBPKBRepositoryImpl(
      this.queryRunner.manager.getRepository(CollateralByBPKB_ORM_Entity),
    );
  }

  get collateralBySHMRepo(): ICollateralBySHMRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new CollateralBySHMRepositoryImpl(
      this.queryRunner.manager.getRepository(CollateralBySHM_ORM_Entity),
    );
  }

  get collateralByUMKMRepo(): ICollateralByUMKMRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new CollateralByUMKMRepositoryImpl(
      this.queryRunner.manager.getRepository(CollateralByUMKM_ORM_Entity),
    );
  }

  get collateralByKedinasanMOURepo(): ICollateralByKedinasanMOURepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new CollateralByKedinasanMouRepositoryImpl(
      this.queryRunner.manager.getRepository(CollateralByKedinasan_ORM_Entity),
    );
  }

  get collateralByKedinasan_NON_MOURepo(): ICollateralByKedinasan_Non_MOU_Repository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new CollateralByKedinasan_Non_MOU_RepositoryImpl(
      this.queryRunner.manager.getRepository(
        CollateralByKedinasan_Non_MOU_ORM_Entity,
      ),
    );
  }

  // =====================
  // External Extended
  // =====================

  get surveyPhotosExternalRepo(): ISurveyPhotosRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new SurveyPhotosRepositoryImpl(
      this.queryRunner.manager.getRepository(SurveyPhotos_ORM_Entity),
    );
  }

  get surveyReportsExternalRepo(): ISurveyReportsRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new SurveyReportsRepositoryImpl(
      this.queryRunner.manager.getRepository(SurveyReports_ORM_Entity),
    );
  }

  async start<T>(work: () => Promise<T>): Promise<T> {
    console.log('=== UnitOfWork.start() called ===');
    console.log('DataSource in start():', !!this.dataSource);
    console.log('DataSource type:', typeof this.dataSource);

    if (!this.dataSource) {
      console.error('FATAL: DataSource is null/undefined!');
      throw new Error('DataSource is null or undefined');
    }

    if (!this.dataSource.isInitialized) {
      console.error('FATAL: DataSource is not initialized!');
      throw new Error('DataSource is not initialized');
    }

    console.log('Creating QueryRunner...');
    this.queryRunner = this.dataSource.createQueryRunner();

    await this.queryRunner.connect();
    console.log('✅ QueryRunner connected');

    await this.queryRunner.startTransaction();
    console.log('✅ Transaction started');

    try {
      const result = await work();
      console.log('✅ Work completed successfully, committing...');
      await this.queryRunner.commitTransaction();
      console.log('✅ Transaction committed');
      return result;
    } catch (err) {
      console.log('❌ Error occurred in transaction:', err.message);
      console.log('🔄 Rolling back transaction...');
      await this.queryRunner.rollbackTransaction();
      console.log('✅ Rollback completed successfully');
      throw err;
    } finally {
      console.log('🧹 Releasing QueryRunner...');
      await this.queryRunner.release();
      this.queryRunner = null;
      console.log('✅ QueryRunner released');
    }
  }

  // async commit(): Promise<void> {
  //   if (!this.queryRunner) throw new Error('Transaction not started');
  //   await this.queryRunner.commitTransaction();
  //   await this.queryRunner.release();
  //   this.queryRunner = null;
  // }

  // async rollback(): Promise<void> {
  //   if (!this.queryRunner) throw new Error('Transaction not started');
  //   await this.queryRunner.rollbackTransaction();
  //   await this.queryRunner.release();
  //   this.queryRunner = null;
  // }
}
