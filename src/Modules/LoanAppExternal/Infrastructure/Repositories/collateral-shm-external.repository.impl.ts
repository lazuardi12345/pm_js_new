import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollateralBySHM } from '../../Domain/Entities/collateral-shm-external.entity';
import { ICollateralBySHMRepository } from '../../Domain/Repositories/collateral-shm-external.repository';
import { CollateralBySHM_ORM_Entity } from '../Entities/collateral-shm.orm-entity';
import { LoanApplicationExternal_ORM_Entity } from '../Entities/loan-application-external.orm-entity';

@Injectable()
export class CollateralBySHMRepositoryImpl implements ICollateralBySHMRepository {
  constructor(
    @InjectRepository(CollateralBySHM_ORM_Entity)
    private readonly ormRepository: Repository<CollateralBySHM_ORM_Entity>,
  ) {}

  private toDomain(ormEntity: CollateralBySHM_ORM_Entity): CollateralBySHM {
    return new CollateralBySHM(
      { id: ormEntity.pengajuan?.id }, // pastikan objek pengajuan
      ormEntity.atas_nama_shm ?? undefined,
      ormEntity.hubungan_shm ?? undefined,
      ormEntity.alamat_shm ?? undefined,
      ormEntity.luas_shm ?? undefined,
      ormEntity.njop_shm ?? undefined,
      ormEntity.foto_shm ?? undefined,
      ormEntity.foto_kk_pemilik_shm ?? undefined,
      ormEntity.foto_pbb ?? undefined,
      ormEntity.id ?? undefined,
      ormEntity.created_at ?? undefined,
      ormEntity.updated_at ?? undefined,
      ormEntity.deleted_at ?? null,
    );
  }

  private toOrm(domainEntity: CollateralBySHM): Partial<CollateralBySHM_ORM_Entity> {
    return {
      id: domainEntity.id,
      pengajuan: domainEntity.pengajuan ? { id: domainEntity.pengajuan.id } as LoanApplicationExternal_ORM_Entity : undefined,
      atas_nama_shm: domainEntity.atas_nama_shm,
      hubungan_shm: domainEntity.hubungan_shm,
      alamat_shm: domainEntity.alamat_shm,
      luas_shm: domainEntity.luas_shm,
      njop_shm: domainEntity.njop_shm,
      foto_shm: domainEntity.foto_shm,
      foto_kk_pemilik_shm: domainEntity. foto_kk_pemilik_shm,
      foto_pbb: domainEntity.foto_pbb,
      created_at: domainEntity.created_at,
      updated_at: domainEntity.updated_at,
      deleted_at: domainEntity.deleted_at,
    };
  }

  private toOrmPartial(partial: Partial<CollateralBySHM>): Partial<CollateralBySHM_ORM_Entity> {
    const ormData: Partial<CollateralBySHM_ORM_Entity> = {};

    if (partial.pengajuan?.id !== undefined) {
      ormData.pengajuan = { id: partial.pengajuan.id } as LoanApplicationExternal_ORM_Entity;
    }
    if (partial.atas_nama_shm !== undefined) ormData.atas_nama_shm = partial.atas_nama_shm;
    if (partial.hubungan_shm !== undefined) ormData.hubungan_shm = partial.hubungan_shm;
    if (partial.alamat_shm !== undefined) ormData.alamat_shm = partial.alamat_shm;
    if (partial.luas_shm !== undefined) ormData.luas_shm = partial.luas_shm;
    if (partial.njop_shm !== undefined) ormData.njop_shm = partial.njop_shm;
    if (partial.foto_shm !== undefined) ormData.foto_shm = partial.foto_shm;
    if (partial.foto_kk_pemilik_shm !== undefined) ormData.foto_kk_pemilik_shm = partial.foto_kk_pemilik_shm;
    if (partial.foto_pbb !== undefined) ormData.foto_pbb = partial.foto_pbb;
    if (partial.created_at !== undefined) ormData.created_at = partial.created_at;
    if (partial.updated_at !== undefined) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at !== undefined) ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  async findById(id: number): Promise<CollateralBySHM | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuan'],
    });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByPengajuanLuarId(pengajuanId: number): Promise<CollateralBySHM[]> {
    const ormEntities = await this.ormRepository.find({
      where: { pengajuan: { id: pengajuanId } },
      relations: ['pengajuan'],
    });
    return ormEntities.map((e) => this.toDomain(e));
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

  async update(id: number, data: Partial<CollateralBySHM>): Promise<CollateralBySHM> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuan'],
    });
    if (!updated) throw new NotFoundException(`CollateralBySHM with ID ${id} not found`);
    return this.toDomain(updated);
  }

   async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
