import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ClientExternal_ORM_Entity } from './client-external.orm-entity';
import { CicilanLainEnum } from 'src/Shared/Enums/External/Other-Exist-Loans.enum';

@Entity('other_exist_loans_external')
export class OtherExistLoansExternal_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(
    () => ClientExternal_ORM_Entity,
    (clientExternal) => clientExternal.id,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'nasabah_id',
    foreignKeyConstraintName: 'FK_ClientExternalID_at_OtherExistLoansExternal',
  })
  nasabah: ClientExternal_ORM_Entity;

  @Column({ type: 'enum', enum: CicilanLainEnum })
  cicilan_lain: CicilanLainEnum;

  @Column({ type: 'varchar', length: 255 })
  nama_pembiayaan: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  total_pinjaman?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  cicilan_perbulan: number;

  @Column({ type: 'int' })
  sisa_tenor: number;

  @Column({ type: 'tinyint', width: 1, nullable: true })
  validasi_pinjaman_lain?: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  catatan?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
