import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ModuleLoanApplicationInternal } from './Modules/LoanAppInternal/ModuleLoanApplicationInternal.module';
import { ModuleLoanApplicationExternal } from './Modules/LoanAppExternal/ModuleLoanApplicationExternal.module';
import { AllTypeAdminsModule } from './Modules/Admin/ModuleAllTypeAdmins.module';
import { UsersModule } from './Modules/Users/ModuleUsers.module';
import { AuthModule } from './Shared/Modules/Authentication/ModuleAuth.module';
import { DraftsModule } from './Shared/Modules/Drafts/ModuleDrafts.module';
import { NotificationsModule } from './Shared/Modules/Notifications/ModuleNotification.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketingInternalUseCaseModule } from './Modules/Users/Roles/Marketing-Internal/marketing-internal.module';
import { SupervisorInternalUseCaseModule } from './Modules/Users/Roles/Supervisor-Internal/supervisor-internal.module';
import { PersistenceLoanAppModule } from './Modules/LoanAppInternal/PersistenceLoanAppModule.module';
import { CreditAnalystInternalUseCaseModule } from './Modules/Users/Roles/CreditAnalyst-Internal/credit-analyst-internal.module';
import { HeadMarketingInternalUsecaseModule } from './Modules/Users/Roles/Head-Marketing-Internal/head-marketing-internal-module';

import { FileSystemStorageModules } from './Shared/Modules/Storage/ModuleStorage.module';
@Module({
  imports: [
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
      // logging: true, // ini buat lihat query yg dijalankan
    }),

    //? --- MongoDB Connection ---
    MongooseModule.forRoot(
      process.env.MONGO_URI
        ? process.env.MONGO_URI
        : 'mongodb://root:root@192.182.6.69:27017',
      {
        connectionName: 'mongoConnection', // kasih nama juga
      },
    ),

    //? --- Static Files ---
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // path fisik folder
      serveRoot: '/uploads', // URL prefix
    }),

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
    SupervisorInternalUseCaseModule,
    CreditAnalystInternalUseCaseModule,
    HeadMarketingInternalUsecaseModule,

    //? --- Persistence Config Modules ---
    PersistenceLoanAppModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
