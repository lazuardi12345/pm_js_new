// infrastructure/repositories/address-internal.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalRecommendation } from '../../Domain/Entities/approval-recommendation.entity';
import { IApprovalRecommendationRepository } from '../../Domain/Repositories/approval-recommendation.repository';
import { ApprovalRecommendation_ORM_Entity } from '../Entities/approval-recommendation.orm-entity';
import { LoanApplicationInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/loan-application-internal.orm-entity';
import { LoanApplicationExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/loan-application-external.orm-entity';
import { InjectModel } from '@nestjs/mongoose';
import {
  LoanApplication,
  LoanApplicationDocument,
} from 'src/Shared/Modules/Drafts/Infrastructure/Schemas/LoanAppInternal/CreateLoanApplicaton_Marketing.schema';
import { Model } from 'mongoose';

@Injectable()
export class ApprovalRecommendationRepositoryImpl
  implements IApprovalRecommendationRepository
{
  constructor(
    @InjectRepository(ApprovalRecommendation_ORM_Entity)
    private readonly ormRepository: Repository<ApprovalRecommendation_ORM_Entity>,
    @InjectModel(LoanApplication.name, 'mongoConnection')
    private readonly mongoDraftRepository: Model<LoanApplicationDocument>,
  ) {}

  //? MAPPER >==========================================================================

  //? All Transactions that using for get datas
  private toDomain(
    ormEntity: ApprovalRecommendation_ORM_Entity,
  ): ApprovalRecommendation {
    return new ApprovalRecommendation(
      ormEntity.recommendation,
      ormEntity.filePath,
      ormEntity.id,
      ormEntity.draft_id,
      ormEntity.nik,
      ormEntity.no_telp,
      ormEntity.email,
      ormEntity.nama_nasabah,
      ormEntity.loanApplicationInternal.id,
      ormEntity.loanApplicationExternal.id,
      ormEntity.created_at,
      ormEntity.deleted_at,
      ormEntity.updated_at,
    );
  }

  //? All Transactions that using for Create datas
  private toOrm(
    domainEntity: ApprovalRecommendation,
  ): Partial<ApprovalRecommendation_ORM_Entity> {
    return {
      id: domainEntity?.id,
      recommendation: domainEntity.recommendation,
      filePath: domainEntity.filePath,
      draft_id: domainEntity.draft_id,
      nik: domainEntity.nik,
      no_telp: domainEntity.no_telp,
      email: domainEntity.email,
      nama_nasabah: domainEntity.nama_nasabah,
      loanApplicationInternal: {
        id: domainEntity.id,
      } as LoanApplicationInternal_ORM_Entity,
      loanApplicationExternal: {
        id: domainEntity.id,
      } as LoanApplicationExternal_ORM_Entity,
      created_at: domainEntity.created_at,
      updated_at: domainEntity.updated_at,
      deleted_at: domainEntity.deleted_at,
    };
  }

  //? All Transactions that using for Partial Update like PATCH or Delete
  private toOrmPartial(
    partial: Partial<ApprovalRecommendation>,
  ): Partial<ApprovalRecommendation_ORM_Entity> {
    const ormData: Partial<ApprovalRecommendation_ORM_Entity> = {};

    // if (partial.nasabah)
    //   ormData.nasabah = {
    //     id: partial.nasabah.id,
    //   } as ClientInternal_ORM_Entity;
    if (partial.recommendation) ormData.recommendation = partial.recommendation;
    if (partial.filePath) ormData.filePath = partial.filePath;
    if (partial.draft_id) ormData.draft_id = partial.draft_id;
    if (partial.nik) ormData.nik = partial.nik;
    if (partial.no_telp) ormData.no_telp = partial.no_telp;
    if (partial.email) ormData.email = partial.email;
    if (partial.nama_nasabah) ormData.nama_nasabah = partial.nama_nasabah;
    if (partial.loan_application_internal_id)
      ormData.loanApplicationInternal = {
        id: partial.loan_application_internal_id,
      } as LoanApplicationInternal_ORM_Entity;
    if (partial.loan_application_external_id)
      ormData.loanApplicationExternal = {
        id: partial.loan_application_external_id,
      } as LoanApplicationExternal_ORM_Entity;
    if (partial.created_at) ormData.created_at = partial.created_at;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at) ormData.deleted_at = partial.deleted_at;

    return ormData;
  }
  //?===================================================================================

  async create(
    entity: ApprovalRecommendation,
  ): Promise<ApprovalRecommendation> {
    const ormEntity = this.toOrm(entity);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }
  async findById(id: number): Promise<ApprovalRecommendation | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByDraftId(
    draft_id: string,
  ): Promise<ApprovalRecommendation | null> {
    const ormEntities = await this.ormRepository.findOne({
      where: { draft_id: draft_id },
    });
    return ormEntities ? this.toDomain(ormEntities) : null;
  }

  async findByNIK(nik: string): Promise<ApprovalRecommendation | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { nik } });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async save(
    approvalRecommendation: ApprovalRecommendation,
  ): Promise<ApprovalRecommendation> {
    const ormEntity = this.toOrm(approvalRecommendation);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }

  async update(
    id: number,
    approvalRecommendationData: Partial<ApprovalRecommendation>,
  ): Promise<ApprovalRecommendation> {
    await this.ormRepository.update(
      id,
      this.toOrmPartial(approvalRecommendationData),
    );
    console.log('id>>>>>>>>>>>>>>', id);
    const updated = await this.ormRepository.findOne({
      where: { id },
    });
    if (!updated) throw new Error('Approval Recommendation not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async findAllRecommendationHistory(): Promise<any[]> {
    return await this.ormRepository
      .createQueryBuilder('rec')
      .select([
        'rec.id',
        'rec.recommendation',
        'rec.nik',
        'rec.nama_nasabah',
        'rec.no_telp',
        'rec.email',
        'rec.filePath',
        'rec.created_at',
      ])
      // .where('rec.loanApplicationInternal IS NOT NULL')
      .getMany();
  }
  async findAllRecommendationRequests(): Promise<any[]> {
    return this.mongoDraftRepository
      .find(
        { isNeedCheck: true },
        {
          marketing_id: 1,
          'client_internal.nama_lengkap': 1,
          'client_internal.no_ktp': 1,
          'client_internal.no_hp': 1,
          'client_internal.email': 1,
          'client_internal.foto_ktp': 1,
          'loan_application_internal.nominal_pinjaman': 1,
          // kamu bisa tambah field lain kalau perlu
        },
      )
      .exec();
  }
}
