// Infrastructure/Repositories/client-installment-frequency.repository.impl.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientInstallmentFrequency } from '../../Domain/Entities/client_loan_installment_frequency.entity';
import {
  IClientInstallmentFrequencyRepository,
  IlwDeductionRaw,
  LoanFrequencySummaryRaw,
} from '../../Domain/Repositories/client_loan_installment_frequency.repository';
import { ClientInstallmentFrequency_ORM_Entity } from '../Entities/client_loan_installment_frequency.orm-entity';
import { FrequencyStatus } from 'src/Shared/Enums/Admins/Account-Receivable/FrequencyStatus';
import { ExportableFrequencyStatusFilter } from 'src/Modules/Users/Roles/Admin/Account-Receivable/Applications/DTOS/AdAR_GetExportableCSVData.dto';

@Injectable()
export class ClientInstallmentFrequencyRepositoryImpl
  implements IClientInstallmentFrequencyRepository
{
  constructor(
    @InjectRepository(ClientInstallmentFrequency_ORM_Entity)
    private readonly ormRepository: Repository<ClientInstallmentFrequency_ORM_Entity>,
  ) {}

  //? MAPPER >==========================================================================

  private toDomain(
    orm: ClientInstallmentFrequency_ORM_Entity,
  ): ClientInstallmentFrequency {
    return new ClientInstallmentFrequency(
      orm.loan_frequency,
      orm.application_date,
      orm.loan_amount,
      orm.loan_tenor,
      orm.revenue_forecast,
      orm.outstanding_receivable_total,
      orm.pay_type,
      orm.expected_payout_date,
      orm.id,
      orm.loan_agreement_id,
      orm.client_id,
      orm.created_at,
      orm.updated_at,
      orm.deleted_at,
    );
  }

  private toOrm(
    domain: ClientInstallmentFrequency,
  ): Partial<ClientInstallmentFrequency_ORM_Entity> {
    return {
      id: domain?.id,
      loan_agreement_id: domain.loan_agreement_id,
      loan_frequency: domain.loan_frequency,
      application_date: domain.application_date,
      loan_amount: domain.loan_amount,
      expected_payout_date: domain?.expected_payout_date,
      loan_tenor: domain.loan_tenor,
      revenue_forecast: domain.revenue_forecast,
      outstanding_receivable_total: domain.outstanding_receivable_total,
      pay_type: domain.pay_type,
      client_id: domain.client_id,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  private toOrmPartial(
    partial: Partial<ClientInstallmentFrequency>,
  ): Partial<ClientInstallmentFrequency_ORM_Entity> {
    const ormData: Partial<ClientInstallmentFrequency_ORM_Entity> = {};

    if (partial.loan_agreement_id)
      ormData.loan_agreement_id = partial.loan_agreement_id;
    if (partial.loan_frequency) ormData.loan_frequency = partial.loan_frequency;
    if (partial.application_date)
      ormData.application_date = partial.application_date;
    if (partial.expected_payout_date)
      ormData.expected_payout_date = partial.expected_payout_date;
    if (partial.loan_amount) ormData.loan_amount = partial.loan_amount;
    if (partial.loan_tenor) ormData.loan_tenor = partial.loan_tenor;
    if (partial.revenue_forecast)
      ormData.revenue_forecast = partial.revenue_forecast;
    if (partial.outstanding_receivable_total)
      ormData.outstanding_receivable_total =
        partial.outstanding_receivable_total;
    if (partial.pay_type) ormData.pay_type = partial.pay_type;
    if (partial.client_id) ormData.client_id = partial.client_id;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at) ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  //?===================================================================================

  async create(
    entity: ClientInstallmentFrequency,
  ): Promise<ClientInstallmentFrequency> {
    const ormEntity = this.toOrm(entity);
    const saved = await this.ormRepository.save(ormEntity);
    return this.toDomain(saved);
  }

  async update(
    id: string,
    data: Partial<ClientInstallmentFrequency>,
  ): Promise<ClientInstallmentFrequency> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({ where: { id } });
    if (!updated) throw new Error('ClientInstallmentFrequency not found');
    return this.toDomain(updated);
  }

  async findAll(): Promise<ClientInstallmentFrequency[]> {
    const list = await this.ormRepository.find({
      order: { created_at: 'ASC' },
    });
    return list.map((orm) => this.toDomain(orm));
  }

  async findById(id: string): Promise<ClientInstallmentFrequency | null> {
    const orm = await this.ormRepository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByClientId(
    client_id: string,
  ): Promise<ClientInstallmentFrequency[]> {
    const list = await this.ormRepository.find({
      where: { client_id },
      order: { created_at: 'ASC' },
    });
    return list.map((orm) => this.toDomain(orm));
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async addExpectedLoanPayout(
    frequency_id: string,
    expected_payout_date: Date,
  ): Promise<void> {
    const result = await this.ormRepository.update(
      { id: frequency_id },
      { expected_payout_date, updated_at: new Date() },
    );

    if (result.affected === 0) {
      throw new Error(`Frequency dengan id ${frequency_id} tidak ditemukan`);
    }
  }

  async callSP_AdAR_GetExportableCSVData(
    companyName: string,
    frequencyStatus: FrequencyStatus,
    page: number,
    pageSize: number,
  ): Promise<LoanFrequencySummaryRaw[]> {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    const result = await this.ormRepository.query(
      `CALL AdAR_GetExportableCSVData(?, ?, ?, ?)`,
      [companyName, frequencyStatus, limit, offset],
    );

    return result[0] as LoanFrequencySummaryRaw[];
  }

  async callSP_AdAR_DispatchExportableCSVData(
    companyName: string,
    frequencyStatus: ExportableFrequencyStatusFilter,
    page: number,
    pageSize: number,
  ): Promise<IlwDeductionRaw[]> {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    const result = await this.ormRepository.query(
      `CALL AdAR_DispatchExportableCSVData(?, ?, ?, ?)`,
      [companyName, frequencyStatus, limit, offset],
    );

    const rows = result[0] as any[];

    if (rows.length === 1 && rows[0]._error) {
      throw new BadRequestException(rows[0]._error);
    }

    return rows as IlwDeductionRaw[];
  }
}
