import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LoanApplication,
  LoanApplicationDocument,
} from '../../Schemas/LoanAppInternal/CreateLoanApplicaton_Marketing.schema';
import { ILoanApplicationDraftRepository } from '../../../Domain/Repositories/LoanAppInt.repository';
import { LoanApplicationEntity } from '../../../Domain/Entities/LoanAppInt.entity';
import { merge, isEqual } from 'lodash';

@Injectable()
export class LoanApplicationRepositoryImpl
  implements ILoanApplicationDraftRepository
{
  constructor(
    @InjectModel(LoanApplication.name, 'mongoConnection')
    private readonly loanAppModel: Model<LoanApplicationDocument>,
  ) {}

  async create(
    data: Partial<LoanApplicationEntity>,
  ): Promise<LoanApplicationEntity> {
    const created = new this.loanAppModel(data);
    const saved = await created.save();
    return new LoanApplicationEntity(saved.toObject());
  }

  async findById(id: string): Promise<LoanApplicationEntity | null> {
    const found = await this.loanAppModel.findById(id).exec();
    return found ? new LoanApplicationEntity(found.toObject()) : null;
  }

  async findByMarketingId(
    marketingId: number,
  ): Promise<LoanApplicationEntity[]> {
    console.log('Repository: Finding by marketing ID:', marketingId);
    const list = await this.loanAppModel
      .find({ marketing_id: marketingId })
      .exec();
    return list.map((doc) => new LoanApplicationEntity(doc.toObject()));
  }

async updateDraftById(
  id: string,
  updateData: Partial<LoanApplicationEntity>,
): Promise<{ entity: LoanApplicationEntity | null; isUpdated: boolean }> {
  const existing = await this.loanAppModel.findById(id).lean().exec();
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

  async softDelete(id: string): Promise<void> {
    await this.loanAppModel.findByIdAndUpdate(id, { isDeleted: true }).exec();
  }
}
