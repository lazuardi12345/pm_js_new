// // Modules/address-internal.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ClientInternal_ORM_Entity } from '../Infrastructure/Entities/client-internal.orm-entity';
// import { ClientInternalRepositoryImpl } from '../Infrastructure/Repositories/client-internal.repository.impl';
// import { CLIENT_INTERNAL_REPOSITORY } from '../Domain/Repositories/client-internal.repository';
// // import { GetAddressByNasabahIdUseCase } from '../Application/Services/GetAddressByNasabahId.usecase';

// @Module({
//   imports: [TypeOrmModule.forFeature([ClientInternal_ORM_Entity])],
//   providers: [
//     {
//       provide: CLIENT_INTERNAL_REPOSITORY,
//       useClass: ClientInternalRepositoryImpl,
//     },
//     // GetAddressByNasabahIdUseCase,
//   ],
//   exports: [
//     CLIENT_INTERNAL_REPOSITORY,
//     // GetAddressByNasabahIdUseCase,
//   ],
// })
// export class ClientInternalModule {}
