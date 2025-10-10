// // Modules/address-internal.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { LoanApplicationInternal_ORM_Entity } from '../Infrastructure/Entities/loan-application-internal.orm-entity';
// import { LoanApplicationInternalRepositoryImpl } from '../Infrastructure/Repositories/loanApp-internal.repository.impl';
// import { LOAN_APPLICATION_INTERNAL_REPOSITORY } from '../Domain/Repositories/loanApp-internal.repository';

// @Module({
//   imports: [TypeOrmModule.forFeature([LoanApplicationInternal_ORM_Entity])],
//   providers: [
//     {
//       provide: LOAN_APPLICATION_INTERNAL_REPOSITORY,
//       useClass: LoanApplicationInternalRepositoryImpl,
//     },
//   ],
//   exports: [
//     LOAN_APPLICATION_INTERNAL_REPOSITORY,
//   ],
// })
// export class LoanApplicationInternalModule {}
