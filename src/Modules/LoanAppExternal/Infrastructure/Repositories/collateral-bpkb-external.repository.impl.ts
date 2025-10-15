import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollateralByBPKB } from '../../Domain/Entities/collateral-bpkb-external.entity';
import { CollateralByBPKB_ORM_Entity } from '../Entities/collateral-bpkb.orm-entity';
import { LoanApplicationExternal_ORM_Entity } from '../Entities/loan-application-external.orm-entity';
import { ICollateralByBPKBRepository } from '../../Domain/Repositories/collateral-bpkb-external.repository';

@Injectable()
export class CollateralByBPKBRepositoryImpl implements ICollateralByBPKBRepository {
  constructor(
    @InjectRepository(CollateralByBPKB_ORM_Entity)
    private readonly ormRepository: Repository<CollateralByBPKB_ORM_Entity>,
  ) {}

  private toDomain(ormEntity: CollateralByBPKB_ORM_Entity): CollateralByBPKB {
    return new CollateralByBPKB(
      { id: ormEntity.pengajuan?.id },
      ormEntity.atas_nama_bpkb ?? undefined,
      ormEntity.no_stnk ?? undefined,
      ormEntity.alamat_pemilik_bpkb ?? undefined,
      ormEntity.type_kendaraan ?? undefined,
      ormEntity.tahun_perakitan ?? undefined,
      ormEntity.warna_kendaraan ?? undefined,
      ormEntity.stransmisi ?? undefined,
      ormEntity.no_rangka ?? undefined,
      ormEntity.no_mesin ?? undefined,
      ormEntity.no_bpkb ?? undefined,
      ormEntity.foto_stnk ?? undefined,
      ormEntity.foto_bpkb ?? undefined,
      ormEntity.foto_motor ?? undefined,
      ormEntity.id ?? undefined,
      ormEntity.created_at ?? undefined,
      ormEntity.updated_at ?? undefined,
      ormEntity.deleted_at ?? null,
    );
  }

  private toOrm(domain: CollateralByBPKB): Partial<CollateralByBPKB_ORM_Entity> {
    return {
      id: domain.id,
      pengajuan: domain.pengajuan ? { id: domain.pengajuan.id } as LoanApplicationExternal_ORM_Entity : undefined,
      atas_nama_bpkb: domain.atas_nama_bpkb,
      no_stnk: domain.no_stnk,
      alamat_pemilik_bpkb: domain.alamat_pemilik_bpkb,
      type_kendaraan: domain.type_kendaraan,
      tahun_perakitan: domain.tahun_perakitan,
      warna_kendaraan: domain.warna_kendaraan,
      stransmisi: domain.stransmisi,
      no_rangka: domain.no_rangka,
      no_mesin: domain.no_mesin,
      no_bpkb: domain.no_bpkb,
      foto_stnk: domain.foto_stnk,
      foto_bpkb: domain.foto_bpkb,
      foto_motor: domain.foto_motor,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  private toOrmPartial(
    partial: Partial<CollateralByBPKB>,
  ): Partial<CollateralByBPKB_ORM_Entity> {
    const ormData: Partial<CollateralByBPKB_ORM_Entity> = {};

    if (partial.pengajuan?.id !== undefined) {
      ormData.pengajuan = { id: partial.pengajuan.id } as LoanApplicationExternal_ORM_Entity;
    }
    if (partial.atas_nama_bpkb !== undefined) ormData.atas_nama_bpkb = partial.atas_nama_bpkb;
    if (partial.no_stnk !== undefined) ormData.no_stnk = partial.no_stnk;
    if (partial.alamat_pemilik_bpkb !== undefined) ormData.alamat_pemilik_bpkb = partial.alamat_pemilik_bpkb;
    if (partial.type_kendaraan !== undefined) ormData.type_kendaraan = partial.type_kendaraan;
    if (partial.tahun_perakitan !== undefined) ormData.tahun_perakitan = partial.tahun_perakitan;
    if (partial.warna_kendaraan !== undefined) ormData.warna_kendaraan = partial.warna_kendaraan;
    if (partial.stransmisi !== undefined) ormData.stransmisi = partial.stransmisi;
    if (partial.no_rangka !== undefined) ormData.no_rangka = partial.no_rangka;
    if (partial.no_mesin !== undefined) ormData.no_mesin = partial.no_mesin;
    if (partial.no_bpkb !== undefined) ormData.no_bpkb = partial.no_bpkb;
    if (partial.foto_stnk !== undefined) ormData.foto_stnk = partial.foto_stnk;
    if (partial.foto_bpkb !== undefined) ormData.foto_bpkb = partial.foto_bpkb;
    if (partial.foto_motor !== undefined) ormData.foto_motor = partial.foto_motor;
    if (partial.created_at !== undefined) ormData.created_at = partial.created_at;
    if (partial.updated_at !== undefined) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at !== undefined) ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  async findById(id: number): Promise<CollateralByBPKB | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuan'],
    });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByPengajuanLuarId(pengajuanId: number): Promise<CollateralByBPKB[]> {
    const ormEntities = await this.ormRepository.find({
      where: { pengajuan: { id: pengajuanId } },
      relations: ['pengajuan'],
    });
    return ormEntities.map((entity) => this.toDomain(entity));
  }

  async findAll(): Promise<CollateralByBPKB[]> {
    const ormEntities = await this.ormRepository.find({
      relations: ['pengajuan'],
    });
    return ormEntities.map((entity) => this.toDomain(entity));
  }

  async save(collateral: CollateralByBPKB): Promise<CollateralByBPKB> {
    const ormEntity = this.toOrm(collateral);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm as CollateralByBPKB_ORM_Entity);
  }

  async update(id: number, data: Partial<CollateralByBPKB>): Promise<CollateralByBPKB> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuan'],
    });
    if (!updated) throw new NotFoundException(`CollateralByBPKB with ID ${id} not found`);
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
