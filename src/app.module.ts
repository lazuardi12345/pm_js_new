import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleLoanApplicationInternal } from './Modules/LoanAppInternal/ModuleLoanApplicationInternal.module';
import { ModuleLoanApplicationExternal } from './Modules/LoanAppExternal/ModuleLoanApplicationExternal.module';
import { AllTypeAdminsModule } from './Modules/Admin/ModuleAllTypeAdmins.module';
import { UsersModule } from './Modules/Users/ModuleUsers.module';
import { AuthModule } from './Shared/Modules/Authentication/ModuleAuth.module';
import { DraftsModule } from './Shared/Modules/Drafts/ModuleDrafts.module';
import { NotificationsModule } from './Shared/Modules/Notifications/ModuleNotification.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketingInternalUseCaseModule } from './Modules/Users/Roles/Marketing-Internal/marketing-internal.module';
import { SupervisorInternalUseCaseModule } from './Modules/Users/Roles/Supervisor-Internal/supervisor-internal.module';
import { PersistenceLoanAppModule } from './Modules/LoanAppInternal/PersistenceLoanAppModule.module';
import { CreditAnalystInternalUseCaseModule } from './Modules/Users/Roles/CreditAnalyst-Internal/credit-analyst-internal.module';
import { HeadMarketingUsecaseModule } from './Modules/Users/Roles/Head-Marketing/head-marketing.module';

import { FileSystemStorageModules } from './Shared/Modules/Storage/ModuleStorage.module';
import { AdminBICheckingUseCaseModule } from './Modules/Users/Roles/Admin/BI/admin-bi.module';
import { ConfigModule } from '@nestjs/config';
import { MarketingExternalUseCaseModule } from './Modules/Users/Roles/Marketing-External/marketing-external.module';
import { SupervisorExternalUseCaseModule } from './Modules/Users/Roles/Supervisor-External/supervisor-external.module';
import { CreditAnalystExternalUseCaseModule } from './Modules/Users/Roles/CreditAnalyst-External/credit-analyst-external.module';
import { AdminContractUseCaseModule } from './Modules/Users/Roles/Admin/Contract/admin-contract.module';
import { SurveyorExternalUseCaseModule } from './Modules/Users/Roles/Surveyor-External/surveyor-external.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    //? --- MySQL Connection ---
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_URI,
      port: 3306,
      username: process.env.MYSQL_USN,
      password: process.env.MYSQL_PWD,
      database: process.env.DB_DEV || 'pm_js_test',
      autoLoadEntities: true,
      synchronize: true,
      timezone: '+07:00',
      extra: {
        decimalNumbers: true,
      },
    }),

    //? --- MongoDB Connection ---
    MongooseModule.forRoot(
      process.env.MONGO_URI
        ? process.env.MONGO_URI
        : 'mongodb://root:root@192.182.6.69:27017',
      {
        connectionName: 'mongoConnection',
      },
    ),

    //? --- Boundaries Modules ---
    ModuleLoanApplicationInternal,
    ModuleLoanApplicationExternal,
    AllTypeAdminsModule,
    UsersModule,
    AuthModule,
    DraftsModule,
    NotificationsModule,
    FileSystemStorageModules,

    //? --- All Use Cases ---
    MarketingInternalUseCaseModule,
    MarketingExternalUseCaseModule,
    SupervisorInternalUseCaseModule,
    SupervisorExternalUseCaseModule,
    CreditAnalystInternalUseCaseModule,
    CreditAnalystExternalUseCaseModule,
    SurveyorExternalUseCaseModule,
    HeadMarketingUsecaseModule,
    AdminBICheckingUseCaseModule,
    AdminContractUseCaseModule,

    //? --- Persistence Config Modules ---
    PersistenceLoanAppModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
