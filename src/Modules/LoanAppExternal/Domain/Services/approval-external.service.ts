// // Modules/address-internal.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ApprovalInternal_ORM_Entity } from '../Infrastructure/Entities/approval-internal.orm-entity';
// import { ApprovalInternalRepositoryImpl } from '../Infrastructure/Repositories/approval-internal.repo.impl';
// import { APPROVAL_INTERNAL_REPOSITORY } from '../Domain/Repositories/approval-internal.repository';
// import { LoanApplicationInternal_ORM_Entity } from '../Infrastructure/Entities/loan-application-internal.orm-entity';
// import { Users_ORM_Entity } from 'src/Modules/Users/Infrastructure/Entities/users.orm-entity';
// // import { GetAddressByNasabahIdUseCase } from '../Application/Services/GetAddressByNasabahId.usecase';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([
//       ApprovalInternal_ORM_Entity,
//       LoanApplicationInternal_ORM_Entity,
//       Users_ORM_Entity,
//     ]),
//   ],
//   providers: [
//     {
//       provide: APPROVAL_INTERNAL_REPOSITORY,
//       useClass: ApprovalInternalRepositoryImpl,
//     },
//   ],
//   exports: [APPROVAL_INTERNAL_REPOSITORY],
// })
// export class ApprovalInternalModule {}
