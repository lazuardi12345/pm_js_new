// Infrastructure/Repositories/client-loan-installment.repository.impl.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ClientLoanInstallment } from '../../Domain/Entities/client_loan_installment.entity';
import { IClientLoanInstallmentRepository } from '../../Domain/Repositories/client_loan_installment.repository';
import { ClientLoanInstallment_ORM_Entity } from '../Entities/client_loan_installment.orm-entity';
import { InstallmentStatus } from 'src/Shared/Enums/Admins/Account-Receivable/InstallmentStatus';

@Injectable()
export class ClientLoanInstallmentRepositoryImpl
  implements IClientLoanInstallmentRepository
{
  constructor(
    @InjectRepository(ClientLoanInstallment_ORM_Entity)
    private readonly ormRepository: Repository<ClientLoanInstallment_ORM_Entity>,
  ) {}

  //? MAPPER >==========================================================================

  private toDomain(
    orm: ClientLoanInstallment_ORM_Entity,
  ): ClientLoanInstallment {
    return new ClientLoanInstallment(
      orm.frequency_number,
      orm.nomor_kontrak,
      orm.description,
      orm.amount_due,
      orm.status,
      orm.metadata,
      orm.id,
      orm.frequency_id,
      orm.created_at,
      orm.updated_at,
      orm.deleted_at,
    );
  }

  private toOrm(
    domain: ClientLoanInstallment,
  ): Partial<ClientLoanInstallment_ORM_Entity> {
    return {
      id: domain?.id,
      frequency_number: domain.frequency_number,
      nomor_kontrak: domain.nomor_kontrak, // ← tambah ini
      description: domain.description,
      amount_due: domain.amount_due,
      status: domain.status,
      metadata: domain?.metadata,
      frequency_id: domain.frequency_id,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  private toOrmPartial(
    partial: Partial<ClientLoanInstallment>,
  ): Partial<ClientLoanInstallment_ORM_Entity> {
    const ormData: Partial<ClientLoanInstallment_ORM_Entity> = {};

    if (partial.frequency_number)
      ormData.frequency_number = partial.frequency_number;
    if (partial.nomor_kontrak) ormData.nomor_kontrak = partial.nomor_kontrak;
    if (partial.description) ormData.description = partial.description;
    if (partial.amount_due) ormData.amount_due = partial.amount_due;
    if (partial.status) ormData.status = partial.status;
    if (partial.metadata) ormData.metadata = partial.metadata;
    if (partial.frequency_id) ormData.frequency_id = partial.frequency_id;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at) ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  //?===================================================================================

  async create(entity: ClientLoanInstallment): Promise<ClientLoanInstallment> {
    const ormEntity = this.toOrm(entity);
    const saved = await this.ormRepository.save(ormEntity);
    return this.toDomain(saved);
  }

  async update(
    id: string,
    data: Partial<ClientLoanInstallment>,
  ): Promise<ClientLoanInstallment> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({ where: { id } });
    if (!updated) throw new Error('ClientLoanInstallment not found');
    return this.toDomain(updated);
  }

  async findAll(): Promise<ClientLoanInstallment[]> {
    const list = await this.ormRepository.find({
      order: { frequency_number: 'ASC' },
    });
    return list.map((orm) => this.toDomain(orm));
  }

  async findById(id: string): Promise<ClientLoanInstallment | null> {
    const orm = await this.ormRepository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByFrequencyId(
    frequency_id: string,
  ): Promise<ClientLoanInstallment[]> {
    const list = await this.ormRepository.find({
      where: { frequency_id },
      order: { frequency_number: 'ASC' },
    });
    return list.map((orm) => this.toDomain(orm));
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async findByFrequencyIdFromNumber(
    frequency_id: string,
    from_frequency_number: number,
  ): Promise<
    { id: string; frequency_number: number; status: InstallmentStatus }[]
  > {
    const list = await this.ormRepository.find({
      select: ['id', 'frequency_number', 'status'],
      where: { frequency_id, deleted_at: IsNull() },
      order: { frequency_number: 'ASC' },
    });
    return list.filter(
      (inst) => inst.frequency_number >= from_frequency_number,
    );
  }

  async bulkUpdateStatusByIds(
    ids: string[],
    status: InstallmentStatus,
  ): Promise<void> {
    if (!ids.length) return;
    await this.ormRepository
      .createQueryBuilder()
      .update()
      .set({ status })
      .whereInIds(ids)
      .execute();
  }

  async callSP_AdAR_GetClientInstallmentDetailByUUID(
    installmentId: string,
    frequencyId: string,
  ): Promise<any[]> {
    try {
      const result = await this.ormRepository.query(
        `CALL AdAR_GetClientInstallmentDetailByUUID(?, ?)`,
        [installmentId, frequencyId],
      );
      return [
        result[0] ?? [], // OUT 1: detail cicilan
        result[1] ?? [], // OUT 2: log pembayaran
      ];
    } catch (error) {
      console.error(
        'Error calling AdAR_GetClientInstallmentDetailByUUID:',
        error,
      );
      throw error;
    }
  }
}
