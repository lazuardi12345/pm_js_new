// // Infrastructure/Repositories/repayment-data.repository.impl.ts
//! MODULE CONTRACT
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { RepaymentData } from '../../Domain/Entities/repayment-data-external.entity';
// import { IRepay
// import { RepaymentData_ORM_Entity } from '../Entities/repayment-data.orm-entity';

// @Injectable()
// export class RepaymentDataRepositoryImpl implements IRepaymentDataRepository {
//   constructor(
//     @InjectRepository(RepaymentData_ORM_Entity)
//     private readonly ormRepository: Repository<RepaymentData_ORM_Entity>,
//   ) {}

//   private toDomain(entity: RepaymentData_ORM_Entity): RepaymentData {
//     return new RepaymentData(
//       entity.id,
//       entity.id_pinjam,
//       entity.nama_konsumen,
//       entity.divisi,
//       entity.tgl_pencairan,
//       Number(entity.pokok_pinjaman),
//       entity.jumlah_tenor_seharusnya,
//       Number(entity.cicilan_perbulan),
//       entity.pinjaman_ke,
//       entity.sisa_tenor,
//       Number(entity.sisa_pinjaman),
//       entity.created_at ?? undefined,
//       entity.updated_at ?? undefined,
//     );
//   }

//   private toOrm(domain: RepaymentData): Partial<RepaymentData_ORM_Entity> {
//     return {
//       id: domain.id ?? undefined,
//       id_pinjam: domain.idPinjam,
//       nama_konsumen: domain.namaKonsumen,
//       divisi: domain.divisi,
//       tgl_pencairan: domain.tglPencairan,
//       pokok_pinjaman: domain.pokokPinjaman,
//       jumlah_tenor_seharusnya: domain.jumlahTenorSeharusnya,
//       cicilan_perbulan: domain.cicilanPerbulan,
//       pinjaman_ke: domain.pinjamanKe,
//       sisa_tenor: domain.sisaTenor,
//       sisa_pinjaman: domain.sisaPinjaman,
//       created_at: domain.createdAt,
//       updated_at: domain.updatedAt,
//     };
//   }

//   private toOrmPartial(
//     partial: Partial<RepaymentData>,
//   ): Partial<RepaymentData_ORM_Entity> {
//     const ormData: Partial<RepaymentData_ORM_Entity> = {};
//     if (partial.idPinjam) ormData.id_pinjam = partial.idPinjam;
//     if (partial.namaKonsumen) ormData.nama_konsumen = partial.namaKonsumen;
//     if (partial.divisi) ormData.divisi = partial.divisi;
//     if (partial.tglPencairan) ormData.tgl_pencairan = partial.tglPencairan;
//     if (partial.pokokPinjaman !== undefined)
//       ormData.pokok_pinjaman = partial.pokokPinjaman;
//     if (partial.jumlahTenorSeharusnya)
//       ormData.jumlah_tenor_seharusnya = partial.jumlahTenorSeharusnya;
//     if (partial.cicilanPerbulan !== undefined)
//       ormData.cicilan_perbulan = partial.cicilanPerbulan;
//     if (partial.pinjamanKe !== undefined)
//       ormData.pinjaman_ke = partial.pinjamanKe;
//     if (partial.sisaTenor) ormData.sisa_tenor = partial.sisaTenor;
//     if (partial.sisaPinjaman !== undefined)
//       ormData.sisa_pinjaman = partial.sisaPinjaman;
//     if (partial.createdAt) ormData.created_at = partial.createdAt;
//     if (partial.updatedAt) ormData.updated_at = partial.updatedAt;
//     return ormData;
//   }

//   async findById(id: number): Promise<RepaymentData | null> {
//     const entity = await this.ormRepository.findOne({ where: { id } });
//     return entity ? this.toDomain(entity) : null;
//   }

//   async findAll(): Promise<RepaymentData[]> {
//     const entities = await this.ormRepository.find();
//     return entities.map((e) => this.toDomain(e));
//   }

//   async save(data: RepaymentData): Promise<RepaymentData> {
//     const ormEntity = this.toOrm(data);
//     const saved = await this.ormRepository.save(ormEntity);
//     return this.toDomain(saved as RepaymentData_ORM_Entity);
//   }

//   async update(id: number, data: Partial<RepaymentData>): Promise<RepaymentData> {
//     await this.ormRepository.update(id, this.toOrmPartial(data));
//     const updated = await this.ormRepository.findOne({ where: { id } });
//     if (!updated) throw new Error('RepaymentData not found');
//     return this.toDomain(updated);
//   }

//   async delete(id: number): Promise<void> {
//     await this.ormRepository.softDelete(id);
//   }
// }
