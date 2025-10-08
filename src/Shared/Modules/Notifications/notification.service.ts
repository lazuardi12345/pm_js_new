// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Notification } from './entities/notification.entity';
// import { CreateNotificationDto } from './dto/create-notification.dto';

// @Injectable()
// export class NotificationService {
//   constructor(
//     @InjectRepository(Notification)
//     private notificationRepository: Repository<Notification>,
//   ) {}

//   async create(dto: CreateNotificationDto) {
//     const newNotif = this.notificationRepository.create({
//       user_id: dto.user_id,
//       pengajuan_dalam_id: dto.pengajuan_dalam_id,
//       pengajuan_luar_id: dto.pengajuan_luar_id,
//       is_read: dto.is_read ?? false,
//       message: dto.message,
//       created_at: new Date(),
//     });

//     return this.notificationRepository.save(newNotif);
//   }

//   async findAll() {
//     return this.notificationRepository.find({
//       relations: ['user', 'pengajuan_dalam', 'pengajuan_luar'],
//       order: { created_at: 'DESC' },
//     });
//   }

//   async findOne(id: number) {
//     const notif = await this.notificationRepository.findOne({
//       where: { id },
//       relations: ['user', 'pengajuan_dalam', 'pengajuan_luar'],
//     });

//     if (!notif) {
//       throw new NotFoundException(`Notification with ID ${id} not found`);
//     }

//     return notif;
//   }

//   async markAsRead(id: number) {
//     const notif = await this.findOne(id);
//     notif.is_read = true;
//     return this.notificationRepository.save(notif);
//   }

//   async remove(id: number) {
//     const notif = await this.findOne(id);
//     await this.notificationRepository.softDelete(notif.id);
//     return;
//   }
// }
