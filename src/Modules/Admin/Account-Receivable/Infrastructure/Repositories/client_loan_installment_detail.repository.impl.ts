// Infrastructure/Repositories/client-loan-installment-detail.repository.impl.ts

import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ClientLoanInstallmentDetail } from '../../Domain/Entities/client_loan_installment_detail.entity';
import { IClientLoanInstallmentDetailRepository } from '../../Domain/Repositories/client_loan_installment_detail.repository';
import { ClientLoanInstallmentDetail_ORM_Entity } from '../Entities/client_loan_installment_detail.orm-entity';
import { ClientLoanInstallment_ORM_Entity } from '../Entities/client_loan_installment.orm-entity';
import { InstallmentStatus } from 'src/Shared/Enums/Admins/Account-Receivable/InstallmentStatus';

@Injectable()
export class ClientLoanInstallmentDetailRepositoryImpl
  implements IClientLoanInstallmentDetailRepository
{
  constructor(
    @InjectRepository(ClientLoanInstallmentDetail_ORM_Entity)
    private readonly ormRepository: Repository<ClientLoanInstallmentDetail_ORM_Entity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  //? MAPPER >==========================================================================

  private toDomain(
    orm: ClientLoanInstallmentDetail_ORM_Entity,
  ): ClientLoanInstallmentDetail {
    return new ClientLoanInstallmentDetail(
      orm.amount_paid,
      orm.pay_date,
      orm.pay_description,
      orm.id,
      orm.installment_id,
      orm.created_at,
      orm.updated_at,
      orm.deleted_at,
    );
  }

  private toOrm(
    domain: ClientLoanInstallmentDetail,
  ): Partial<ClientLoanInstallmentDetail_ORM_Entity> {
    return {
      id: domain?.id,
      amount_paid: domain.amount_paid,
      pay_date: domain.pay_date,
      pay_description: domain.pay_description,
      installment_id: domain.installment_id,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  private toOrmPartial(
    partial: Partial<ClientLoanInstallmentDetail>,
  ): Partial<ClientLoanInstallmentDetail_ORM_Entity> {
    const ormData: Partial<ClientLoanInstallmentDetail_ORM_Entity> = {};

    if (partial.amount_paid) ormData.amount_paid = partial.amount_paid;
    if (partial.pay_date) ormData.pay_date = partial.pay_date;
    if (partial.pay_description)
      ormData.pay_description = partial.pay_description;
    if (partial.installment_id) ormData.installment_id = partial.installment_id;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at) ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  //?===================================================================================

  async create(
    entity: ClientLoanInstallmentDetail,
  ): Promise<ClientLoanInstallmentDetail> {
    const ormEntity = this.toOrm(entity);
    const saved = await this.ormRepository.save(ormEntity);
    return this.toDomain(saved);
  }

  async update(
    id: string,
    data: Partial<ClientLoanInstallmentDetail>,
  ): Promise<ClientLoanInstallmentDetail> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({ where: { id } });
    if (!updated) throw new Error('ClientLoanInstallmentDetail not found');
    return this.toDomain(updated);
  }

  async findAll(): Promise<ClientLoanInstallmentDetail[]> {
    const list = await this.ormRepository.find({
      order: { created_at: 'ASC' },
    });
    return list.map((orm) => this.toDomain(orm));
  }

  async findById(id: string): Promise<ClientLoanInstallmentDetail | null> {
    const orm = await this.ormRepository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByInstallmentId(
    installment_id: string,
  ): Promise<ClientLoanInstallmentDetail[]> {
    const list = await this.ormRepository.find({
      where: { installment_id },
      order: { pay_date: 'ASC' },
    });
    return list.map((orm) => this.toDomain(orm));
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async createPayment(
    installmentId: string,
    amountPaid: number,
    payDate: string,
    payDescription: string | null,
  ): Promise<ClientLoanInstallmentDetail> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const detail = queryRunner.manager.create(
        ClientLoanInstallmentDetail_ORM_Entity,
        {
          installment_id: installmentId,
          amount_paid: amountPaid,
          pay_date: new Date(payDate),
          pay_description: payDescription ?? undefined,
        },
      );
      const saved = await queryRunner.manager.save(
        ClientLoanInstallmentDetail_ORM_Entity,
        detail,
      );

      const { total_paid } = await queryRunner.manager
        .createQueryBuilder(ClientLoanInstallmentDetail_ORM_Entity, 'det')
        .select('SUM(det.amount_paid)', 'total_paid')
        .where('det.installment_id = :id', { id: installmentId })
        .andWhere('det.deleted_at IS NULL')
        .getRawOne();

      const installment = await queryRunner.manager
        .createQueryBuilder(ClientLoanInstallment_ORM_Entity, 'inst')
        .leftJoinAndSelect('inst.frequency', 'freq')
        .leftJoinAndSelect('freq.client', 'client')
        .where('inst.id = :id', { id: installmentId })
        .getOne();

      if (!installment) throw new Error('Installment tidak ditemukan');

      const payType = installment.frequency?.pay_type;
      const companyName = installment.frequency?.client?.company_name;

      const newMetadata = {
        ...(installment.metadata ?? {}),
        pay_type: payType,
        company_name: companyName,
      };

      const { payment_count } = await queryRunner.manager
        .createQueryBuilder(ClientLoanInstallmentDetail_ORM_Entity, 'det')
        .select('COUNT(det.id)', 'payment_count')
        .where('det.installment_id = :id', { id: installmentId })
        .andWhere('det.deleted_at IS NULL')
        .getRawOne();

      const totalPaid = Number(total_paid ?? 0);
      const amountDue = Number(installment.amount_due);
      const paymentCount = Number(payment_count ?? 0);

      let newStatus: InstallmentStatus;

      if (totalPaid >= amountDue && paymentCount === 1) {
        newStatus = InstallmentStatus.PAID_FULL;
      } else if (totalPaid >= amountDue && paymentCount > 1) {
        newStatus = InstallmentStatus.PAID_INST;
      } else if (totalPaid > 0 && totalPaid < amountDue) {
        newStatus = InstallmentStatus.PARTIALLY_PAID;
      } else {
        newStatus = InstallmentStatus.UNPAID;
      }

      await queryRunner.manager.update(
        ClientLoanInstallment_ORM_Entity,
        { id: installmentId },
        {
          status: newStatus,
          metadata: newMetadata,
        },
      );

      await queryRunner.commitTransaction();
      return this.toDomain(saved);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('createPayment ERROR:', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
