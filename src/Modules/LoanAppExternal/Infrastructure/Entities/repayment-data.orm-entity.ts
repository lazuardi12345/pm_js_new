import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('repayment_data')
export class RepaymentData_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  id_pinjam: string;

  @Column({ type: 'varchar', length: 255 })
  nama_konsumen: string;

  @Column({ type: 'varchar', length: 255, default: 'Bukan Borongan' })
  divisi: string;

  @Column({ type: 'date' })
  tgl_pencairan: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  pokok_pinjaman: number;

  @Column({ type: 'varchar', length: 255 })
  jumlah_tenor_seharusnya: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  cicilan_perbulan: number;

  @Column({ type: 'int' })
  pinjaman_ke: number;

  @Column({ type: 'varchar', length: 255 })
  sisa_tenor: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  sisa_pinjaman: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;
}
