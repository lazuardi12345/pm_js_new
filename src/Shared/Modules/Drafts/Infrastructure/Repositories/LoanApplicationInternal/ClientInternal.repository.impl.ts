import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LoanApplicationInt,
  LoanApplicationDocument,
} from '../../Schemas/LoanAppInternal/CreateLoanApplicaton_Marketing.schema';
import { ILoanApplicationDraftInternalRepository } from '../../../Domain/Repositories/int/LoanAppInt.repository';
import { LoanApplicationEntity } from '../../../Domain/Entities/int/LoanAppInt.entity';
import { merge, isEqual } from 'lodash';

@Injectable()
export class LoanApplicationIntRepositoryImpl
  implements ILoanApplicationDraftInternalRepository
{
  constructor(
    @InjectModel(LoanApplicationInt.name, 'mongoConnection')
    private readonly loanAppModel: Model<LoanApplicationDocument>,
  ) {}

  async create(
    data: Partial<LoanApplicationEntity>,
  ): Promise<LoanApplicationEntity> {
    const created = new this.loanAppModel(data);
    const saved = await created.save();
    return new LoanApplicationEntity(saved.toObject());
  }

  async findStatus(
    nik: string,
  ): Promise<{ draft_id: string; isNeedCheck: boolean } | null> {
    const found = await this.loanAppModel
      .findOne({ 'client_internal.no_ktp': nik }, { isNeedCheck: 1, _id: 1 })
      .lean();

    if (!found) return null;

    return {
      draft_id: found._id.toString(), // <— jadikan draft_id dari _id Mongo
      isNeedCheck: found.isNeedCheck ?? false,
    };
  }

  async findById(id: string): Promise<LoanApplicationEntity | null> {
    const found = await this.loanAppModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    return found ? new LoanApplicationEntity(found.toObject()) : null;
  }

  async findByMarketingId(
    marketingId: number,
  ): Promise<LoanApplicationEntity[]> {
    const list = await this.loanAppModel
      .find(
        { marketing_id: marketingId, isDeleted: false },
        {
          _id: 1,
          'client_internal.nama_lengkap': 1,
          'client_internal.no_ktp': 1,
          'client_internal.no_hp': 1,
          'loan_application_internal.nominal_pinjaman': 1,
          'loan_application_internal.tenor': 1,
          isDeleted: 1,
          isNeedCheck: 1,
          isCompleted: 1,
          createdAt: 1,
        },
      )
      .exec();

    return list.map((doc) => new LoanApplicationEntity(doc.toObject()));
  }

  async findAll(): Promise<LoanApplicationEntity[]> {
    const all = await this.loanAppModel.find({ isDeleted: false }).exec();
    return all.map((doc) => new LoanApplicationEntity(doc.toObject()));
  }

  async updateDraftById(
    id: string,
    updateData: Partial<LoanApplicationEntity>,
  ): Promise<{ entity: LoanApplicationEntity | null; isUpdated: boolean }> {
    const existing = await this.loanAppModel
      .findOne({ _id: id, isDeleted: false })
      .lean()
      .exec();
    if (!existing) return { entity: null, isUpdated: false };

    const mergedData = merge({}, existing, updateData);
    const hasChanged = !isEqual(existing, mergedData);

    if (!hasChanged) {
      console.log('⚪ Tidak ada perubahan data — skip update');
      return { entity: new LoanApplicationEntity(existing), isUpdated: false };
    }

    const updated = await this.loanAppModel
      .findByIdAndUpdate(id, mergedData, { new: true })
      .exec();

    return {
      entity: updated ? new LoanApplicationEntity(updated.toObject()) : null,
      isUpdated: true,
    };
  }

  async triggerIsNeedCheckBeingTrue(
    draft_id: string,
    nominal_pinjaman: number,
  ): Promise<void> {
    if (!draft_id) {
      throw new Error('draft_id is required');
    } else if (!nominal_pinjaman) {
      throw new Error('nominal_pinjaman is required');
    }

    const nominal_fixtype = Number(nominal_pinjaman);
    console.log('Jembus Wedut >>>>>>>>>>>>>>>>>>>>>>', nominal_fixtype);

    if (nominal_fixtype >= 7000000) {
      const response = await this.loanAppModel.updateOne(
        { _id: draft_id },
        { isNeedCheck: true },
      );
      if (response.matchedCount === 0) {
        throw new Error('Draft not found');
      } else {
        console.log('Updated isNeedCheck to true for draft_id:', draft_id);
      }
    }
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.loanAppModel.updateOne(
      { _id: id },
      { isDeleted: true },
    );
    return result.modifiedCount > 0;
  }
}
