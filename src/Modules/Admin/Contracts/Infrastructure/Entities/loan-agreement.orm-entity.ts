import { InternalCompanyList } from 'src/Shared/Enums/Admins/Contract/loan-agreement.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Index('IDX_SEARCH_CONTRACT_BY_NAME', ['nama'], {
  fulltext: true,
})
@Entity('loan_agreement')
export class LoanAggrement_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Index('IDX_CONTRACT_NUMBER')
  @Column({ type: 'char', length: 15 })
  nomor_kontrak: string;

  @Column({ type: 'int', nullable: true })
  nomor_urut?: number;

  @Column({ type: 'varchar', length: 255 })
  nama: string;

  @Column({ type: 'text' })
  alamat: string;

  @Index('IDX_CLIENT_RESIDENT_ID')
  @Column({ type: 'bigint' })
  no_ktp: number;

  @Column({ type: 'char', length: 50 })
  type: string;

  @Column({ type: 'enum', enum: InternalCompanyList, nullable: true })
  perusahaan?: InternalCompanyList;

  @Column({ type: 'char', length: 4 })
  inisial_marketing?: string;

  @Column({ type: 'char', length: 20, nullable: true })
  golongan?: string;

  @Column({ type: 'char', length: 4, nullable: true })
  inisial_ca?: string;

  @Column({ type: 'char', length: 16, nullable: true })
  id_card?: string;

  @Column({ type: 'char', length: 25, nullable: true })
  kedinasan?: string;

  @Column({ type: 'int', nullable: true })
  pinjaman_ke?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  pokok_pinjaman: number;

  @Column({ type: 'int' })
  tenor: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  biaya_admin: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  cicilan: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  biaya_layanan: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  bunga: number;

  @Column({ type: 'date' })
  tanggal_jatuh_tempo: Date;

  @Column({ type: 'text', nullable: true })
  catatan?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
