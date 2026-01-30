import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationClientService } from './Infrastructure/Services/notification.service';

@Module({
  imports: [
    ConfigModule, // karena NotificationClientService pakai ConfigService
  ],
  providers: [NotificationClientService],
  exports: [NotificationClientService],
})
export class NotificationAdapterModule {}
