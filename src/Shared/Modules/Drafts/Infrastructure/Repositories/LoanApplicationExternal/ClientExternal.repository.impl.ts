import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LoanApplicationExt,
  LoanApplicationExtDocument,
  InstallmentItemsExternal,
} from '../../Schemas/LoanAppExternal/CreateLoanApplicaton_Marketing.schema';
import { ILoanApplicationDraftExternalRepository } from '../../../Domain/Repositories/ext/LoanAppExt.repository';
import { LoanApplicationExtEntity } from '../../../Domain/Entities/ext/LoanAppExt.entity';
import { merge, isEqual } from 'lodash';

interface OtherExistLoansExternalType {
  cicilan: InstallmentItemsExternal[];
  validasi_pinjaman_lain?: boolean;
  catatan?: string;
}

@Injectable()
export class LoanApplicationExtRepositoryImpl
  implements ILoanApplicationDraftExternalRepository
{
  constructor(
    @InjectModel(LoanApplicationExt.name, 'mongoConnection')
    private readonly loanAppModel: Model<LoanApplicationExtDocument>,
  ) {}

  async getLastLoanSequenceByNik(nik: string): Promise<number> {
    const lastLoan = await this.loanAppModel
      .findOne(
        {
          'client_external.nik': nik,
          isCompleted: true,
        },
        {
          'loan_application_external.pinjaman_ke': 1,
        },
      )
      .sort({
        'loan_application_external.pinjaman_ke': -1,
      })
      .lean<{
        loan_application_external?: { pinjaman_ke?: number };
      }>();

    return lastLoan?.loan_application_external?.pinjaman_ke ?? 0;
  }

  async getNextDraftPinjamanKeByNik(nik: string): Promise<number> {
    const last = await this.getLastLoanSequenceByNik(nik);
    return last + 1;
  }

  async create(
    data: Partial<LoanApplicationExtEntity>,
  ): Promise<LoanApplicationExtEntity> {
    const created = new this.loanAppModel(data);
    const saved = await created.save();
    return new LoanApplicationExtEntity(saved.toObject());
  }

  async findStatus(
    nik: string,
  ): Promise<{ draft_id: string; isNeedCheck: boolean } | null> {
    const found = await this.loanAppModel
      .findOne({ 'client_external.no_ktp': nik }, { isNeedCheck: 1, _id: 1 })
      .lean();

    if (!found) return null;

    return {
      draft_id: found._id.toString(), // <— jadikan draft_id dari _id Mongo
      isNeedCheck: found.isNeedCheck ?? false,
    };
  }

  async findById(id: string): Promise<LoanApplicationExtEntity | null> {
    const found = await this.loanAppModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    return found ? new LoanApplicationExtEntity(found.toObject()) : null;
  }

  async findByMarketingId(
    marketingId: number,
  ): Promise<LoanApplicationExtEntity[]> {
    const list = await this.loanAppModel
      .find(
        { marketing_id: marketingId, isDeleted: false },
        {
          _id: 1,
          'client_external.nama_lengkap': 1,
          'client_external.nik': 1,
          'client_external.no_hp': 1,
          'loan_application_external.nominal_pinjaman': 1,
          'loan_application_external.tenor': 1,
          isDeleted: 1,
          isNeedCheck: 1,
          isCompleted: 1,
          createdAt: 1,
        },
      )
      .exec();

    return list.map((doc) => new LoanApplicationExtEntity(doc.toObject()));
  }

  async findAll(): Promise<LoanApplicationExtEntity[]> {
    const all = await this.loanAppModel.find({ isDeleted: false }).exec();
    return all.map((doc) => new LoanApplicationExtEntity(doc.toObject()));
  }

  async updateDraftById(
    id: string,
    updateData: Partial<LoanApplicationExtEntity>,
  ): Promise<{ entity: LoanApplicationExtEntity | null; isUpdated: boolean }> {
    // Ambil existing dari DB
    const existing = await this.loanAppModel.findById(id).exec();
    if (!existing) return { entity: null, isUpdated: false };

    const existingObj = existing.toObject();

    const existingOtherLoans = (existingObj.other_exist_loan_external ??
      {}) as OtherExistLoansExternalType;

    const newOtherLoans = (updateData.other_exist_loan_external ??
      {}) as OtherExistLoansExternalType;

    const existingCicilanArr = Array.isArray(existingOtherLoans.cicilan)
      ? existingOtherLoans.cicilan
      : [];

    const newCicilanArr = Array.isArray(newOtherLoans.cicilan)
      ? newOtherLoans.cicilan
      : [];

    const mergedCicilan = [
      ...existingCicilanArr,
      ...newCicilanArr.filter(
        (newItem) =>
          !existingCicilanArr.some(
            (oldItem) => oldItem.nama_pembiayaan === newItem.nama_pembiayaan,
          ),
      ),
    ];

    // Build merged object
    const mergedData = {
      ...existingObj,
      ...updateData,
      other_exist_loan_external: {
        ...existingOtherLoans,
        ...newOtherLoans,
        cicilan: mergedCicilan,
      },
    };

    // Kalo tidak berubah, skip update
    const hasChanged = !isEqual(existingObj, mergedData);
    if (!hasChanged) {
      return {
        entity: new LoanApplicationExtEntity(existingObj),
        isUpdated: false,
      };
    }

    // Update DB
    const updated = await this.loanAppModel
      .findByIdAndUpdate(id, mergedData, { new: true })
      .exec();

    return {
      entity: updated ? new LoanApplicationExtEntity(updated.toObject()) : null,
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

    if (nominal_fixtype >= 0) {
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
