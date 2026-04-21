// Infrastructure/Repositories/client-loan-installment-internal.repository.impl.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ClientLoanInstallmentInternal } from '../../Domain/Entities/client_loan_installment_internal.entity';
import { IClientLoanInstallmentInternalRepository } from '../../Domain/Repositories/client_loan_installment_internal.repository';
import { ClientLoanInstallmentInternal_ORM_Entity } from '../Entities/client_loan_installment_internal.orm-entity';

@Injectable()
export class ClientLoanInstallmentInternalRepositoryImpl
  implements IClientLoanInstallmentInternalRepository
{
  constructor(
    @InjectRepository(ClientLoanInstallmentInternal_ORM_Entity)
    private readonly ormRepository: Repository<ClientLoanInstallmentInternal_ORM_Entity>,
  ) {}

  //? MAPPER >==========================================================================

  private toDomain(
    orm: ClientLoanInstallmentInternal_ORM_Entity,
  ): ClientLoanInstallmentInternal {
    return new ClientLoanInstallmentInternal(
      orm.client_name,
      orm.nik,
      orm.company_name,
      orm.original_loan_principal,
      orm.revenue_forecast,
      orm.outstanding_receivable_total,
      orm.id,
      orm.created_at,
      orm.updated_at,
      orm.deleted_at,
    );
  }

  private toOrm(
    domain: ClientLoanInstallmentInternal,
  ): Partial<ClientLoanInstallmentInternal_ORM_Entity> {
    return {
      id: domain?.id,
      client_name: domain.client_name,
      nik: domain.nik,
      company_name: domain.company_name,
      original_loan_principal: domain.original_loan_principal,
      revenue_forecast: domain.revenue_forecast,
      outstanding_receivable_total: domain.outstanding_receivable_total,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  private toOrmPartial(
    partial: Partial<ClientLoanInstallmentInternal>,
  ): Partial<ClientLoanInstallmentInternal_ORM_Entity> {
    const ormData: Partial<ClientLoanInstallmentInternal_ORM_Entity> = {};

    if (partial.client_name) ormData.client_name = partial.client_name;
    if (partial.nik) ormData.nik = partial.nik;
    if (partial.company_name) ormData.company_name = partial.company_name;
    if (partial.original_loan_principal)
      ormData.original_loan_principal = partial.original_loan_principal;
    if (partial.revenue_forecast)
      ormData.revenue_forecast = partial.revenue_forecast;
    if (partial.outstanding_receivable_total)
      ormData.outstanding_receivable_total =
        partial.outstanding_receivable_total;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at) ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  //?===================================================================================

  async create(
    entity: ClientLoanInstallmentInternal,
  ): Promise<ClientLoanInstallmentInternal> {
    const ormEntity = this.toOrm(entity);
    const saved = await this.ormRepository.save(ormEntity);
    return this.toDomain(saved);
  }

  async update(
    id: string,
    data: Partial<ClientLoanInstallmentInternal>,
  ): Promise<ClientLoanInstallmentInternal> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({ where: { id } });
    if (!updated) throw new Error('ClientLoanInstallmentInternal not found');
    return this.toDomain(updated);
  }

  async findAll(): Promise<ClientLoanInstallmentInternal[]> {
    const list = await this.ormRepository.find({
      order: { created_at: 'ASC' },
    });
    return list.map((orm) => this.toDomain(orm));
  }

  async findById(id: string): Promise<ClientLoanInstallmentInternal | null> {
    const orm = await this.ormRepository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByNik(nik: number): Promise<ClientLoanInstallmentInternal | null> {
    const orm = await this.ormRepository.findOne({
      where: {
        nik: nik,
        deleted_at: IsNull(),
      },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async callSP_GetAllClientLoanInstallmentInternal(
    searchByClientName: string | null,
    companyName: string | null,
    page: number,
    pageSize: number,
  ): Promise<any[]> {
    return this.ormRepository.query(
      `CALL AdAR_GetAllClientReceivableData(?, ?, ?, ?)`,
      [searchByClientName, companyName, page, pageSize],
    );
  }

  async callSP_AdAR_GetClientDetailByUUID(
    clientId: string,
    loanFrequency: number | null,
  ): Promise<any[]> {
    try {
      const result = await this.ormRepository.query(
        `CALL AdAR_GetClientDetailByUUID(?, ?)`,
        [clientId, loanFrequency ?? null],
      );
      return [
        result[0] ?? [], // header
        result[1] ?? [], // cicilan
      ];
    } catch (error) {
      console.error('Error calling AdAR_GetClientLoanDetail:', error);
      throw error;
    }
  }
}
