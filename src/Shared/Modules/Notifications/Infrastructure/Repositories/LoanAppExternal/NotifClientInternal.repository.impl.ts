import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INotificationLoanApplicationRepository } from '../../../Domain/Repositories/Notif_LoanApp.repository';
import { NotificationLoanApplicationEntity } from '../../../Domain/Entities/Notif_LoanApp.entity';
import { NotificationDocument, Notification } from '../../Schemas/LoanAppInternal/Notif_LoanApp.schemas';

@Injectable()
export class NotifLoanApplicationRepositoryImpl
  implements INotificationLoanApplicationRepository
{
  constructor(
    @InjectModel(Notification.name, 'mongoConnection')
    private readonly notifLoanAppModel: Model<NotificationDocument>,
  ) {}

  async create(
    data: Partial<NotificationLoanApplicationEntity>,
  ): Promise<NotificationLoanApplicationEntity> {
    const created = new this.notifLoanAppModel(data);
    const saved = await created.save();
    return new NotificationLoanApplicationEntity(saved.toObject());
  }

  async findById(id: string): Promise<NotificationLoanApplicationEntity | null> {
    const found = await this.notifLoanAppModel.findById(id).exec();
    return found ? new NotificationLoanApplicationEntity(found.toObject()) : null;
  }

  async findByMarketingId(
    marketingId: number,
  ): Promise<NotificationLoanApplicationEntity[]> {
    console.log('Repository: Finding by marketing ID:', marketingId);
    const list = await this.notifLoanAppModel
      .find({ marketing_id: marketingId })
      .exec();
    return list.map((doc) => new NotificationLoanApplicationEntity(doc.toObject()));
  }

  async patchUpdateNotificationById(
    id: string,
    updateData: Partial<NotificationLoanApplicationEntity>,
  ): Promise<NotificationLoanApplicationEntity | null> {
    const updated = await this.notifLoanAppModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    return updated ? new NotificationLoanApplicationEntity(updated.toObject()) : null;
  }

//   async softDelete(id: string): Promise<void> {
//     await this.notifLoanAppModel.findByIdAndUpdate(id, { isDeleted: true }).exec();
//   }
}
