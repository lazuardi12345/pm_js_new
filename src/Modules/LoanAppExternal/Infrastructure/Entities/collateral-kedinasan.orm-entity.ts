import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { LoanApplicationExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/loan-application-external.orm-entity';

@Entity('collateral_by_kedinasan')
export class CollateralByKedinasan_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @OneToOne(() => LoanApplicationExternal_ORM_Entity, (pengajuan) => pengajuan.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pengajuan_id', foreignKeyConstraintName: 'FK_LoanApplicationExternalID_at_CollateralByKedinasan' })
  pengajuan: LoanApplicationExternal_ORM_Entity;

  @Column({ nullable: true })
  instansi?: string;

  @Column({ nullable: true })
  surat_permohonan_kredit?: string;

  @Column({ nullable: true })
  surat_pernyataan_penjamin?: string;

  @Column({ nullable: true })
  surat_persetujuan_pimpinan?: string;

  @Column({ nullable: true })
  surat_keterangan_gaji?: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date | null;
}
