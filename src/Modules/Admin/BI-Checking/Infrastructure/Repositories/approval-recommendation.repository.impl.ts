// infrastructure/repositories/address-internal.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ApprovalRecommendation } from '../../Domain/Entities/approval-recommendation.entity';
import { IApprovalRecommendationRepository } from '../../Domain/Repositories/approval-recommendation.repository';
import { ApprovalRecommendation_ORM_Entity } from '../Entities/approval-recommendation.orm-entity';
import { InjectModel } from '@nestjs/mongoose';
import {
  LoanApplicationInt,
  LoanApplicationIntDocument,
} from 'src/Shared/Modules/Drafts/Infrastructure/Schemas/LoanAppInternal/CreateLoanApplicaton_Marketing.schema';

import { Model } from 'mongoose';
import {
  RepeatOrderInternal,
  RepeatOrderIntDocument,
} from 'src/Shared/Modules/Drafts/Infrastructure/Schemas/LoanAppInternal/RepeatOrder_Marketing.schema';
import {
  LoanApplicationExt,
  LoanApplicationExtDocument,
} from 'src/Shared/Modules/Drafts/Infrastructure/Schemas/LoanAppExternal/CreateLoanApplicaton_Marketing.schema';
import { LoanTypeEnum } from 'src/Shared/Enums/Admins/BI/approval-recommendation.enum';
import {
  RepeatOrderExtDocument,
  RepeatOrderExternal,
} from 'src/Shared/Modules/Drafts/Infrastructure/Schemas/LoanAppExternal/RepeatOrder_Marketing.schema';

@Injectable()
export class ApprovalRecommendationRepositoryImpl
  implements IApprovalRecommendationRepository
{
  constructor(
    @InjectRepository(ApprovalRecommendation_ORM_Entity)
    private readonly ormRepository: Repository<ApprovalRecommendation_ORM_Entity>,
    @InjectModel(LoanApplicationInt.name, 'mongoConnection')
    private readonly mongoDraftInternalRepository: Model<LoanApplicationIntDocument>,
    @InjectModel(LoanApplicationExt.name, 'mongoConnection')
    private readonly mongoDraftExternalRepository: Model<LoanApplicationExtDocument>,
    @InjectModel(RepeatOrderInternal.name, 'mongoConnection')
    private readonly repeatOrderIntRepository: Model<RepeatOrderIntDocument>,
    @InjectModel(RepeatOrderExternal.name, 'mongoConnection')
    private readonly repeatOrderExtRepository: Model<RepeatOrderExtDocument>,
  ) {}

  //? MAPPER >==========================================================================

  //? All Transactions that using for get datas
  private toDomain(
    ormEntity: ApprovalRecommendation_ORM_Entity,
  ): ApprovalRecommendation {
    return new ApprovalRecommendation(
      ormEntity.recommendation,
      ormEntity.filePath,
      ormEntity.nominal_pinjaman,
      ormEntity.id,
      ormEntity.draft_id,
      ormEntity.nik,
      ormEntity.no_telp,
      ormEntity.email,
      ormEntity.nama_nasabah,
      ormEntity.catatan,
      ormEntity.type,
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
      nominal_pinjaman: domainEntity.nominal_pinjaman,
      draft_id: domainEntity.draft_id,
      nik: domainEntity.nik,
      no_telp: domainEntity.no_telp,
      email: domainEntity.email,
      nama_nasabah: domainEntity.nama_nasabah,
      catatan: domainEntity.catatan,
      type: domainEntity.type,
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
    if (partial.catatan) ormData.catatan = partial.catatan;
    if (partial.type) ormData.type = partial.type;
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

    const saveOrmPromise = this.ormRepository.save(ormEntity);

    const makeUpdatePromise = (repo, savedOrm) => {
      const draft_id = savedOrm.draft_id;
      if (!draft_id) return Promise.resolve(null);

      return repo.updateOne(
        { _id: draft_id },
        { $set: { isNeedCheck: false } },
      );
    };

    return saveOrmPromise
      .then((savedOrm) => {
        // jalanin dua repo paralel
        const mongoUpdateInternalPromise = makeUpdatePromise(
          this.mongoDraftInternalRepository,
          savedOrm,
        );
        const mongoUpdateExternalPromise = makeUpdatePromise(
          this.mongoDraftExternalRepository,
          savedOrm,
        );
        const repeatUpdateInternalPromise = makeUpdatePromise(
          this.repeatOrderIntRepository,
          savedOrm,
        );
        const repeatUpdateExternalPromise = makeUpdatePromise(
          this.repeatOrderExtRepository,
          savedOrm,
        );

        return Promise.allSettled([
          mongoUpdateInternalPromise,
          mongoUpdateExternalPromise,
          repeatUpdateInternalPromise,
          repeatUpdateExternalPromise,
        ]).then((results) => {
          const [mongoResult, repeatResult] = results;

          if (mongoResult.status === 'rejected') {
            console.warn('Mongo update gagal:', mongoResult.reason?.message);
          }

          if (repeatResult.status === 'rejected') {
            console.warn(
              'RepeatOrder update gagal:',
              repeatResult.reason?.message,
            );
          }

          return this.toDomain(savedOrm);
        });
      })
      .catch((error) => {
        console.error('Error in ApprovalRecommendation.create():', error);
        throw error;
      });
  }

  async findById(id: number): Promise<ApprovalRecommendation | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByDraftId(
    draft_id: string,
  ): Promise<ApprovalRecommendation | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { draft_id },
    });

    if (!ormEntity) {
      console.warn(
        `[ApprovalRecommendationRepo] No record found for draft_id=${draft_id}`,
      );
      return null;
    }

    if (!ormEntity.type) {
      console.warn(
        `[ApprovalRecommendationRepo] Missing relation(s) for draft_id=${draft_id}`,
        {
          hasType: !!ormEntity.type,
        },
      );
    }

    return this.toDomain(ormEntity);
  }

  async findByNIK(nik: string): Promise<ApprovalRecommendation[]> {
    return this.ormRepository.find({
      where: {
        nik,
        deleted_at: IsNull(),
      },
      order: {
        created_at: 'ASC',
      },
    });
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
    const updated = await this.ormRepository.findOne({
      where: { id },
    });
    if (!updated) throw new Error('Approval Recommendation not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async findAllRecommendationInternalHistory() {
    return this.ormRepository
      .createQueryBuilder('rec')
      .select([
        'rec.id',
        'rec.recommendation',
        'rec.nik',
        'rec.nama_nasabah',
        'rec.nominal_pinjaman',
        'rec.no_telp',
        'rec.email',
        'rec.filePath',
        'rec.catatan',
        'rec.created_at',
      ])
      .where('rec.type = :type', { type: LoanTypeEnum.INTERNAL })
      .getMany();
  }

  async findAllRecommendationExternalHistory() {
    return this.ormRepository
      .createQueryBuilder('rec')
      .select([
        'rec.id',
        'rec.recommendation',
        'rec.nik',
        'rec.nama_nasabah',
        'rec.nominal_pinjaman',
        'rec.no_telp',
        'rec.email',
        'rec.filePath',
        'rec.catatan',
        'rec.created_at',
      ])
      .where('rec.type = :type', { type: LoanTypeEnum.EXTERNAL })
      .getMany();
  }

  async findAllRecommendationInternalRequests(): Promise<any[]> {
    // ambil data dari LoanApplication (draft)
    const draftDataInternal = await this.mongoDraftInternalRepository
      .find(
        { isNeedCheck: true, isDeleted: false },
        {
          marketing_id: 1,
          _id: 1,
          'client_internal.nama_lengkap': 1,
          'client_internal.no_ktp': 1,
          'client_internal.no_hp': 1,
          'client_internal.email': 1,
          'client_internal.foto_ktp': 1,
          'loan_application_internal.nominal_pinjaman': 1,
        },
      )
      .lean();

    // ambil data dari RepeatOrder
    const repeatOrderData = await this.repeatOrderIntRepository
      .find(
        { isNeedCheck: true, isDeleted: false },
        {
          marketing_id: 1,
          _id: 1,
          'client_internal.nama_lengkap': 1,
          'client_internal.no_ktp': 1,
          'client_internal.no_hp': 1,
          'client_internal.email': 1,
          'uploaded_files.foto_ktp': 1,
          'loan_application_internal.nominal_pinjaman': 1,
          isRepeatOrder: 1,
        },
      )
      .lean();

    // ubah struktur repeat order biar match draftData (foto_ktp 1 url aja)
    const mappedRepeatOrderData = repeatOrderData.map((item) => {
      const fotoKtpArr = (item.uploaded_files as any)?.foto_ktp;
      const fotoKtp =
        Array.isArray(fotoKtpArr) && fotoKtpArr.length > 0
          ? (fotoKtpArr[0] as any).url
          : null;

      return {
        _id: item._id,
        marketing_id: item.marketing_id,
        client_internal: {
          nama_lengkap: item.client_internal?.nama_lengkap || null,
          no_ktp: item.client_internal?.no_ktp || null,
          no_hp: item.client_internal?.no_hp || null,
          email: item.client_internal?.email || null,
          foto_ktp: fotoKtp, // di sini taro url-nya biar konsisten
        },
        loan_application_internal: {
          nominal_pinjaman:
            item.loan_application_internal?.nominal_pinjaman || null,
        },
      };
    });

    // gabung hasil dari dua koleksi
    const result = [...draftDataInternal, ...mappedRepeatOrderData];

    return result;
  }

  async findAllRecommendationExternalRequests(): Promise<any[]> {
    // ambil data dari LoanApplication (draft)

    const draftDataExternal = await this.mongoDraftExternalRepository
      .find(
        { isNeedCheck: true, isDeleted: false },
        {
          marketing_id: 1,
          _id: 1,
          'client_external.nama_lengkap': 1,
          'client_external.nik': 1,
          'client_external.no_hp': 1,
          'client_external.email': 1,
          'uploaded_files.foto_ktp_peminjam': 1,
          'loan_application_external.nominal_pinjaman': 1,
        },
      )
      .lean();

    // ambil data dari RepeatOrder
    const repeatOrderData = await this.repeatOrderExtRepository
      .find(
        { isNeedCheck: true, isDeleted: false },
        {
          marketing_id: 1,
          _id: 1,
          'client_external.nama_lengkap': 1,
          'client_external.nik': 1,
          'client_external.no_hp': 1,
          'client_external.email': 1,
          'uploaded_files.foto_ktp_peminjam': 1,
          'loan_application_external.nominal_pinjaman': 1,
          isRepeatOrder: 1,
        },
      )
      .lean();

    const mappedDraftData = draftDataExternal.map((item) => {
      const fotoKtpArr = (item.uploaded_files as any)?.foto_ktp_peminjam;
      const fotoKtp =
        Array.isArray(fotoKtpArr) && fotoKtpArr.length > 0
          ? (fotoKtpArr[0] as any).url
          : null;

      return {
        _id: item._id,
        marketing_id: item.marketing_id,
        client_external: {
          nama_lengkap: item.client_external?.nama_lengkap || null,
          no_ktp: item.client_external?.nik || null,
          no_hp: item.client_external?.no_hp || null,
          email: item.client_external?.email || null,
          foto_ktp: fotoKtp, // di sini taro url-nya biar konsisten
        },
        loan_application_external: {
          nominal_pinjaman:
            item.loan_application_external?.nominal_pinjaman || null,
        },
      };
    });

    // ubah struktur repeat order biar match draftData (foto_ktp 1 url aja)
    const mappedRepeatOrderData = repeatOrderData.map((item) => {
      const fotoKtpArr = (item.uploaded_files as any)?.foto_ktp_peminjam;
      const fotoKtp =
        Array.isArray(fotoKtpArr) && fotoKtpArr.length > 0
          ? (fotoKtpArr[0] as any).url
          : null;

      return {
        _id: item._id,
        marketing_id: item.marketing_id,
        client_external: {
          nama_lengkap: item.client_external?.nama_lengkap || null,
          no_ktp: item.client_external?.nik || null,
          no_hp: item.client_external?.no_hp || null,
          email: item.client_external?.email || null,
          foto_ktp: fotoKtp, // di sini taro url-nya biar konsisten
        },
        loan_application_external: {
          nominal_pinjaman:
            item.loan_application_external?.nominal_pinjaman || null,
        },
      };
    });

    // gabung hasil dari dua koleksi
    const result = [...mappedDraftData, ...mappedRepeatOrderData];

    return result;
  }
}
