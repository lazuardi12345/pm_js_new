import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ModuleLoanApplicationInternal } from './Modules/LoanAppInternal/ModuleLoanApplicationInternal.module';
import { ModuleLoanApplicationExternal } from './Modules/LoanAppExternal/ModuleLoanApplicationExternal.module';
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
import { HeadMarkertingInternalUsecaseModel } from './Modules/Users/Roles/Head-Marketing-Internal/head-marketing-internal-module';

@Module({
  imports: [
    //? --- MySQL Connection ---
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '192.182.6.69',
      port: 3306,
      username: 'ardi',
      password: 'ardi@IT25',
      database: process.env.DB_DEV || 'pm_js_test',
      autoLoadEntities: true,
      synchronize: true,
      // logging: true, // ini buat lihat query yg dijalankan
    }),

    //? --- MongoDB Connection ---
    MongooseModule.forRoot('mongodb://localhost:27017/pm_js', {
      connectionName: 'mongoConnection', // kasih nama juga
    }),

    //? --- Static Files ---
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // path fisik folder
      serveRoot: '/uploads', // URL prefix
    }),

    //? --- Boundaries Modules ---
    ModuleLoanApplicationInternal,
    ModuleLoanApplicationExternal,
    UsersModule,
    AuthModule,
    DraftsModule,
    NotificationsModule,
    
    //? --- All Use Cases ---
    MarketingInternalUseCaseModule,
    SupervisorInternalUseCaseModule,
    CreditAnalystInternalUseCaseModule,
    HeadMarkertingInternalUsecaseModel,

    //? --- Persistence Config Modules ---
    PersistenceLoanAppModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
