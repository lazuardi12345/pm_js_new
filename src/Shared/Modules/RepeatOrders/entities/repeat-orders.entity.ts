// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
//   DeleteDateColumn,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';
// import { User } from '../../Modules/Users/Domain/Entities/user.entity';

// export enum StatusKonsumenEnum {
//   BARU = 'baru',
//   LAMA = 'lama',
// }

// @Entity('repeat_order')
// export class RepeatOrders {
//   @PrimaryGeneratedColumn({ type: 'bigint' })
//   id: number;

//   @ManyToOne(() => User, (user) => user.id, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({ name: 'marketing_id', foreignKeyConstraintName: 'FK_MarketingID_at_RepeatOrders' })
//   marketing: User;

//   @Column({ type: 'varchar', length: 255 })
//   nama_lengkap: string;

//   @Column({ type: 'varchar', length: 255 })
//   nik: string;

//   @Column({ type: 'varchar', length: 255 })
//   no_hp: string;

//   @Column({ type: 'decimal', precision: 15, scale: 2 })
//   nominal_pinjaman: number;

//   @Column({ type: 'int' })
//   tenor: number;

//   @Column({ type: 'int' })
//   pinjaman_ke: number;

//   @Column({ type: 'varchar', length: 255 })
//   nama_marketing: string;

//   @Column({ type: 'enum', enum: StatusKonsumenEnum })
//   status_konsumen: StatusKonsumenEnum;

//   @Column({ type: 'longtext', nullable: true })
//   alasan_topup?: string;

//   @Column({ type: 'tinyint', width: 1, default: 0 })
//   is_clear: boolean;

//   @CreateDateColumn({ type: 'timestamp', nullable: true })
//   created_at?: Date;

//   @UpdateDateColumn({ type: 'timestamp', nullable: true })
//   updated_at?: Date;

//   @DeleteDateColumn({ type: 'timestamp', nullable: true })
//   deleted_at?: Date;
// }
