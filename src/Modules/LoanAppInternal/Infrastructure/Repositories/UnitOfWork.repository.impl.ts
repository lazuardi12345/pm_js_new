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
  get clientRepo(): IClientInternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new ClientInternalRepositoryImpl(
      this.queryRunner.manager.getRepository(ClientInternal_ORM_Entity),
    );
  }

  get addressRepo(): IAddressInternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new AddressInternalRepositoryImpl(
      this.queryRunner.manager.getRepository(AddressInternal_ORM_Entity),
    );
  }

  get approvalRepo(): IApprovalInternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new ApprovalInternalRepositoryImpl(
  this.queryRunner.manager.getRepository(ApprovalInternal_ORM_Entity),
  new LoanApplicationInternalRepositoryImpl(
    this.queryRunner.manager.getRepository(LoanApplicationInternal_ORM_Entity),
  ),
);
  }

  get collateralRepo(): ICollateralInternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new CollateralInternalRepositoryImpl(
      this.queryRunner.manager.getRepository(CollateralInternal_ORM_Entity),
    );
  }

  get familyRepo(): IFamilyInternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new FamilyInternalRepositoryImpl(
      this.queryRunner.manager.getRepository(FamilyInternal_ORM_Entity),
    );
  }

  get jobRepo(): IJobInternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new JobInternalRepositoryImpl(
      this.queryRunner.manager.getRepository(JobInternal_ORM_Entity),
    );
  }

  get loanAppRepo(): ILoanApplicationInternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new LoanApplicationInternalRepositoryImpl(
      this.queryRunner.manager.getRepository(
        LoanApplicationInternal_ORM_Entity,
      ),
    );
  }

  get relativeRepo(): IRelativesInternalRepository {
    if (!this.queryRunner) throw new Error('Transaction not started');
    return new RelativeInternalRepositoryImpl(
      this.queryRunner.manager.getRepository(RelativeInternal_ORM_Entity),
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
    this.queryRunner = this.dataSource.createQueryRunner(); // Line yang error
    
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const result = await work();
      await this.queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async commit(): Promise<void> {
    if (!this.queryRunner) throw new Error('Transaction not started');
    await this.queryRunner.commitTransaction();
    await this.queryRunner.release();
    this.queryRunner = null;
  }

  async rollback(): Promise<void> {
    if (!this.queryRunner) throw new Error('Transaction not started');
    await this.queryRunner.rollbackTransaction();
    await this.queryRunner.release();
    this.queryRunner = null;
  }
}
