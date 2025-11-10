import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollateralByBPJS } from '../../Domain/Entities/collateral-bpjs-external.entity';
import { ICollateralByBPJSRepository } from '../../Domain/Repositories/collateral-bpjs-external.repository';
import { CollateralByBPJS_ORM_Entity } from '../Entities/collateral-bpjs.orm-entity';
import { LoanApplicationExternal_ORM_Entity } from '../Entities/loan-application-external.orm-entity';

@Injectable()
export class CollateralByBPJSRepositoryImpl
  implements ICollateralByBPJSRepository
{
  constructor(
    @InjectRepository(CollateralByBPJS_ORM_Entity)
    private readonly ormRepository: Repository<CollateralByBPJS_ORM_Entity>,
  ) {}

  private toDomain(ormEntity: CollateralByBPJS_ORM_Entity): CollateralByBPJS {
    return new CollateralByBPJS(
      { id: ormEntity.pengajuanLuar.id },
      ormEntity.saldo_bpjs,
      ormEntity.tanggal_bayar_terakhir,
      ormEntity.username,
      ormEntity.password,
      ormEntity.foto_bpjs,
      ormEntity.jaminan_tambahan,
      ormEntity.id,
      ormEntity.created_at,
      ormEntity.updated_at,
      ormEntity.deleted_at,
    );
  }

  private toOrm(
    domainEntity: CollateralByBPJS,
  ): Partial<CollateralByBPJS_ORM_Entity> {
    return {
      id: domainEntity.id,
      pengajuanLuar: {
        id: domainEntity.pengajuan.id,
      } as LoanApplicationExternal_ORM_Entity,
      saldo_bpjs: domainEntity.saldo_bpjs,
      tanggal_bayar_terakhir: domainEntity.tanggal_bayar_terakhir,
      username: domainEntity.username,
      password: domainEntity.password,
      foto_bpjs: domainEntity.foto_bpjs,
      jaminan_tambahan: domainEntity.jaminan_tambahan,
      created_at: domainEntity.created_at,
      updated_at: domainEntity.updated_at,
      deleted_at: domainEntity.deleted_at,
    };
  }

  private toOrmPartial(
    partial: Partial<CollateralByBPJS>,
  ): Partial<CollateralByBPJS_ORM_Entity> {
    const ormData: Partial<CollateralByBPJS_ORM_Entity> = {};

    if (partial.pengajuan)
      ormData.pengajuanLuar = {
        id: partial.pengajuan.id,
      } as LoanApplicationExternal_ORM_Entity;
    if (partial.saldo_bpjs !== undefined)
      ormData.saldo_bpjs = partial.saldo_bpjs;
    if (partial.tanggal_bayar_terakhir)
      ormData.tanggal_bayar_terakhir = partial.tanggal_bayar_terakhir;
    if (partial.username) ormData.username = partial.username;
    if (partial.password) ormData.password = partial.password;
    if (partial.foto_bpjs) ormData.foto_bpjs = partial.foto_bpjs;
    if (partial.jaminan_tambahan)
      ormData.jaminan_tambahan = partial.jaminan_tambahan;
    if (partial.created_at) ormData.created_at = partial.created_at;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at) ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  async findById(id: number): Promise<CollateralByBPJS | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuanLuar'],
    });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByPengajuanLuarId(
    pengajuanId: number,
  ): Promise<CollateralByBPJS[]> {
    const ormEntities = await this.ormRepository.find({
      where: { pengajuanLuar: { id: pengajuanId } },
      relations: ['pengajuanLuar'],
    });

    return ormEntities.map((entity) => this.toDomain(entity));
  }

  async findAll(): Promise<CollateralByBPJS[]> {
    const ormEntities = await this.ormRepository.find({
      relations: ['pengajuanLuar'],
    });
    return ormEntities.map((e) => this.toDomain(e));
  }

  async save(collateral: CollateralByBPJS): Promise<CollateralByBPJS> {
    const ormEntity = this.toOrm(collateral);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm as CollateralByBPJS_ORM_Entity);
  }

  async update(
    id: number,
    data: Partial<CollateralByBPJS>,
  ): Promise<CollateralByBPJS> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuanLuar'],
    });
    if (!updated) throw new Error('CollateralByBPJS not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
