// import { Injectable, Inject } from '@nestjs/common';
// IRepaymentDataExternalRepository
// import { OtherExistLoansExternal } from '../../Domain/Entities/other-exist-loans-external.entity';
// import { CreateOtherExistLoansExternalDto } from '../DTOS/dto-Other-Exist-Loans/create-other-exist-loans.dto';
// import { UpdateOtherExistLoansExternalDto } from '../DTOS/dto-Other-Exist-Loans/update-other-exist-loans.dto';
// export class EmergencyContactExternalService {
//   constructor(
//     @Inject(OTHER_EXIST_LOANS_EXTERNAL_REPOSITORY)
//     private readonly repo: IOtherExistLoansExternalRepository,
//   ) {}

//   async create(
//     dto: CreateOtherExistLoansExternalDto,
//   ): Promise<OtherExistLoansExternal> {
//     const now = new Date();

//     const address = new OtherExistLoansExternal(
//       dto.nasabah_id, // nasabahId
//       dto.cicilan_lain, // cicilanLain
//       dto.nama_pembiayaan, // namaPembiayaan
//       dto.cicilan_perbulan, // cicilanPerbulan
//       dto.sisa_tenor, // sisaTenor
//       undefined, // id (optional)
//       dto.total_pinjaman, // totalPinjaman (optional)
//       dto.validasi_pinjaman_lain, // validasiPinjamanLain (optional)
//       dto.catatan, // catatan (optional)
//       now, // createdAt
//       now, // updatedAt
//       undefined,
//     );
//     return this.repo.save(address);
//   }

//   async update(
//     id: number,
//     dto: UpdateOtherExistLoansExternalDto,
//   ): Promise<OtherExistLoansExternal> {
//     return this.repo.update(id, dto);
//   }

//   async findById(id: number): Promise<OtherExistLoansExternal | null> {
//     return this.repo.findById(id);
//   }

//   async findAll(): Promise<OtherExistLoansExternal[]> {
//     return this.repo.findAll();
//   }

//   async delete(id: number): Promise<void> {
//     return this.repo.delete(id);
//   }
// }
