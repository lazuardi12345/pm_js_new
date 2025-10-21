import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollateralInternal } from '../../Domain/Entities/collateral-internal.entity';
import { ICollateralInternalRepository } from '../../Domain/Repositories/collateral-internal.repository';
import { CollateralInternal_ORM_Entity } from '../Entities/collateral-internal.orm-entity';
import { ClientInternal_ORM_Entity } from '../Entities/client-internal.orm-entity';

@Injectable()
export class CollateralInternalRepositoryImpl
  implements ICollateralInternalRepository {
  constructor(
    @InjectRepository(CollateralInternal_ORM_Entity)
    private readonly ormRepository: Repository<CollateralInternal_ORM_Entity>,
  ) { }
  findByClientId(clientId: number): unknown;
  findByClientId(clientId: number): unknown;
  findByClientId(clientId: unknown): unknown {
    throw new Error('Method not implemented.');
  }

  //? MAPPER >==========================================================================

  //? All Transactions that using for get datas

  private toDomain(orm: CollateralInternal_ORM_Entity): CollateralInternal {
    console.log('orm > : ', orm.nasabah_id?.id);
    return new CollateralInternal(
      orm.nasabah_id,
      orm.jaminan_hrd,
      orm.jaminan_cg,
      orm.penjamin,
      orm.id,
      orm.created_at,
      orm.deleted_at,
      orm.nama_penjamin,
      orm.lama_kerja_penjamin,
      orm.bagian,
      orm.absensi,
      orm.riwayat_pinjam_penjamin,
      orm.riwayat_nominal_penjamin,
      orm.riwayat_tenor_penjamin,
      orm.sisa_pinjaman_penjamin,
      orm.jaminan_cg_penjamin,
      orm.status_hubungan_penjamin,
      orm.foto_ktp_penjamin,
      orm.foto_id_card_penjamin,
      orm.updated_at,
    );
  }

  //? All Transactions that using for Create datas

  private toOrm(
    domainEntity: CollateralInternal,
  ): Partial<CollateralInternal_ORM_Entity> {
    return {
      id: domainEntity.id,
      nasabah_id: { id: domainEntity.nasabah.id } as ClientInternal_ORM_Entity,
      jaminan_hrd: domainEntity.jaminan_hrd,
      jaminan_cg: domainEntity.jaminan_cg,
      penjamin: domainEntity.penjamin,
      nama_penjamin: domainEntity.nama_penjamin,
      lama_kerja_penjamin: domainEntity.lama_kerja_penjamin,
      bagian: domainEntity.bagian,
      absensi: domainEntity.absensi,
      riwayat_pinjam_penjamin: domainEntity.riwayat_pinjam_penjamin,
      riwayat_nominal_penjamin: domainEntity.riwayat_nominal_penjamin,
      riwayat_tenor_penjamin: domainEntity.riwayat_tenor_penjamin,
      sisa_pinjaman_penjamin: domainEntity.sisa_pinjaman_penjamin,
      jaminan_cg_penjamin: domainEntity.jaminan_cg_penjamin,
      status_hubungan_penjamin: domainEntity.status_hubungan_penjamin,
      foto_ktp_penjamin: domainEntity.foto_ktp_penjamin,
      foto_id_card_penjamin: domainEntity.foto_id_card_penjamin,
      created_at: domainEntity.created_at,
      updated_at: domainEntity.updated_at,
      deleted_at: domainEntity.deleted_at,
    };
  }

  //? All Transactions that using for Partial Update like PATCH or Delete

  private toOrmPartial(
    partial: Partial<CollateralInternal>,
  ): Partial<CollateralInternal_ORM_Entity> {
    const ormData: Partial<CollateralInternal_ORM_Entity> = {};

    if (partial.nasabah)
      ormData.nasabah_id! = {
        id: partial.nasabah.id,
      } as ClientInternal_ORM_Entity;
    if (partial.jaminan_hrd) ormData.jaminan_hrd = partial.jaminan_hrd;
    if (partial.jaminan_cg) ormData.jaminan_cg = partial.jaminan_cg;
    if (partial.penjamin) ormData.penjamin = partial.penjamin;
    if (partial.nama_penjamin) ormData.nama_penjamin = partial.nama_penjamin;
    if (partial.lama_kerja_penjamin) ormData.lama_kerja_penjamin = partial.lama_kerja_penjamin;
    if (partial.bagian) ormData.bagian = partial.bagian;
    if (partial.absensi) ormData.absensi = partial.absensi;
    if (partial.riwayat_pinjam_penjamin) ormData.riwayat_pinjam_penjamin = partial.riwayat_pinjam_penjamin;
    if (partial.riwayat_nominal_penjamin) ormData.riwayat_nominal_penjamin = partial.riwayat_nominal_penjamin;
    if (partial.riwayat_tenor_penjamin) ormData.riwayat_tenor_penjamin = partial.riwayat_tenor_penjamin;
    if (partial.sisa_pinjaman_penjamin) ormData.sisa_pinjaman_penjamin = partial.sisa_pinjaman_penjamin;
    if (partial.jaminan_cg_penjamin) ormData.jaminan_cg_penjamin = partial.jaminan_cg_penjamin;
    if (partial.status_hubungan_penjamin) ormData.status_hubungan_penjamin = partial.status_hubungan_penjamin;
    if (partial.foto_ktp_penjamin) ormData.foto_ktp_penjamin = partial.foto_ktp_penjamin;
    if (partial.foto_id_card_penjamin) ormData.foto_id_card_penjamin = partial.foto_id_card_penjamin;
    if (partial.created_at) ormData.created_at = partial.created_at;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at) ormData.deleted_at = partial.deleted_at;


    return ormData;
  }

  //?===================================================================================

  async findById(id: number): Promise<CollateralInternal | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<CollateralInternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { nasabah_id: { id: nasabahId } },
    });
    return ormEntities.map(this.toDomain);
  }

  async save(address: CollateralInternal): Promise<CollateralInternal> {
    const ormEntity = this.toOrm(address);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }

  async update(
    id: number,
    collateralData: Partial<CollateralInternal>,
  ): Promise<CollateralInternal> {
    console.log('collateralData', collateralData, 'id', id);
    await this.ormRepository.update(id, this.toOrmPartial(collateralData));
    const updated = await this.ormRepository.findOne({
      where: { id },
    });
    if (!updated) throw new Error('Collateral not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async findAll(): Promise<CollateralInternal[]> {
    const ormEntities = await this.ormRepository.find();
    return ormEntities.map(this.toDomain);
  }
}
