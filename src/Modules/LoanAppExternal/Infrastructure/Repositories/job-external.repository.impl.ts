import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobExternal } from '../../Domain/Entities/job-external.entity';
import { IJobExternalRepository } from '../../Domain/Repositories/job-external.repository';
import { JobExternal_ORM_Entity } from '../Entities/job.orm-entity';
import { ClientExternal_ORM_Entity } from '../Entities/client-external.orm-entity';

@Injectable()
export class JobExternalRepositoryImpl implements IJobExternalRepository {
  constructor(
    @InjectRepository(JobExternal_ORM_Entity)
    private readonly ormRepository: Repository<JobExternal_ORM_Entity>,
  ) {}

  //? ========================== MAPPER ===================================

  private toDomain(orm: JobExternal_ORM_Entity): JobExternal {
    return new JobExternal(
      orm.nasabah,
      orm.perusahaan,
      orm.alamat_perusahaan,
      orm.kontak_perusahaan,
      orm.jabatan,
      orm.lama_kerja,
      orm.status_karyawan,
      Number(orm.pendapatan_perbulan),
      orm.slip_gaji,
      orm.norek,
      orm.id_card,
      orm.lama_kontrak,
      orm.validasi_pekerjaan,
      orm.catatan,
      orm.id,
      orm.created_at,
      orm.updated_at,
      orm.deleted_at,
    );
  }

  private toOrm(domain: JobExternal): Partial<JobExternal_ORM_Entity> {
    return {
      id: domain.id,
      nasabah: { id: domain.nasabah.id } as ClientExternal_ORM_Entity,
      perusahaan: domain.perusahaan,
      alamat_perusahaan: domain.alamat_perusahaan,
      kontak_perusahaan: domain.kontak_perusahaan,
      jabatan: domain.jabatan,
      lama_kerja: domain.lama_kerja,
      status_karyawan: domain.status_karyawan,
      pendapatan_perbulan: domain.pendapatan_perbulan,
      slip_gaji: domain.slip_gaji,
      norek: domain.norek,
      id_card: domain.id_card,
      lama_kontrak: domain.lama_kontrak,
      validasi_pekerjaan: domain.validasi_pekerjaan,
      catatan: domain.catatan,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  private toOrmPartial(
    partial: Partial<JobExternal>,
  ): Partial<JobExternal_ORM_Entity> {
    const ormData: Partial<JobExternal_ORM_Entity> = {};

    if (partial.nasabah)
      ormData.nasabah = { id: partial.nasabah.id } as ClientExternal_ORM_Entity;
    if (partial.perusahaan) ormData.perusahaan = partial.perusahaan;
    if (partial.alamat_perusahaan)
      ormData.alamat_perusahaan = partial.alamat_perusahaan;
    if (partial.kontak_perusahaan)
      ormData.kontak_perusahaan = partial.kontak_perusahaan;
    if (partial.jabatan) ormData.jabatan = partial.jabatan;
    if (partial.lama_kerja) ormData.lama_kerja = partial.lama_kerja;
    if (partial.status_karyawan)
      ormData.status_karyawan = partial.status_karyawan;
    if (partial.pendapatan_perbulan !== undefined)
      ormData.pendapatan_perbulan = partial.pendapatan_perbulan;
    if (partial.slip_gaji) ormData.slip_gaji = partial.slip_gaji;
    if (partial.norek) ormData.norek = partial.norek;
    if (partial.id_card) ormData.id_card = partial.id_card;
    if (partial.lama_kontrak) ormData.lama_kontrak = partial.lama_kontrak;
    if (partial.validasi_pekerjaan !== undefined)
      ormData.validasi_pekerjaan = partial.validasi_pekerjaan;
    if (partial.catatan) ormData.catatan = partial.catatan;
    if (partial.created_at) ormData.created_at = partial.created_at;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at) ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  //? ========================== REPOSITORY METHODS ==========================

  async findById(id: number): Promise<JobExternal | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<JobExternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { nasabah: { id: nasabahId } },
    });
    return ormEntities.map(this.toDomain);
  }

  async save(data: JobExternal): Promise<JobExternal> {
    const ormEntity = this.toOrm(data);
    const saved = await this.ormRepository.save(ormEntity);
    return this.toDomain(saved as JobExternal_ORM_Entity);
  }

  async update(
    id: number,
    data: Partial<JobExternal>,
  ): Promise<JobExternal> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({ where: { id } });
    if (!updated) throw new Error('JobExternal not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async findAll(): Promise<JobExternal[]> {
    const ormEntities = await this.ormRepository.find();
    return ormEntities.map(this.toDomain);
  }
}
