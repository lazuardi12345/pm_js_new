// Infrastructure/Repositories/repayment-data.repository.impl.ts
// ! MODULE CONTRACT
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanAgreement } from '../../Domain/Entities/loan-agreements.entity';
import { ILoanAgreementRepository } from '../../Domain/Repositories/loan-agreements-external.repository';
import { LoanAggrement_ORM_Entity } from '../Entities/loan-agreement.orm-entity';

@Injectable()
export class LoanAggrementRepositoryImpl implements ILoanAgreementRepository {
  constructor(
    @InjectRepository(LoanAggrement_ORM_Entity)
    private readonly ormRepository: Repository<LoanAggrement_ORM_Entity>,
  ) {}

  private toDomain(entity: LoanAggrement_ORM_Entity): LoanAgreement {
    return new LoanAgreement(
      entity.nomor_kontrak,
      entity.nama,
      entity.alamat,
      entity.no_ktp,
      entity.type,
      Number(entity.pokok_pinjaman),
      entity.tenor,
      Number(entity.biaya_admin),
      Number(entity.cicilan),
      Number(entity.biaya_layanan),
      Number(entity.bunga),
      entity.tanggal_jatuh_tempo,
      entity.id,
      entity.nomor_urut,
      entity.kelompok,
      entity.perusahaan,
      entity.inisial_marketing,
      entity.golongan,
      entity.inisial_ca,
      entity.id_card,
      entity.kedinasan,
      entity.pinjaman_ke,
      entity.catatan,
      entity.created_at ?? undefined,
      entity.updated_at ?? undefined,
    );
  }

  private toOrm(domain: LoanAgreement): Partial<LoanAggrement_ORM_Entity> {
    return {
      id: domain.id ?? undefined,
      nomor_kontrak: domain.nomor_kontrak,
      nama: domain.nama,
      alamat: domain.alamat,
      no_ktp: domain.no_ktp,
      type: domain.type,
      pokok_pinjaman: domain.pokok_pinjaman,
      tenor: domain.tenor,
      biaya_admin: domain.biaya_admin,
      cicilan: domain.cicilan,
      biaya_layanan: domain.biaya_layanan,
      bunga: domain.bunga,
      tanggal_jatuh_tempo: domain.tanggal_jatuh_tempo,
      nomor_urut: domain.nomor_urut,
      kelompok: domain.kelompok,
      perusahaan: domain.perusahaan,
      inisial_marketing: domain.inisial_marketing,
      golongan: domain.golongan,
      inisial_ca: domain.inisial_ca,
      id_card: domain.id_card,
      kedinasan: domain.kedinasan,
      pinjaman_ke: domain.pinjaman_ke,
      catatan: domain.catatan,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
    };
  }

  private toOrmPartial(
    partial: Partial<LoanAgreement>,
  ): Partial<LoanAggrement_ORM_Entity> {
    const ormData: Partial<LoanAggrement_ORM_Entity> = {};
    if (partial.nomor_kontrak) ormData.nomor_kontrak = partial.nomor_kontrak;
    if (partial.nama) ormData.nama = partial.nama;
    if (partial.alamat) ormData.alamat = partial.alamat;
    if (partial.no_ktp) ormData.no_ktp = partial.no_ktp;
    if (partial.type) ormData.type = partial.type;
    if (partial.pokok_pinjaman !== undefined)
      ormData.pokok_pinjaman = partial.pokok_pinjaman;
    if (partial.tenor !== undefined) ormData.tenor = partial.tenor;
    if (partial.biaya_admin !== undefined)
      ormData.biaya_admin = partial.biaya_admin;
    if (partial.cicilan !== undefined) ormData.cicilan = partial.cicilan;
    if (partial.biaya_layanan !== undefined)
      ormData.biaya_layanan = partial.biaya_layanan;
    if (partial.bunga !== undefined) ormData.bunga = partial.bunga;
    if (partial.tanggal_jatuh_tempo)
      ormData.tanggal_jatuh_tempo = partial.tanggal_jatuh_tempo;
    if (partial.nomor_urut !== undefined)
      ormData.nomor_urut = partial.nomor_urut;
    if (partial.kelompok) ormData.kelompok = partial.kelompok;
    if (partial.perusahaan) ormData.perusahaan = partial.perusahaan;
    if (partial.inisial_marketing)
      ormData.inisial_marketing = partial.inisial_marketing;
    if (partial.golongan) ormData.golongan = partial.golongan;
    if (partial.inisial_ca) ormData.inisial_ca = partial.inisial_ca;
    if (partial.id_card) ormData.id_card = partial.id_card;
    if (partial.kedinasan) ormData.kedinasan = partial.kedinasan;
    if (partial.pinjaman_ke) ormData.pinjaman_ke = partial.pinjaman_ke;
    if (partial.catatan) ormData.catatan = partial.catatan;
    if (partial.created_at) ormData.created_at = partial.created_at;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    return ormData;
  }

  async findById(id: number): Promise<LoanAgreement | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<LoanAgreement[]> {
    const entities = await this.ormRepository.find();
    return entities.map((e) => this.toDomain(e));
  }

  async save(data: LoanAgreement): Promise<LoanAgreement> {
    const ormEntity = this.toOrm(data);
    const saved = await this.ormRepository.save(ormEntity);
    return this.toDomain(saved as LoanAggrement_ORM_Entity);
  }

  async update(
    id: number,
    data: Partial<LoanAgreement>,
  ): Promise<LoanAgreement> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({ where: { id } });
    if (!updated) throw new Error('LoanAgreement not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
