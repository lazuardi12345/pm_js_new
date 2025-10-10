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
      ormEntity.pengajuan.id,
      ormEntity.saldo_bpjs,
      ormEntity.tanggal_bayar_terakhir,
      ormEntity.username,
      ormEntity.password,
      ormEntity.foto_bpjs,
      ormEntity.foto_jaminan_tambahan,
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
      pengajuan: {
        id: domainEntity.pengajuanId,
      } as LoanApplicationExternal_ORM_Entity,
      saldo_bpjs: domainEntity.saldoBpjs,
      tanggal_bayar_terakhir: domainEntity.tanggalBayarTerakhir,
      username: domainEntity.username,
      password: domainEntity.password,
      foto_bpjs: domainEntity.fotoBpjs,
      foto_jaminan_tambahan: domainEntity.fotoJaminanTambahan,
      created_at: domainEntity.createdAt,
      updated_at: domainEntity.updatedAt,
      deleted_at: domainEntity.deletedAt,
    };
  }

  private toOrmPartial(
    partial: Partial<CollateralByBPJS>,
  ): Partial<CollateralByBPJS_ORM_Entity> {
    const ormData: Partial<CollateralByBPJS_ORM_Entity> = {};

    if (partial.pengajuanId)
      ormData.pengajuan = {
        id: partial.pengajuanId,
      } as LoanApplicationExternal_ORM_Entity;
    if (partial.saldoBpjs !== undefined) ormData.saldo_bpjs = partial.saldoBpjs;
    if (partial.tanggalBayarTerakhir)
      ormData.tanggal_bayar_terakhir = partial.tanggalBayarTerakhir;
    if (partial.username) ormData.username = partial.username;
    if (partial.password) ormData.password = partial.password;
    if (partial.fotoBpjs) ormData.foto_bpjs = partial.fotoBpjs;
    if (partial.fotoJaminanTambahan)
      ormData.foto_jaminan_tambahan = partial.fotoJaminanTambahan;
    if (partial.createdAt) ormData.created_at = partial.createdAt;
    if (partial.updatedAt) ormData.updated_at = partial.updatedAt;
    if (partial.deletedAt) ormData.deleted_at = partial.deletedAt;

    return ormData;
  }

  async findById(id: number): Promise<CollateralByBPJS | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuan'],
    });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByPengajuanLuarId(
    pengajuanId: number,
  ): Promise<CollateralByBPJS[]> {
    const ormEntities = await this.ormRepository.find({
      where: { pengajuan: { id: pengajuanId } },
      relations: ['pengajuan'],
    });

    return ormEntities.map((entity) => this.toDomain(entity));
  }

  async findAll(): Promise<CollateralByBPJS[]> {
    const ormEntities = await this.ormRepository.find({
      relations: ['pengajuan'],
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
      relations: ['pengajuan'],
    });
    if (!updated) throw new Error('CollateralByBPJS not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
