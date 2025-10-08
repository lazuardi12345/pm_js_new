// Infrastructure/Persistence/persistence.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UNIT_OF_WORK } from './Domain/Repositories/IUnitOfWork.repository';
import { TypeOrmUnitOfWork } from './Infrastructure/Repositories/UnitOfWork.repository.impl';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [forwardRef(() => TypeOrmModule)],
  providers: [
    {
      provide: UNIT_OF_WORK,
      inject: [getDataSourceToken()],
      useFactory: (dataSource: DataSource) => {
        console.log('=== UnitOfWork Factory ===');
        console.log('DataSource in factory:', !!dataSource);
        console.log('DataSource isInitialized:', dataSource?.isInitialized);
        console.log('DataSource type:', typeof dataSource);

        if (!dataSource) {
          throw new Error('DataSource injection failed');
        }

        const uow = new TypeOrmUnitOfWork(dataSource);
        console.log('UnitOfWork created successfully');
        console.log('========================');
        return uow;
      },
    },
  ],
  exports: [UNIT_OF_WORK],
})
export class PersistenceLoanAppModule {}
