import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollateralByKedinasan } from '../../Domain/Entities/collateral-kedinasan-external.entity';
import { CollateralByKedinasan_ORM_Entity } from '../Entities/collateral-kedinasan.orm-entity';
import { LoanApplicationExternal_ORM_Entity } from '../Entities/loan-application-external.orm-entity';
import { ICollateralByKedinasanRepository } from '../../Domain/Repositories/collateral-kedinasan-external.repository';

@Injectable()
export class CollateralByKedinasanRepositoryImpl implements ICollateralByKedinasanRepository {
  constructor(
    @InjectRepository(CollateralByKedinasan_ORM_Entity)
    private readonly ormRepository: Repository<CollateralByKedinasan_ORM_Entity>,
  ) {}

  private toDomain(orm: CollateralByKedinasan_ORM_Entity): CollateralByKedinasan {
    return new CollateralByKedinasan(
      { id: orm.pengajuan?.id },
      orm.instansi ?? undefined,
      orm.surat_permohonan_kredit ?? undefined,
      orm.surat_pernyataan_penjamin ?? undefined,
      orm.surat_persetujuan_pimpinan ?? undefined,
      orm.surat_keterangan_gaji ?? undefined,
      orm.id ?? undefined,
      orm.created_at ?? undefined,
      orm.updated_at ?? undefined,
      orm.deleted_at ?? null,
    );
  }

  private toOrm(domain: CollateralByKedinasan): Partial<CollateralByKedinasan_ORM_Entity> {
    return {
      id: domain.id,
      pengajuan: domain.pengajuan ? { id: domain.pengajuan.id } as LoanApplicationExternal_ORM_Entity : undefined,
      instansi: domain.instansi,
      surat_permohonan_kredit: domain.surat_permohonan_kredit,
      surat_pernyataan_penjamin: domain.surat_pernyataan_penjamin,
      surat_persetujuan_pimpinan: domain.surat_persetujuan_pimpinan,
      surat_keterangan_gaji: domain.surat_keterangan_gaji,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  private toOrmPartial(partial: Partial<CollateralByKedinasan>): Partial<CollateralByKedinasan_ORM_Entity> {
    const ormData: Partial<CollateralByKedinasan_ORM_Entity> = {};

    if (partial.pengajuan?.id !== undefined) {
      ormData.pengajuan = { id: partial.pengajuan.id } as LoanApplicationExternal_ORM_Entity;
    }
    if (partial.instansi !== undefined) ormData.instansi = partial.instansi;
    if (partial.surat_permohonan_kredit !== undefined) ormData.surat_permohonan_kredit = partial.surat_permohonan_kredit;
    if (partial.surat_pernyataan_penjamin !== undefined) ormData.surat_pernyataan_penjamin = partial.surat_pernyataan_penjamin;
    if (partial.surat_persetujuan_pimpinan !== undefined) ormData.surat_persetujuan_pimpinan = partial.surat_persetujuan_pimpinan;
    if (partial.surat_keterangan_gaji !== undefined) ormData.surat_keterangan_gaji = partial.surat_keterangan_gaji;
    if (partial.created_at !== undefined) ormData.created_at = partial.created_at;
    if (partial.updated_at !== undefined) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at !== undefined) ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  async findById(id: number): Promise<CollateralByKedinasan | null> {
    const orm = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuan'],
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findByPengajuanLuarId(pengajuanId: number): Promise<CollateralByKedinasan[]> {
    const ormEntities = await this.ormRepository.find({
      where: { pengajuan: { id: pengajuanId } },
      relations: ['pengajuan'],
    });
    return ormEntities.map((e) => this.toDomain(e));
  }

  async findAll(): Promise<CollateralByKedinasan[]> {
    const ormEntities = await this.ormRepository.find({
      relations: ['pengajuan'],
    });
    return ormEntities.map((e) => this.toDomain(e));
  }

  async save(collateral: CollateralByKedinasan): Promise<CollateralByKedinasan> {
    const ormEntity = this.toOrm(collateral);
    const saved = await this.ormRepository.save(ormEntity);
    return this.toDomain(saved as CollateralByKedinasan_ORM_Entity);
  }

  async update(id: number, data: Partial<CollateralByKedinasan>): Promise<CollateralByKedinasan> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuan'],
    });
    if (!updated) throw new NotFoundException(`CollateralByKedinasan with ID ${id} not found`);
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
