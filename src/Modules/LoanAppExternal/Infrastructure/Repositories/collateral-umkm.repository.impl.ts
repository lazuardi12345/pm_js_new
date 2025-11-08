import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollateralByUMKM } from '../../Domain/Entities/collateral-umkm.entity';
import { ICollateralByUMKMRepository } from '../../Domain/Repositories/collateral-umkm.repository';
import { CollateralUMKM_ORM_Entity } from '../Entities/collateral-umkm.orm.entity';
import { LoanApplicationExternal_ORM_Entity } from '../Entities/loan-application-external.orm-entity';

@Injectable()
export class CollateralUMKMRepositoryImpl implements ICollateralByUMKMRepository {
  constructor(
    @InjectRepository(CollateralUMKM_ORM_Entity)
    private readonly ormRepository: Repository<CollateralUMKM_ORM_Entity>,
  ) {}

  // ========================== MAPPER: ORM → DOMAIN ==========================
  private toDomain(orm: CollateralUMKM_ORM_Entity): CollateralByUMKM {
    return new CollateralByUMKM(
      { id: orm.pengajuan?.id },
      orm.foto_sku,
      orm.foto_usaha,
      orm.foto_pembukuan,
      orm.id,
      orm.created_at,
      orm.updated_at,
      orm.deleted_at,
    );
  }

  // ========================== MAPPER: DOMAIN → ORM ==========================
  private toORM(domain: CollateralByUMKM): CollateralUMKM_ORM_Entity {
    const orm = new CollateralUMKM_ORM_Entity();
    orm.pengajuan = { id: domain.pengajuan?.id } as LoanApplicationExternal_ORM_Entity;
    orm.foto_sku = domain.foto_sku;
    orm.foto_usaha = domain.foto_usaha;
    orm.foto_pembukuan = domain.foto_pembukuan;

    // ✅ Pastikan fallback date agar tidak undefined
    orm.created_at = domain.created_at ?? new Date();
    orm.updated_at = domain.updated_at ?? new Date();
    orm.deleted_at = domain.deleted_at ?? null;

    return orm;
  }

  // ========================== MAPPER: PARTIAL UPDATE ==========================
  private toOrmPartial(partial: Partial<CollateralByUMKM>): Partial<CollateralUMKM_ORM_Entity> {
    const orm: Partial<CollateralUMKM_ORM_Entity> = {};

    if (partial.pengajuan?.id) {
      orm.pengajuan = { id: partial.pengajuan.id } as LoanApplicationExternal_ORM_Entity;
    }

    if (partial.foto_sku !== undefined) orm.foto_sku = partial.foto_sku;
    if (partial.foto_usaha !== undefined) orm.foto_usaha = partial.foto_usaha;
    if (partial.foto_pembukuan !== undefined) orm.foto_pembukuan = partial.foto_pembukuan;

    if (partial.created_at !== undefined) orm.created_at = partial.created_at ?? new Date();
    if (partial.updated_at !== undefined) orm.updated_at = partial.updated_at ?? new Date();
    if (partial.deleted_at !== undefined) orm.deleted_at = partial.deleted_at ?? null;

    return orm;
  }

  // ========================== CRUD METHODS ==========================

  async findById(id: number): Promise<CollateralByUMKM | null> {
    const orm = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuan'],
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findByPengajuanId(pengajuanId: number): Promise<CollateralByUMKM[]> {
    const ormList = await this.ormRepository.find({
      where: { pengajuan: { id: pengajuanId } },
      relations: ['pengajuan'],
    });
    return ormList.map((e) => this.toDomain(e));
  }

  async findAll(): Promise<CollateralByUMKM[]> {
    const ormList = await this.ormRepository.find({ relations: ['pengajuan'] });
    return ormList.map((e) => this.toDomain(e));
  }

  async save(data: CollateralByUMKM): Promise<CollateralByUMKM> {
    const ormEntity = this.toORM(data);
    const saved = await this.ormRepository.save(ormEntity);
    return this.toDomain(saved as CollateralUMKM_ORM_Entity);
  }

  async update(id: number, data: Partial<CollateralByUMKM>): Promise<CollateralByUMKM> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuan'],
    });
    if (!updated) throw new NotFoundException(`CollateralByUMKM with ID ${id} not found`);
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
