// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CreateRepeatOrdersDto } from './dto/create-repeat-order.dto';
// import { RepeatOrders } from './entities/repeat-orders.entity';
// import { User } from '../Modules/Users/Domain/Entities/user.entity';

// @Injectable()
// export class RepeatOrdersService {
//   constructor(
//     @InjectRepository(RepeatOrders)
//     private repeatOrdersRepository: Repository<RepeatOrders>,

//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//   ) {}

//   async create(dto: CreateRepeatOrdersDto) {
//     const marketingUser = await this.userRepository.findOne({
//       where: { id: dto.marketing_id },
//     });

//     if (!marketingUser) {
//       throw new NotFoundException('Marketing user not found');
//     }

//     const repeatOrder = this.repeatOrdersRepository.create({
//       marketing: marketingUser,
//       nama_lengkap: dto.nama_lengkap,
//       nik: dto.nik,
//       no_hp: dto.no_hp,
//       nominal_pinjaman: dto.nominal_pinjaman,
//       tenor: dto.tenor,
//       pinjaman_ke: dto.pinjaman_ke,
//       nama_marketing: dto.nama_marketing,
//       status_konsumen: dto.status_konsumen,
//       alasan_topup: dto.alasan_topup,
//       is_clear: dto.is_clear ?? false,
//     });

//     return this.repeatOrdersRepository.save(repeatOrder);
//   }

//   async findAll() {
//     return this.repeatOrdersRepository.find({
//       relations: ['marketing'],
//     });
//   }

//   async findOne(id: number) {
//     const repeatOrder = await this.repeatOrdersRepository.findOne({
//       where: { id },
//       relations: ['marketing'],
//     });
//     if (!repeatOrder) {
//       throw new NotFoundException('Repeat order ID not found');
//     }
//     return repeatOrder;
//   }

//   async update(id: number, updateDto: Partial<CreateRepeatOrdersDto>) {
//     const order = await this.findOne(id);

//     if (updateDto.marketing_id) {
//       const marketingUser = await this.userRepository.findOne({
//         where: { id: updateDto.marketing_id },
//       });

//       if (!marketingUser) {
//         throw new NotFoundException('Marketing user not found');
//       }

//       order.marketing = marketingUser;
//     }

//     Object.assign(order, {
//       ...updateDto,
//       marketing: order.marketing,
//     });

//     return this.repeatOrdersRepository.save(order);
//   }

//   async remove(id: number) {
//     await this.repeatOrdersRepository.softDelete(id);
//     return;
//   }
// }
