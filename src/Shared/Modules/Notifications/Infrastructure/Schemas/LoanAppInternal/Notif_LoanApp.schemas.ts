import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true }) // otomatis bikin createdAt & updatedAt
export class Notification {
  @Prop({ required: true })
  user_id: number; // id user yang nerima notif

  @Prop({ required: true })
  loan_app_id: number; // id loan application terkait notif

  @Prop({ required: true })
  message: string; // isi pesan notif

  @Prop({ default: false })
  isRead: boolean; // flag kalau notif udah dibaca
}

export type NotificationDocument = HydratedDocument<Notification>;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
