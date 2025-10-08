// Infrastructure/Repositories/collateral-kedinasan.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollateralByKedinasan } from '../../Domain/Entities/collateral-kedinasan-external.entity';
import { ICollateralByKedinasanRepository } from '../../Domain/Repositories/collateral-kedinasan-external.repository';
import { CollateralByKedinasan_ORM_Entity } from '../Entities/collateral-kedinasan.orm-entity';
import { LoanApplicationExternal_ORM_Entity } from '../Entities/loan-application-external.orm-entity';

@Injectable()
export class CollateralByKedinasanRepositoryImpl
  implements ICollateralByKedinasanRepository
{
  constructor(
    @InjectRepository(CollateralByKedinasan_ORM_Entity)
    private readonly ormRepository: Repository<CollateralByKedinasan_ORM_Entity>,
  ) {}

  private toDomain(ormEntity: CollateralByKedinasan_ORM_Entity): CollateralByKedinasan {
    return new CollateralByKedinasan(
      ormEntity.pengajuan.id,
      ormEntity.instansi,
      ormEntity.surat_permohonan_kredit,
      ormEntity.surat_pernyataan_penjamin,
      ormEntity.surat_persetujuan_pimpinan,
      ormEntity.surat_keterangan_gaji,
      ormEntity.id,
      ormEntity.created_at,
      ormEntity.updated_at,
      ormEntity.deleted_at,
    );
  }

  private toOrm(
    domainEntity: CollateralByKedinasan,
  ): Partial<CollateralByKedinasan_ORM_Entity> {
    return {
      id: domainEntity.id,
      pengajuan: {
        id: domainEntity.pengajuanId,
      } as LoanApplicationExternal_ORM_Entity,
      instansi: domainEntity.instansi,
      surat_permohonan_kredit: domainEntity.suratPermohonanKredit,
      surat_pernyataan_penjamin: domainEntity.suratPernyataanPenjamin,
      surat_persetujuan_pimpinan: domainEntity.suratPersetujuanPimpinan,
      surat_keterangan_gaji: domainEntity.suratKeteranganGaji,
      created_at: domainEntity.createdAt,
      updated_at: domainEntity.updatedAt,
      deleted_at: domainEntity.deletedAt,
    };
  }

  private toOrmPartial(
    partial: Partial<CollateralByKedinasan>,
  ): Partial<CollateralByKedinasan_ORM_Entity> {
    const ormData: Partial<CollateralByKedinasan_ORM_Entity> = {};

    if (partial.pengajuanId)
      ormData.pengajuan = {
        id: partial.pengajuanId,
      } as LoanApplicationExternal_ORM_Entity;
    if (partial.instansi) ormData.instansi = partial.instansi;
    if (partial.suratPermohonanKredit)
      ormData.surat_permohonan_kredit = partial.suratPermohonanKredit;
    if (partial.suratPernyataanPenjamin)
      ormData.surat_pernyataan_penjamin = partial.suratPernyataanPenjamin;
    if (partial.suratPersetujuanPimpinan)
      ormData.surat_persetujuan_pimpinan = partial.suratPersetujuanPimpinan;
    if (partial.suratKeteranganGaji)
      ormData.surat_keterangan_gaji = partial.suratKeteranganGaji;
    if (partial.createdAt) ormData.created_at = partial.createdAt;
    if (partial.updatedAt) ormData.updated_at = partial.updatedAt;
    if (partial.deletedAt) ormData.deleted_at = partial.deletedAt;

    return ormData;
  }

  async findById(id: number): Promise<CollateralByKedinasan | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuan'],
    });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByPengajuanLuarId(
    pengajuanId: number,
  ): Promise<CollateralByKedinasan[]> {
    const ormEntities = await this.ormRepository.find({
      where: { pengajuan: { id: pengajuanId } },
      relations: ['pengajuan'],
    });

    return ormEntities.map((entity) => this.toDomain(entity));
  }

  async findAll(): Promise<CollateralByKedinasan[]> {
    const ormEntities = await this.ormRepository.find({
      relations: ['pengajuan'],
    });
    return ormEntities.map((e) => this.toDomain(e));
  }

  async save(collateral: CollateralByKedinasan): Promise<CollateralByKedinasan> {
    const ormEntity = this.toOrm(collateral);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm as CollateralByKedinasan_ORM_Entity);
  }

  async update(
    id: number,
    data: Partial<CollateralByKedinasan>,
  ): Promise<CollateralByKedinasan> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuan'],
    });
    if (!updated) throw new Error('CollateralByKedinasan not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
