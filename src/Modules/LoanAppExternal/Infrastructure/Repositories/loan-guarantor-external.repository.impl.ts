// Infrastructure/Repositories/loan-guarantor-external.repository.impl.ts
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

  private toDomain(entity: LoanGuarantorExternal_ORM_Entity): LoanGuarantorExternal {
    return new LoanGuarantorExternal(
      entity.nasabah.id,
      entity.hubungan_penjamin,
      entity.nama_penjamin,
      entity.pekerjaan_penjamin,
      Number(entity.penghasilan_penjamin),
      entity.no_hp_penjamin,
      entity.persetujuan_penjamin,
      entity.foto_ktp_penjamin,
      entity.id,
      entity.validasi_penjamin,
      entity.catatan,
      entity.created_at,
      entity.updated_at,
      entity.deleted_at,
    );
  }

  private toOrm(domain: LoanGuarantorExternal): Partial<LoanGuarantorExternal_ORM_Entity> {
    return {
      id: domain.id,
      nasabah: { id: domain.nasabahId } as ClientExternal_ORM_Entity,
      hubungan_penjamin: domain.hubunganPenjamin,
      nama_penjamin: domain.namaPenjamin,
      pekerjaan_penjamin: domain.pekerjaanPenjamin,
      penghasilan_penjamin: domain.penghasilanPenjamin,
      no_hp_penjamin: domain.noHpPenjamin,
      persetujuan_penjamin: domain.persetujuanPenjamin,
      foto_ktp_penjamin: domain.fotoKtpPenjamin,
      validasi_penjamin: domain.validasiPenjamin,
      catatan: domain.catatan,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
      deleted_at: domain.deletedAt,
    };
  }

  private toOrmPartial(
    partial: Partial<LoanGuarantorExternal>,
  ): Partial<LoanGuarantorExternal_ORM_Entity> {
    const ormData: Partial<LoanGuarantorExternal_ORM_Entity> = {};

    if (partial.nasabahId)
      ormData.nasabah = { id: partial.nasabahId } as ClientExternal_ORM_Entity;
    if (partial.hubunganPenjamin)
      ormData.hubungan_penjamin = partial.hubunganPenjamin;
    if (partial.namaPenjamin) ormData.nama_penjamin = partial.namaPenjamin;
    if (partial.pekerjaanPenjamin) ormData.pekerjaan_penjamin = partial.pekerjaanPenjamin;
    if (partial.penghasilanPenjamin !== undefined)
      ormData.penghasilan_penjamin = partial.penghasilanPenjamin;
    if (partial.noHpPenjamin) ormData.no_hp_penjamin = partial.noHpPenjamin;
    if (partial.persetujuanPenjamin)
      ormData.persetujuan_penjamin = partial.persetujuanPenjamin;
    if (partial.fotoKtpPenjamin)
      ormData.foto_ktp_penjamin = partial.fotoKtpPenjamin;
    if (partial.validasiPenjamin !== undefined)
      ormData.validasi_penjamin = partial.validasiPenjamin;
    if (partial.catatan) ormData.catatan = partial.catatan;
    if (partial.createdAt) ormData.created_at = partial.createdAt;
    if (partial.updatedAt) ormData.updated_at = partial.updatedAt;
    if (partial.deletedAt) ormData.deleted_at = partial.deletedAt;

    return ormData;
  }

  async findById(id: number): Promise<LoanGuarantorExternal | null> {
    const entity = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<LoanGuarantorExternal[]> {
    const entities = await this.ormRepository.find({
      where: { nasabah: { id: nasabahId } },
      relations: ['nasabah'],
    });
    return entities.map((e) => this.toDomain(e));
  }

  async findAll(): Promise<LoanGuarantorExternal[]> {
    const entities = await this.ormRepository.find({ relations: ['nasabah'] });
    return entities.map((e) => this.toDomain(e));
  }

  async save(domain: LoanGuarantorExternal): Promise<LoanGuarantorExternal> {
    const ormEntity = this.toOrm(domain);
    const saved = await this.ormRepository.save(ormEntity);
    return this.toDomain(saved as LoanGuarantorExternal_ORM_Entity);
  }

  async update(id: number, data: Partial<LoanGuarantorExternal>): Promise<LoanGuarantorExternal> {
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
