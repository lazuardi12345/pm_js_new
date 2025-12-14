// Infrastructure/Repositories/repayment-data.repository.impl.ts
// ! MODULE CONTRACT
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepaymentData } from '../../Domain/Entities/repayment-data.entity';
import { IRepaymentDataRepository } from '../../Domain/Repositories/repayment-data.repository';
import { RepaymentData_ORM_Entity } from '../Entities/repayment-data.orm-entity';

@Injectable()
export class RepaymentDataRepositoryImpl implements IRepaymentDataRepository {
  constructor(
    @InjectRepository(RepaymentData_ORM_Entity)
    private readonly ormRepository: Repository<RepaymentData_ORM_Entity>,
  ) {}

  private toDomain(entity: RepaymentData_ORM_Entity): RepaymentData {
    return new RepaymentData(
      entity.id_pinjam,
      entity.nama_konsumen,
      entity.divisi,
      entity.tgl_pencairan,
      Number(entity.pokok_pinjaman),
      entity.jumlah_tenor_seharusnya,
      Number(entity.cicilan_per_bulan),
      entity.pinjaman_ke,
      entity.sisa_tenor,
      Number(entity.sisa_pinjaman),
      entity.id,
      entity.created_at ?? undefined,
      entity.updated_at ?? undefined,
    );
  }

  private toOrm(domain: RepaymentData): Partial<RepaymentData_ORM_Entity> {
    return {
      id: domain.id ?? undefined,
      id_pinjam: domain.id_pinjam,
      nama_konsumen: domain.nama_konsumen,
      divisi: domain.divisi,
      tgl_pencairan: domain.tgl_pencairan,
      pokok_pinjaman: domain.pokok_pinjaman,
      jumlah_tenor_seharusnya: domain.jumlah_tenor_seharusnya,
      cicilan_per_bulan: domain.cicilan_per_bulan,
      pinjaman_ke: domain.pinjaman_ke,
      sisa_tenor: domain.sisa_tenor,
      sisa_pinjaman: domain.sisa_pinjaman,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
    };
  }

  private toOrmPartial(
    partial: Partial<RepaymentData>,
  ): Partial<RepaymentData_ORM_Entity> {
    const ormData: Partial<RepaymentData_ORM_Entity> = {};
    if (partial.id_pinjam) ormData.id_pinjam = partial.id_pinjam;
    if (partial.nama_konsumen) ormData.nama_konsumen = partial.nama_konsumen;
    if (partial.divisi) ormData.divisi = partial.divisi;
    if (partial.tgl_pencairan) ormData.tgl_pencairan = partial.tgl_pencairan;
    if (partial.pokok_pinjaman !== undefined)
      ormData.pokok_pinjaman = partial.pokok_pinjaman;
    if (partial.jumlah_tenor_seharusnya)
      ormData.jumlah_tenor_seharusnya = partial.jumlah_tenor_seharusnya;
    if (partial.cicilan_per_bulan !== undefined)
      ormData.cicilan_per_bulan = partial.cicilan_per_bulan;
    if (partial.pinjaman_ke !== undefined)
      ormData.pinjaman_ke = partial.pinjaman_ke;
    if (partial.sisa_tenor) ormData.sisa_tenor = partial.sisa_tenor;
    if (partial.sisa_pinjaman !== undefined)
      ormData.sisa_pinjaman = partial.sisa_pinjaman;
    if (partial.created_at) ormData.created_at = partial.created_at;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    return ormData;
  }

  async findById(id: number): Promise<RepaymentData | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<RepaymentData[]> {
    const entities = await this.ormRepository.find();
    return entities.map((e) => this.toDomain(e));
  }

  async save(data: RepaymentData): Promise<RepaymentData> {
    const ormEntity = this.toOrm(data);
    const saved = await this.ormRepository.save(ormEntity);
    return this.toDomain(saved as RepaymentData_ORM_Entity);
  }

  async update(
    id: number,
    data: Partial<RepaymentData>,
  ): Promise<RepaymentData> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({ where: { id } });
    if (!updated) throw new Error('RepaymentData not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
