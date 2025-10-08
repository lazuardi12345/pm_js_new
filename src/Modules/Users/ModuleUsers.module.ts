import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users_ORM_Entity } from './Infrastructure/Entities/users.orm-entity';
import { UsersRepositoryImpl } from './Infrastructure/Repositories/users.repository.impl';
import { USERS_REPOSITORY } from './Domain/Repositories/users.repository';
import { ClientInternal_ORM_Entity } from '../LoanAppInternal/Infrastructure/Entities/client-internal.orm-entity';
import { UsersController } from './Presentation/Controllers/users.controller';
import { UsersService } from './Application/Service/Users.service';
import { ClientExternal_ORM_Entity } from '../LoanAppExternal/Infrastructure/Entities/client-external.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users_ORM_Entity, ClientInternal_ORM_Entity, ClientExternal_ORM_Entity]),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepositoryImpl,
    },
    UsersService,
  ],
  exports: [USERS_REPOSITORY, UsersService],
})
export class UsersModule {}
