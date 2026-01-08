import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { merge, isEqual } from 'lodash';
import { IDraftRepeatOrderInternalRepository } from '../../../Domain/Repositories/int/DraftRepeatOrder.repository';
import {
  RepeatOrderInternal,
  RepeatOrderIntDocument,
} from '../../Schemas/LoanAppInternal/RepeatOrder_Marketing.schema';
import { RepeatOrderEntity } from '../../../Domain/Entities/int/DraftRepeatOrder.entity';

@Injectable()
export class DraftRepeatOrderInternalRepositoryImpl
  implements IDraftRepeatOrderInternalRepository
{
  constructor(
    @InjectModel(RepeatOrderInternal.name, 'mongoConnection')
    private readonly repeatOrderModel: Model<RepeatOrderIntDocument>,
  ) {}

  async create(data: Partial<RepeatOrderEntity>): Promise<RepeatOrderEntity> {
    const created = new this.repeatOrderModel(data);
    const saved = await created.save();
    return new RepeatOrderEntity(saved.toObject());
  }

  async findStatus(
    nik: string,
  ): Promise<{ draft_id: string; isNeedCheck: boolean } | null> {
    const found = await this.repeatOrderModel
      .findOne({ 'client_internal.no_ktp': nik }, { isNeedCheck: 1, _id: 1 })
      .lean();

    if (!found) return null;

    return {
      draft_id: found._id.toString(), // <— jadikan draft_id dari _id Mongo
      isNeedCheck: found.isNeedCheck ?? false,
    };
  }

  async findById(id: string): Promise<RepeatOrderEntity | null> {
    const found = await this.repeatOrderModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    return found ? new RepeatOrderEntity(found.toObject()) : null;
  }

  async findByMarketingId(marketingId: number): Promise<RepeatOrderEntity[]> {
    const list = await this.repeatOrderModel
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

    return list.map((doc) => new RepeatOrderEntity(doc.toObject()));
  }

  async findAll(): Promise<RepeatOrderEntity[]> {
    const all = await this.repeatOrderModel.find({ isDeleted: false }).exec();
    return all.map((doc) => new RepeatOrderEntity(doc.toObject()));
  }

  async updateDraftById(
    id: string,
    updateData: Partial<RepeatOrderEntity>,
  ): Promise<{ entity: RepeatOrderEntity | null; isUpdated: boolean }> {
    const existing = await this.repeatOrderModel
      .findOne({ _id: id, isDeleted: false })
      .lean()
      .exec();
    if (!existing) return { entity: null, isUpdated: false };

    const mergedData = merge({}, existing, updateData);
    const hasChanged = !isEqual(existing, mergedData);

    if (!hasChanged) {
      console.log('⚪ Tidak ada perubahan data — skip update');
      return { entity: new RepeatOrderEntity(existing), isUpdated: false };
    }

    const updated = await this.repeatOrderModel
      .findByIdAndUpdate(id, mergedData, { new: true })
      .exec();

    return {
      entity: updated ? new RepeatOrderEntity(updated.toObject()) : null,
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

    if (nominal_fixtype >= 7000000) {
      const response = await this.repeatOrderModel.updateOne(
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

  async triggerIsCompletedBeingTrue(draft_id: string): Promise<void> {
    if (!draft_id) {
      throw new Error('draft_id is required');
    }

    await this.repeatOrderModel.updateOne(
      { _id: draft_id },
      { isCompleted: true },
    );
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.repeatOrderModel.updateOne(
      { _id: id },
      { isDeleted: true },
    );
    return result.modifiedCount > 0;
  }
}
