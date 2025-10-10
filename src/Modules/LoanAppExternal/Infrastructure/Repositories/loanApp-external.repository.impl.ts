import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanApplicationExternal } from '../../Domain/Entities/loanApp-external.entity';
import { LoanApplicationExternal_ORM_Entity } from '../Entities/loan-application-external.orm-entity';
import { ILoanApplicationExternalRepository } from '../../Domain/Repositories/loanApp-external.repository';
import { ClientExternal_ORM_Entity } from '../Entities/client-external.orm-entity';

@Injectable()
export class LoanApplicationExternalRepositoryImpl
  implements ILoanApplicationExternalRepository
{
  constructor(
    @InjectRepository(LoanApplicationExternal_ORM_Entity)
    private readonly ormRepository: Repository<LoanApplicationExternal_ORM_Entity>,
  ) {}

  private toDomain(orm: LoanApplicationExternal_ORM_Entity): LoanApplicationExternal {
    return new LoanApplicationExternal(
      orm.id,
      orm.jenis_pembiayaan,
      Number(orm.nominal_pinjaman),
      orm.tenor,
      orm.berkas_jaminan,
      orm.status_pinjaman,
      orm.nasabah.id,
      orm.pinjaman_ke,
      orm.pinjaman_terakhir ? Number(orm.pinjaman_terakhir) : undefined,
      orm.sisa_pinjaman ? Number(orm.sisa_pinjaman) : undefined,
      orm.realisasi_pinjaman,
      orm.cicilan_perbulan ? Number(orm.cicilan_perbulan) : undefined,
      orm.status_pengajuan,
      orm.validasi_pengajuan,
      orm.catatan,
      orm.catatan_spv,
      orm.catatan_marketing,
      orm.is_banding,
      orm.alasan_banding,
      orm.created_at,
      orm.updated_at,
      orm.deleted_at,
    );
  }

  private toOrm(domain: LoanApplicationExternal): Partial<LoanApplicationExternal_ORM_Entity> {
    return {
      id: domain.id,
      nasabah: { id: domain.nasabahId } as ClientExternal_ORM_Entity,
      jenis_pembiayaan: domain.jenisPembiayaan,
      nominal_pinjaman: domain.nominalPinjaman,
      tenor: domain.tenor,
      berkas_jaminan: domain.berkasJaminan,
      status_pinjaman: domain.statusPinjaman,
      pinjaman_ke: domain.pinjamanKe,
      pinjaman_terakhir: domain.pinjamanTerakhir,
      sisa_pinjaman: domain.sisaPinjaman,
      realisasi_pinjaman: domain.realisasiPinjaman,
      cicilan_perbulan: domain.cicilanPerbulan,
      status_pengajuan: domain.statusPengajuan,
      validasi_pengajuan: domain.validasiPengajuan,
      catatan: domain.catatan,
      catatan_spv: domain.catatanSpv,
      catatan_marketing: domain.catatanMarketing,
      is_banding: domain.isBanding,
      alasan_banding: domain.alasanBanding,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
      deleted_at: domain.deletedAt,
    };
  }

  private toOrmPartial(
    partial: Partial<LoanApplicationExternal>,
  ): Partial<LoanApplicationExternal_ORM_Entity> {
    const orm: Partial<LoanApplicationExternal_ORM_Entity> = {};
    if (partial.nasabahId)
      orm.nasabah = { id: partial.nasabahId } as ClientExternal_ORM_Entity;
    if (partial.jenisPembiayaan) orm.jenis_pembiayaan = partial.jenisPembiayaan;
    if (partial.nominalPinjaman !== undefined) orm.nominal_pinjaman = partial.nominalPinjaman;
    if (partial.tenor !== undefined) orm.tenor = partial.tenor;
    if (partial.berkasJaminan) orm.berkas_jaminan = partial.berkasJaminan;
    if (partial.statusPinjaman) orm.status_pinjaman = partial.statusPinjaman;
    if (partial.pinjamanKe !== undefined) orm.pinjaman_ke = partial.pinjamanKe;
    if (partial.pinjamanTerakhir !== undefined) orm.pinjaman_terakhir = partial.pinjamanTerakhir;
    if (partial.sisaPinjaman !== undefined) orm.sisa_pinjaman = partial.sisaPinjaman;
    if (partial.realisasiPinjaman) orm.realisasi_pinjaman = partial.realisasiPinjaman;
    if (partial.cicilanPerbulan !== undefined) orm.cicilan_perbulan = partial.cicilanPerbulan;
    if (partial.statusPengajuan) orm.status_pengajuan = partial.statusPengajuan;
    if (partial.validasiPengajuan !== undefined) orm.validasi_pengajuan = partial.validasiPengajuan;
    if (partial.catatan) orm.catatan = partial.catatan;
    if (partial.catatanSpv) orm.catatan_spv = partial.catatanSpv;
    if (partial.catatanMarketing) orm.catatan_marketing = partial.catatanMarketing;
    if (partial.isBanding !== undefined) orm.is_banding = partial.isBanding;
    if (partial.alasanBanding) orm.alasan_banding = partial.alasanBanding;
    if (partial.createdAt) orm.created_at = partial.createdAt;
    if (partial.updatedAt) orm.updated_at = partial.updatedAt;
    if (partial.deletedAt) orm.deleted_at = partial.deletedAt;
    return orm;
  }

  async findById(id: number): Promise<LoanApplicationExternal | null> {
    const orm = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<LoanApplicationExternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { nasabah: { id: nasabahId } },
      relations: ['nasabah'],
    });
    return ormEntities.map((e) => this.toDomain(e));
  }

  async findAll(): Promise<LoanApplicationExternal[]> {
    const ormEntities = await this.ormRepository.find({ relations: ['nasabah'] });
    return ormEntities.map((e) => this.toDomain(e));
  }

  async save(data: LoanApplicationExternal): Promise<LoanApplicationExternal> {
    const saved = await this.ormRepository.save(this.toOrm(data));
    return this.toDomain(saved as LoanApplicationExternal_ORM_Entity);
  }

  async update(
    id: number,
    data: Partial<LoanApplicationExternal>,
  ): Promise<LoanApplicationExternal> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    if (!updated) throw new Error('LoanApplicationExternal not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
