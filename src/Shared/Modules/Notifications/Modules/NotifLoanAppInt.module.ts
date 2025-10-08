import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema, Notification } from '../Infrastructure/Schemas/LoanAppInternal/Notif_LoanApp.schemas';
import { NOTIFICATION_LOAN_APPLICATION_REPOSITORY } from '../Domain/Repositories/Notif_LoanApp.repository';
import { NotifLoanApplicationRepositoryImpl } from '../Infrastructure/Repositories/LoanAppExternal/NotifClientInternal.repository.impl';
import { CreateNotifLoanApplicationUseCase } from '../Applications/Service/CreateNotifLoanApplication.usecase';
import { NotifLoanAppInternal_Controller } from '../Presentations/Controllers/NotifLoanAppInternal.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Notification.name, schema: NotificationSchema }],
      'mongoConnection', // ⬅️ harus sama dengan AppModule
    ),
  ],
  providers: [
    {
      provide: NOTIFICATION_LOAN_APPLICATION_REPOSITORY,
      useClass: NotifLoanApplicationRepositoryImpl,
    },
    CreateNotifLoanApplicationUseCase,
  ],
  controllers: [NotifLoanAppInternal_Controller],
  exports: [CreateNotifLoanApplicationUseCase],
})
export class NotifCreateLoanAppIntModule {}
