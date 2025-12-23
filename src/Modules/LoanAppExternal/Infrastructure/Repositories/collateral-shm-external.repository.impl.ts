import { Injectable, NotFoundException } from '@nestjs/common';
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

  // ========================== MAPPER: ORM → DOMAIN ==========================
  private toDomain(orm: CollateralBySHM_ORM_Entity): CollateralBySHM {
    return new CollateralBySHM(
      { id: orm.pengajuanLuar?.id },
      orm.atas_nama_shm,
      orm.hubungan_shm,
      orm.alamat_shm,
      orm.luas_shm,
      orm.njop_shm,
      orm.foto_shm,
      orm.foto_kk_pemilik_shm,
      orm.foto_pbb,
      orm.foto_objek_jaminan,
      orm.foto_buku_nikah_suami_istri,
      orm.foto_npwp,
      orm.foto_imb,
      orm.foto_surat_ahli_waris,
      orm.foto_surat_akte_kematian,
      orm.foto_surat_pernyataan_kepemilikan_tanah,
      orm.foto_surat_pernyataan_tidak_dalam_sengketa,
      orm.id,
      orm.created_at,
      orm.updated_at,
      orm.deleted_at,
    );
  }

  // ========================== MAPPER: DOMAIN → ORM ==========================
  private toORM(domain: CollateralBySHM): CollateralBySHM_ORM_Entity {
    const orm = new CollateralBySHM_ORM_Entity();
    orm.pengajuanLuar = {
      id: domain.pengajuan?.id,
    } as LoanApplicationExternal_ORM_Entity;
    orm.atas_nama_shm = domain.atas_nama_shm;
    orm.hubungan_shm = domain.hubungan_shm;
    orm.alamat_shm = domain.alamat_shm;
    orm.luas_shm = domain.luas_shm;
    orm.njop_shm = domain.njop_shm;
    orm.foto_shm = domain.foto_shm;
    orm.foto_kk_pemilik_shm = domain.foto_kk_pemilik_shm;
    orm.foto_pbb = domain.foto_pbb;
    orm.foto_objek_jaminan = domain.foto_objek_jaminan;
    orm.foto_buku_nikah_suami_istri = domain.foto_buku_nikah_suami_istri;
    orm.foto_npwp = domain.foto_npwp;
    orm.foto_imb = domain.foto_imb;
    orm.foto_surat_ahli_waris = domain.foto_surat_ahli_waris;
    orm.foto_surat_akte_kematian = domain.foto_surat_akte_kematian;
    orm.foto_surat_pernyataan_kepemilikan_tanah =
      domain.foto_surat_pernyataan_kepemilikan_tanah;
    orm.foto_surat_pernyataan_tidak_dalam_sengketa =
      domain.foto_surat_pernyataan_tidak_dalam_sengketa;
    orm.created_at = domain.created_at;
    orm.updated_at = domain.updated_at;
    orm.deleted_at = domain.deleted_at;
    return orm;
  }

  private toOrmPartial(
    partial: Partial<CollateralBySHM>,
  ): Partial<CollateralBySHM_ORM_Entity> {
    const orm: Partial<CollateralBySHM_ORM_Entity> = {};

    if (partial.pengajuan?.id)
      orm.pengajuanLuar = {
        id: partial.pengajuan.id,
      } as LoanApplicationExternal_ORM_Entity;
    if (partial.atas_nama_shm) orm.atas_nama_shm = partial.atas_nama_shm;
    if (partial.hubungan_shm) orm.hubungan_shm = partial.hubungan_shm;
    if (partial.alamat_shm) orm.alamat_shm = partial.alamat_shm;
    if (partial.luas_shm) orm.luas_shm = partial.luas_shm;
    if (partial.njop_shm) orm.njop_shm = partial.njop_shm;

    // Foto-foto
    if (partial.foto_shm) orm.foto_shm = partial.foto_shm;
    if (partial.foto_kk_pemilik_shm)
      orm.foto_kk_pemilik_shm = partial.foto_kk_pemilik_shm;
    if (partial.foto_pbb) orm.foto_pbb = partial.foto_pbb;
    if (partial.foto_objek_jaminan)
      orm.foto_objek_jaminan = partial.foto_objek_jaminan;
    if (partial.foto_buku_nikah_suami_istri)
      orm.foto_buku_nikah_suami_istri = partial.foto_buku_nikah_suami_istri;
    if (partial.foto_npwp) orm.foto_npwp = partial.foto_npwp;
    if (partial.foto_imb) orm.foto_imb = partial.foto_imb;
    if (partial.foto_surat_ahli_waris)
      orm.foto_surat_ahli_waris = partial.foto_surat_ahli_waris;
    if (partial.foto_surat_akte_kematian)
      orm.foto_surat_akte_kematian = partial.foto_surat_akte_kematian;
    if (partial.foto_surat_pernyataan_kepemilikan_tanah)
      orm.foto_surat_pernyataan_kepemilikan_tanah =
        partial.foto_surat_pernyataan_kepemilikan_tanah;
    if (partial.foto_surat_pernyataan_tidak_dalam_sengketa)
      orm.foto_surat_pernyataan_tidak_dalam_sengketa =
        partial.foto_surat_pernyataan_tidak_dalam_sengketa;

    if (partial.created_at) orm.created_at = partial.created_at;
    if (partial.updated_at) orm.updated_at = partial.updated_at;
    if (partial.deleted_at) orm.deleted_at = partial.deleted_at;

    return orm;
  }

  // ========================== CRUD METHODS ==========================

  async findById(id: number): Promise<CollateralBySHM | null> {
    const orm = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuanLuar'],
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findByPengajuanLuarId(pengajuanId: number): Promise<CollateralBySHM[]> {
    const ormList = await this.ormRepository.find({
      where: { pengajuanLuar: { id: pengajuanId } },
      relations: ['pengajuanLuar'],
    });
    return ormList.map((e) => this.toDomain(e));
  }

  async findAll(): Promise<CollateralBySHM[]> {
    const ormList = await this.ormRepository.find({
      relations: ['pengajuanLuar'],
    });
    return ormList.map((e) => this.toDomain(e));
  }

  async save(data: CollateralBySHM): Promise<CollateralBySHM> {
    const ormEntity = this.toORM(data);
    const saved = await this.ormRepository.save(ormEntity);
    return this.toDomain(saved as CollateralBySHM_ORM_Entity);
  }

  async update(
    id: number,
    data: Partial<CollateralBySHM>,
  ): Promise<CollateralBySHM> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuanLuar'],
    });
    if (!updated)
      throw new NotFoundException(`CollateralBySHM with ID ${id} not found`);
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
