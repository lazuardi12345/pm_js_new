import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanGuarantorExternal } from '../../Domain/Entities/loan-guarantor-external.entity';
import { ILoanGuarantorExternalRepository } from '../../Domain/Repositories/loan-guarantor-external.repository';
import { LoanGuarantorExternal_ORM_Entity } from '../Entities/loan-guarantor.orm-entity';
import { ClientExternal_ORM_Entity } from '../Entities/client-external.orm-entity';

@Injectable()
export class LoanGuarantorExternalRepositoryImpl
  implements ILoanGuarantorExternalRepository
{
  constructor(
    @InjectRepository(LoanGuarantorExternal_ORM_Entity)
    private readonly ormRepository: Repository<LoanGuarantorExternal_ORM_Entity>,
  ) {}

  private toDomain(
    orm: LoanGuarantorExternal_ORM_Entity,
  ): LoanGuarantorExternal {
    return new LoanGuarantorExternal(
      { id: orm.nasabah.id },
      orm.hubungan_penjamin,
      orm.nama_penjamin,
      orm.pekerjaan_penjamin,
      Number(orm.penghasilan_penjamin),
      orm.no_hp_penjamin,
      orm.persetujuan_penjamin,
      orm.foto_ktp_penjamin,
      orm.id,
      orm.validasi_penjamin,
      orm.created_at,
      orm.updated_at,
      orm.deleted_at,
    );
  }

  private toOrm(
    domain: LoanGuarantorExternal,
  ): Partial<LoanGuarantorExternal_ORM_Entity> {
    return {
      id: domain.id,
      nasabah: { id: domain.nasabah.id } as ClientExternal_ORM_Entity,
      hubungan_penjamin: domain.hubungan_penjamin,
      nama_penjamin: domain.nama_penjamin,
      pekerjaan_penjamin: domain.pekerjaan_penjamin,
      penghasilan_penjamin: domain.penghasilan_penjamin,
      no_hp_penjamin: domain.no_hp_penjamin,
      persetujuan_penjamin: domain.persetujuan_penjamin,
      foto_ktp_penjamin: domain.foto_ktp_penjamin,
      validasi_penjamin: domain.validasi_penjamin,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  private toOrmPartial(
    partial: Partial<LoanGuarantorExternal>,
  ): Partial<LoanGuarantorExternal_ORM_Entity> {
    const orm: Partial<LoanGuarantorExternal_ORM_Entity> = {};

    if (partial.nasabah?.id)
      orm.nasabah = { id: partial.nasabah.id } as ClientExternal_ORM_Entity;
    if (partial.hubungan_penjamin)
      orm.hubungan_penjamin = partial.hubungan_penjamin;
    if (partial.nama_penjamin) orm.nama_penjamin = partial.nama_penjamin;
    if (partial.pekerjaan_penjamin)
      orm.pekerjaan_penjamin = partial.pekerjaan_penjamin;
    if (partial.penghasilan_penjamin !== undefined)
      orm.penghasilan_penjamin = partial.penghasilan_penjamin;
    if (partial.no_hp_penjamin) orm.no_hp_penjamin = partial.no_hp_penjamin;
    if (partial.persetujuan_penjamin)
      orm.persetujuan_penjamin = partial.persetujuan_penjamin;
    if (partial.foto_ktp_penjamin)
      orm.foto_ktp_penjamin = partial.foto_ktp_penjamin;
    if (partial.validasi_penjamin !== undefined)
      orm.validasi_penjamin = partial.validasi_penjamin;
    if (partial.created_at) orm.created_at = partial.created_at;
    if (partial.updated_at) orm.updated_at = partial.updated_at;
    if (partial.deleted_at) orm.deleted_at = partial.deleted_at;

    return orm;
  }

  async findById(id: number): Promise<LoanGuarantorExternal | null> {
    const orm = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<LoanGuarantorExternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { nasabah: { id: nasabahId } },
      relations: ['nasabah'],
    });
    return ormEntities.map((e) => this.toDomain(e));
  }

  async findAll(): Promise<LoanGuarantorExternal[]> {
    const ormEntities = await this.ormRepository.find({
      relations: ['nasabah'],
    });
    return ormEntities.map((e) => this.toDomain(e));
  }

  async save(domain: LoanGuarantorExternal): Promise<LoanGuarantorExternal> {
    const saved = await this.ormRepository.save(this.toOrm(domain));
    return this.toDomain(saved as LoanGuarantorExternal_ORM_Entity);
  }

  async update(
    id: number,
    data: Partial<LoanGuarantorExternal>,
  ): Promise<LoanGuarantorExternal> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    if (!updated) throw new Error('LoanGuarantorExternal not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
