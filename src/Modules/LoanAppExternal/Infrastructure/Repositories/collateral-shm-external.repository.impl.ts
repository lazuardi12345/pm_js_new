// Infrastructure/Repositories/collateral-shm.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollateralBySHM } from '../../Domain/Entities/collateral-shm-external.entity';
import { ICollateralBySHMRepository } from '../../Domain/Repositories/collateral-shm-external.repository';
import { CollateralBySHM_ORM_Entity } from '../Entities/collateral-shm.orm-entity';
import { LoanApplicationExternal_ORM_Entity } from '../Entities/loan-application-external.orm-entity';

@Injectable()
export class CollateralBySHMRepositoryImpl
  implements ICollateralBySHMRepository
{
  constructor(
    @InjectRepository(CollateralBySHM_ORM_Entity)
    private readonly ormRepository: Repository<CollateralBySHM_ORM_Entity>,
  ) {}

  private toDomain(ormEntity: CollateralBySHM_ORM_Entity): CollateralBySHM {
    return new CollateralBySHM(
      ormEntity.pengajuan.id,
      ormEntity.atas_nama_shm,
      ormEntity.hubungan_shm,
      ormEntity.alamat_shm,
      ormEntity.luas_shm,
      ormEntity.njop_shm,
      ormEntity.foto_shm,
      ormEntity.foto_kk_pemilik_shm,
      ormEntity.foto_pbb,
      ormEntity.id,
      ormEntity.created_at,
      ormEntity.updated_at,
      ormEntity.deleted_at,
    );
  }

  private toOrm(domainEntity: CollateralBySHM): Partial<CollateralBySHM_ORM_Entity> {
    return {
      id: domainEntity.id,
      pengajuan: { id: domainEntity.pengajuanId } as LoanApplicationExternal_ORM_Entity,
      atas_nama_shm: domainEntity.atasNamaShm,
      hubungan_shm: domainEntity.hubunganShm,
      alamat_shm: domainEntity.alamatShm,
      luas_shm: domainEntity.luasShm,
      njop_shm: domainEntity.njopShm,
      foto_shm: domainEntity.fotoShm,
      foto_kk_pemilik_shm: domainEntity.fotoKkPemilikShm,
      foto_pbb: domainEntity.fotoPbb,
      created_at: domainEntity.createdAt,
      updated_at: domainEntity.updatedAt,
      deleted_at: domainEntity.deletedAt,
    };
  }

  private toOrmPartial(
    partial: Partial<CollateralBySHM>,
  ): Partial<CollateralBySHM_ORM_Entity> {
    const ormData: Partial<CollateralBySHM_ORM_Entity> = {};

    if (partial.pengajuanId)
      ormData.pengajuan = { id: partial.pengajuanId } as LoanApplicationExternal_ORM_Entity;
    if (partial.atasNamaShm) ormData.atas_nama_shm = partial.atasNamaShm;
    if (partial.hubunganShm) ormData.hubungan_shm = partial.hubunganShm;
    if (partial.alamatShm) ormData.alamat_shm = partial.alamatShm;
    if (partial.luasShm) ormData.luas_shm = partial.luasShm;
    if (partial.njopShm) ormData.njop_shm = partial.njopShm;
    if (partial.fotoShm) ormData.foto_shm = partial.fotoShm;
    if (partial.fotoKkPemilikShm) ormData.foto_kk_pemilik_shm = partial.fotoKkPemilikShm;
    if (partial.fotoPbb) ormData.foto_pbb = partial.fotoPbb;
    if (partial.createdAt) ormData.created_at = partial.createdAt;
    if (partial.updatedAt) ormData.updated_at = partial.updatedAt;
    if (partial.deletedAt) ormData.deleted_at = partial.deletedAt;

    return ormData;
  }

  async findById(id: number): Promise<CollateralBySHM | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuan'],
    });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByPengajuanLuarId(
    pengajuanId: number,
  ): Promise<CollateralBySHM[]> {
    const ormEntities = await this.ormRepository.find({
      where: { pengajuan: { id: pengajuanId } },
      relations: ['pengajuan'],
    });

    return ormEntities.map((entity) => this.toDomain(entity));
  }

  async findAll(): Promise<CollateralBySHM[]> {
    const ormEntities = await this.ormRepository.find({
      relations: ['pengajuan'],
    });
    return ormEntities.map((e) => this.toDomain(e));
  }

  async save(collateral: CollateralBySHM): Promise<CollateralBySHM> {
    const ormEntity = this.toOrm(collateral);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm as CollateralBySHM_ORM_Entity);
  }

  async update(
    id: number,
    data: Partial<CollateralBySHM>,
  ): Promise<CollateralBySHM> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuan'],
    });
    if (!updated) throw new Error('CollateralBySHM not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
