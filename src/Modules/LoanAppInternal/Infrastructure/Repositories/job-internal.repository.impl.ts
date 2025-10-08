import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobInternal } from '../../Domain/Entities/job-internal.entity';
import { IJobInternalRepository } from '../../Domain/Repositories/job-internal.repository';
import { JobInternal_ORM_Entity } from '../Entities/job-internal.orm-entity';
import { ClientInternal_ORM_Entity } from '../Entities/client-internal.orm-entity';
@Injectable()
export class JobInternalRepositoryImpl implements IJobInternalRepository {
  constructor(
    @InjectRepository(JobInternal_ORM_Entity)
    private readonly ormRepository: Repository<JobInternal_ORM_Entity>,
  ) {}

  //? MAPPER >==========================================================================

  //? All Transactions that using for get datas

  private toDomain(orm: JobInternal_ORM_Entity): JobInternal {
    console.log('orm > : ', orm.nasabah?.id);
    return new JobInternal(
      orm.nasabah,
      orm.perusahaan,
      orm.divisi,
      orm.golongan,
      orm.nama_atasan,
      orm.nama_hrd,
      orm.absensi,
      orm.id,
      orm.created_at,
      orm.deleted_at,
      orm.yayasan,
      orm.lama_kerja_bulan,
      orm.lama_kerja_tahun,
      orm.bukti_absensi,
      orm.updated_at,
    );
  }

  //? All Transactions that using for Create datas

  private toOrm(domainEntity: JobInternal): Partial<JobInternal_ORM_Entity> {
  return {
    id: domainEntity.id,
    nasabah: { id: domainEntity.nasabah.id } as ClientInternal_ORM_Entity,
    perusahaan: domainEntity.perusahaan,
    divisi: domainEntity.divisi,
    golongan: domainEntity.golongan,
    nama_atasan: domainEntity.nama_atasan,
    nama_hrd: domainEntity.nama_hrd,
    absensi: domainEntity.absensi,
    yayasan: domainEntity.yayasan,
    lama_kerja_bulan: domainEntity.lama_kerja_bulan,
    lama_kerja_tahun: domainEntity.lama_kerja_tahun,
    bukti_absensi: domainEntity.bukti_absensi,
    created_at: domainEntity.created_at,
    updated_at: domainEntity.updated_at,
    deleted_at: domainEntity.deleted_at,
  };
}

//? All Transactions that using for Partial Update like PATCH or Delete

private toOrmPartial(
  partial: Partial<JobInternal>,
): Partial<JobInternal_ORM_Entity> {
  const ormData: Partial<JobInternal_ORM_Entity> = {};

  if (partial.nasabah)
    ormData.nasabah! = {
      id: partial.nasabah.id,
    } as ClientInternal_ORM_Entity;
  if (partial.perusahaan) ormData.perusahaan = partial.perusahaan;
  if (partial.divisi) ormData.divisi = partial.divisi;
  if (partial.golongan) ormData.golongan = partial.golongan;
  if (partial.nama_atasan) ormData.nama_atasan = partial.nama_atasan;
  if (partial.nama_hrd) ormData.nama_hrd = partial.nama_hrd;
  if (partial.absensi) ormData.absensi = partial.absensi;
  if (partial.yayasan) ormData.yayasan = partial.yayasan;
  if (partial.lama_kerja_bulan)
    ormData.lama_kerja_bulan = partial.lama_kerja_bulan;
  if (partial.lama_kerja_tahun)
    ormData.lama_kerja_tahun = partial.lama_kerja_tahun;
  if (partial.bukti_absensi) ormData.bukti_absensi = partial.bukti_absensi;
  if (partial.created_at) ormData.created_at = partial.created_at;
  if (partial.updated_at) ormData.updated_at = partial.updated_at;
  if (partial.deleted_at) ormData.deleted_at = partial.deleted_at;

  return ormData;
}


  //?===================================================================================

  async findById(id: number): Promise<JobInternal | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<JobInternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { nasabah: { id: nasabahId } },
    });
    return ormEntities.map(this.toDomain);
  }

  async save(address: JobInternal): Promise<JobInternal> {
    const ormEntity = this.toOrm(address);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }

  async update(
    id: number,
    jobData: Partial<JobInternal>,
  ): Promise<JobInternal> {
    await this.ormRepository.update(id, this.toOrmPartial(jobData));
    const updated = await this.ormRepository.findOne({
      where: { id },
    });
    if (!updated) throw new Error('Job not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async findAll(): Promise<JobInternal[]> {
    const ormEntities = await this.ormRepository.find();
    return ormEntities.map(this.toDomain);
  }
}
