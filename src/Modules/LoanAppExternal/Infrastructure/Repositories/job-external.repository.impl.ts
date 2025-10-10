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

  private toDomain(orm: JobExternal_ORM_Entity): JobExternal {
    return new JobExternal(
      orm.nasabah.id,
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
      nasabah: { id: domain.nasabahId } as ClientExternal_ORM_Entity,
      perusahaan: domain.perusahaan,
      alamat_perusahaan: domain.alamatPerusahaan,
      kontak_perusahaan: domain.kontakPerusahaan,
      jabatan: domain.jabatan,
      lama_kerja: domain.lamaKerja,
      status_karyawan: domain.statusKaryawan,
      pendapatan_perbulan: domain.pendapatanPerbulan,
      slip_gaji: domain.slipGaji,
      norek: domain.norek,
      id_card: domain.idCard,
      lama_kontrak: domain.lamaKontrak,
      validasi_pekerjaan: domain.validasiPekerjaan,
      catatan: domain.catatan,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
      deleted_at: domain.deletedAt,
    };
  }

  private toOrmPartial(
    partial: Partial<JobExternal>,
  ): Partial<JobExternal_ORM_Entity> {
    const orm: Partial<JobExternal_ORM_Entity> = {};
    if (partial.nasabahId)
      orm.nasabah = { id: partial.nasabahId } as ClientExternal_ORM_Entity;
    if (partial.perusahaan) orm.perusahaan = partial.perusahaan;
    if (partial.alamatPerusahaan) orm.alamat_perusahaan = partial.alamatPerusahaan;
    if (partial.kontakPerusahaan) orm.kontak_perusahaan = partial.kontakPerusahaan;
    if (partial.jabatan) orm.jabatan = partial.jabatan;
    if (partial.lamaKerja) orm.lama_kerja = partial.lamaKerja;
    if (partial.statusKaryawan) orm.status_karyawan = partial.statusKaryawan;
    if (partial.pendapatanPerbulan !== undefined) orm.pendapatan_perbulan = partial.pendapatanPerbulan;
    if (partial.slipGaji) orm.slip_gaji = partial.slipGaji;
    if (partial.norek) orm.norek = partial.norek;
    if (partial.idCard) orm.id_card = partial.idCard;
    if (partial.lamaKontrak) orm.lama_kontrak = partial.lamaKontrak;
    if (partial.validasiPekerjaan !== undefined) orm.validasi_pekerjaan = partial.validasiPekerjaan;
    if (partial.catatan) orm.catatan = partial.catatan;
    if (partial.createdAt) orm.created_at = partial.createdAt;
    if (partial.updatedAt) orm.updated_at = partial.updatedAt;
    if (partial.deletedAt) orm.deleted_at = partial.deletedAt;
    return orm;
  }

  async findById(id: number): Promise<JobExternal | null> {
    const orm = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<JobExternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { nasabah: { id: nasabahId } },
      relations: ['nasabah'],
    });
    return ormEntities.map((e) => this.toDomain(e));
  }

  async findAll(): Promise<JobExternal[]> {
    const ormEntities = await this.ormRepository.find({ relations: ['nasabah'] });
    return ormEntities.map((e) => this.toDomain(e));
  }

  async save(data: JobExternal): Promise<JobExternal> {
    const saved = await this.ormRepository.save(this.toOrm(data));
    return this.toDomain(saved as JobExternal_ORM_Entity);
  }

  async update(id: number, data: Partial<JobExternal>): Promise<JobExternal> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    if (!updated) throw new Error('JobExternal not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
