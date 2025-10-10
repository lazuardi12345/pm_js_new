// import { Injectable, Inject } from '@nestjs/common';
// import {
//     ILoanAgreementsExternalRepository,
//     LOAN_AGREEMENTS_EXTERNAL_REPOSITORY,
//   } from '../../Domain/Repositories/loan-agreements-external.repository';
// import { JobExternal } from '../../Domain/Entities/job-external.entity';
// import { CreateJobExternalDto } from '../DTOS/dto-Job/create-job.dto';
// import { UpdateJobExternalDto } from '../DTOS/dto-Job/update-job.dto';
// @Injectable()
// export class EmergencyContactExternalService {
//   constructor(
//     @Inject(JOB_EXTERNAL_REPOSITORY)
//     private readonly repo: IJobExternalRepository,
//   ) {}

//   async create(dto: CreateJobExternalDto): Promise<JobExternal> {
//     const now = new Date();

//     const address = new JobExternal(
//       dto.nasabah_id, // nasabahId
//       dto.perusahaan, // perusahaan
//       dto.alamat_perusahaan, // alamatPerusahaan
//       dto.kontak_perusahaan, // kontakPerusahaan
//       dto.jabatan, // jabatan
//       dto.lama_kerja, // lamaKerja
//       dto.status_karyawan, // statusKaryawan
//       dto.pendapatan_perbulan, // pendapatanPerbulan
//       dto.slip_gaji, // slipGaji
//       dto.norek, // norek
//       dto.id_card, // idCard
//       dto.lama_kontrak, // lamaKontrak (optional)
//       dto.validasi_pekerjaan, // validasiPekerjaan (optional)
//       dto.catatan, // catatan (optional)
//       undefined, // id (optional)
//       now, // createdAt
//       now, // updatedAt
//       null, // deletedAt
//     );
//     return this.repo.save(address);
//   }

//   async update(id: number, dto: UpdateJobExternalDto): Promise<JobExternal> {
//     return this.repo.update(id, dto);
//   }

//   async findById(id: number): Promise<JobExternal | null> {
//     return this.repo.findById(id);
//   }

//   async findAll(): Promise<JobExternal[]> {
//     return this.repo.findAll();
//   }

//   async delete(id: number): Promise<void> {
//     return this.repo.delete(id);
//   }
// }
