import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollateralByBPKB } from '../../Domain/Entities/collateral-bpkb-external.entity';
import { CollateralByBPKB_ORM_Entity } from '../Entities/collateral-bpkb.orm-entity';
import { LoanApplicationExternal_ORM_Entity } from '../Entities/loan-application-external.orm-entity';
import { ICollateralByBPKBRepository } from '../../Domain/Repositories/collateral-bpkb-external.repository';

@Injectable()
export class CollateralByBPKBRepositoryImpl
  implements ICollateralByBPKBRepository
{
  constructor(
    @InjectRepository(CollateralByBPKB_ORM_Entity)
    private readonly ormRepository: Repository<CollateralByBPKB_ORM_Entity>,
  ) {}

  private toDomain(ormEntity: CollateralByBPKB_ORM_Entity): CollateralByBPKB {
    return new CollateralByBPKB(
      ormEntity.pengajuan.id,
      ormEntity.atas_nama_bpkb,
      ormEntity.no_stnk,
      ormEntity.alamat_pemilik_bpkb,
      ormEntity.type_kendaraan,
      ormEntity.tahun_perakitan,
      ormEntity.warna_kendaraan,
      ormEntity.stransmisi,
      ormEntity.no_rangka,
      ormEntity.no_mesin,
      ormEntity.no_bpkb,
      ormEntity.foto_stnk,
      ormEntity.foto_bpkb,
      ormEntity.foto_motor,
      ormEntity.id,
      ormEntity.created_at,
      ormEntity.updated_at,
      ormEntity.deleted_at,
    );
  }

  private toOrm(domain: CollateralByBPKB): Partial<CollateralByBPKB_ORM_Entity> {
    return {
      id: domain.id,
      pengajuan: { id: domain.pengajuanId } as LoanApplicationExternal_ORM_Entity,
      atas_nama_bpkb: domain.atasNamaBpkb,
      no_stnk: domain.noStnk,
      alamat_pemilik_bpkb: domain.alamatPemilikBpkb,
      type_kendaraan: domain.typeKendaraan,
      tahun_perakitan: domain.tahunPerakitan,
      warna_kendaraan: domain.warnaKendaraan,
      stransmisi: domain.stransmisi,
      no_rangka: domain.noRangka,
      no_mesin: domain.noMesin,
      no_bpkb: domain.noBpkb,
      foto_stnk: domain.fotoStnk,
      foto_bpkb: domain.fotoBpkb,
      foto_motor: domain.fotoMotor,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
      deleted_at: domain.deletedAt,
    };
  }

  private toOrmPartial(
    partial: Partial<CollateralByBPKB>,
  ): Partial<CollateralByBPKB_ORM_Entity> {
    const ormData: Partial<CollateralByBPKB_ORM_Entity> = {};

    if (partial.pengajuanId)
      ormData.pengajuan = { id: partial.pengajuanId } as LoanApplicationExternal_ORM_Entity;
    if (partial.atasNamaBpkb) ormData.atas_nama_bpkb = partial.atasNamaBpkb;
    if (partial.noStnk) ormData.no_stnk = partial.noStnk;
    if (partial.alamatPemilikBpkb) ormData.alamat_pemilik_bpkb = partial.alamatPemilikBpkb;
    if (partial.typeKendaraan) ormData.type_kendaraan = partial.typeKendaraan;
    if (partial.tahunPerakitan) ormData.tahun_perakitan = partial.tahunPerakitan;
    if (partial.warnaKendaraan) ormData.warna_kendaraan = partial.warnaKendaraan;
    if (partial.stransmisi) ormData.stransmisi = partial.stransmisi;
    if (partial.noRangka) ormData.no_rangka = partial.noRangka;
    if (partial.noMesin) ormData.no_mesin = partial.noMesin;
    if (partial.noBpkb) ormData.no_bpkb = partial.noBpkb;
    if (partial.fotoStnk) ormData.foto_stnk = partial.fotoStnk;
    if (partial.fotoBpkb) ormData.foto_bpkb = partial.fotoBpkb;
    if (partial.fotoMotor) ormData.foto_motor = partial.fotoMotor;
    if (partial.createdAt) ormData.created_at = partial.createdAt;
    if (partial.updatedAt) ormData.updated_at = partial.updatedAt;
    if (partial.deletedAt) ormData.deleted_at = partial.deletedAt;

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
    if (!updated) throw new Error('CollateralByBPKB not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
