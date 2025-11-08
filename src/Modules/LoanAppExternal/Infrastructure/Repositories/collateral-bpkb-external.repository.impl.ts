import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollateralByBPKB } from '../../Domain/Entities/collateral-bpkb-external.entity';
import { ICollateralByBPKBRepository } from '../../Domain/Repositories/collateral-bpkb-external.repository';
import { CollateralByBPKB_ORM_Entity } from '../Entities/collateral-bpkb.orm-entity';
import { LoanApplicationExternal_ORM_Entity } from '../Entities/loan-application-external.orm-entity';

@Injectable()
export class CollateralByBPKBRepositoryImpl implements ICollateralByBPKBRepository {
  constructor(
    @InjectRepository(CollateralByBPKB_ORM_Entity)
    private readonly ormRepository: Repository<CollateralByBPKB_ORM_Entity>,
  ) {}

  //? ========================== MAPPER ===================================

private toDomain(orm: CollateralByBPKB_ORM_Entity): CollateralByBPKB {
  return new CollateralByBPKB(
    { id: orm.pengajuan?.id },
    orm.atas_nama_bpkb,
    orm.no_stnk,
    orm.alamat_pemilik_bpkb,
    orm.type_kendaraan,
    orm.tahun_perakitan,
    orm.warna_kendaraan,
    orm.stransmisi,
    orm.no_rangka,
    orm.foto_no_rangka,
    orm.no_mesin,
    orm.foto_no_mesin,
    orm.no_bpkb,
    orm.dokumen_bpkb,
    orm.foto_stnk_depan,
    orm.foto_stnk_belakang,
    orm.foto_kendaraan_depan,
    orm.foto_kendaraan_belakang,
    orm.foto_kendaraan_samping_kanan,
    orm.foto_kendaraan_samping_kiri,
    orm.foto_sambara,
    orm.foto_kwitansi_jual_beli,
    orm.foto_ktp_tangan_pertama,
    orm.foto_faktur_kendaraan,
    orm.foto_snikb,
    orm.id,
    orm.created_at,
    orm.updated_at,
    orm.deleted_at,
  );
}


private toORM(domain: CollateralByBPKB): CollateralByBPKB_ORM_Entity {
  const orm = new CollateralByBPKB_ORM_Entity();
  orm.pengajuan = { id: domain.pengajuan.id } as any;
  orm.atas_nama_bpkb = domain.atas_nama_bpkb;
  orm.no_stnk = domain.no_stnk;
  orm.alamat_pemilik_bpkb = domain.alamat_pemilik_bpkb;
  orm.type_kendaraan = domain.type_kendaraan;
  orm.tahun_perakitan = domain.tahun_perakitan;
  orm.warna_kendaraan = domain.warna_kendaraan;
  orm.stransmisi = domain.stransmisi;
  orm.no_rangka = domain.no_rangka;
  orm.foto_no_rangka = domain.foto_no_rangka;
  orm.no_mesin = domain.no_mesin;
  orm.foto_no_mesin = domain.foto_no_mesin;
  orm.no_bpkb = domain.no_bpkb;
  orm.dokumen_bpkb = domain.dokumen_bpkb;
  orm.foto_stnk_depan = domain.foto_stnk_depan;
  orm.foto_stnk_belakang = domain.foto_stnk_belakang;
  orm.foto_kendaraan_depan = domain.foto_kendaraan_depan;
  orm.foto_kendaraan_belakang = domain.foto_kendaraan_belakang;
  orm.foto_kendaraan_samping_kanan = domain.foto_kendaraan_samping_kanan;
  orm.foto_kendaraan_samping_kiri = domain.foto_kendaraan_samping_kiri;
  orm.foto_sambara = domain.foto_sambara;
  orm.foto_kwitansi_jual_beli = domain.foto_kwitansi_jual_beli;
  orm.foto_ktp_tangan_pertama = domain.foto_ktp_tangan_pertama;
  orm.foto_faktur_kendaraan = domain.foto_faktur_kendaraan;
  orm.foto_snikb = domain.foto_snikb;
  return orm;
}

  private toOrmPartial(
    partial: Partial<CollateralByBPKB>,
  ): Partial<CollateralByBPKB_ORM_Entity> {
    const ormData: Partial<CollateralByBPKB_ORM_Entity> = {};

    if (partial.pengajuan)
      ormData.pengajuan = { id: partial.pengajuan.id } as LoanApplicationExternal_ORM_Entity;
    if (partial.atas_nama_bpkb) ormData.atas_nama_bpkb = partial.atas_nama_bpkb;
    if (partial.no_stnk) ormData.no_stnk = partial.no_stnk;
    if (partial.alamat_pemilik_bpkb)
      ormData.alamat_pemilik_bpkb = partial.alamat_pemilik_bpkb;
    if (partial.type_kendaraan) ormData.type_kendaraan = partial.type_kendaraan;
    if (partial.tahun_perakitan) ormData.tahun_perakitan = partial.tahun_perakitan;
    if (partial.warna_kendaraan) ormData.warna_kendaraan = partial.warna_kendaraan;
    if (partial.stransmisi) ormData.stransmisi = partial.stransmisi;
    if (partial.no_rangka) ormData.no_rangka = partial.no_rangka;
    if (partial.no_mesin) ormData.no_mesin = partial.no_mesin;
    if (partial.no_bpkb) ormData.no_bpkb = partial.no_bpkb;
    if (partial.foto_snikb) ormData.foto_snikb = partial.foto_snikb;
    if (partial.created_at) ormData.created_at = partial.created_at;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at) ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  //? ========================== REPOSITORY METHODS ==========================

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
    return ormEntities.map(this.toDomain);
  }

async save(data: CollateralByBPKB): Promise<CollateralByBPKB> {
  const ormEntity = this.toORM(data);
  const saved = await this.ormRepository.save(ormEntity);
  return this.toDomain(saved as CollateralByBPKB_ORM_Entity);
}


  async update(id: number, data: Partial<CollateralByBPKB>): Promise<CollateralByBPKB> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuan'],
    });
    if (!updated) throw new Error('CollateralByBPKB not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
async findAll(): Promise<CollateralByBPKB[]> {
  const ormEntities = await this.ormRepository.find({ relations: ['pengajuan'] });
  return ormEntities.map((e) => this.toDomain(e));
}
}
