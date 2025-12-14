import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('vouchers')
export class Vouchers_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nama: string;

  @Column({ type: 'varchar', length: 255 })
  nik: string;

  @Column({ type: 'varchar', length: 255 })
  kode_voucher: string;

  @Column({ type: 'date' })
  kadaluarsa: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  type?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  saldo?: string;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  is_claim: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
