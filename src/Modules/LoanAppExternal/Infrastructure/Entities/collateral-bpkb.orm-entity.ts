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

@Entity('collateral_by_bpkb')
export class CollateralByBPKB_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @OneToOne(() => LoanApplicationExternal_ORM_Entity, (pengajuan) => pengajuan.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'pengajuan_id',
    foreignKeyConstraintName:
      'FK_LoanApplicationExternalID_at_CollateralByBPKB',
  })
  pengajuan: LoanApplicationExternal_ORM_Entity;

  // =====================
  // Informasi dasar BPKB / STNK
  // =====================
  @Column({ nullable: true })
  atas_nama_bpkb?: string;

  @Column({ nullable: true })
  no_stnk?: string;

  @Column({ nullable: true })
  alamat_pemilik_bpkb?: string;

  @Column({ nullable: true })
  type_kendaraan?: string;

  @Column({ nullable: true })
  tahun_perakitan?: string;

  @Column({ nullable: true })
  warna_kendaraan?: string;

  @Column({ nullable: true })
  stransmisi?: string;

  @Column({ nullable: true })
  no_rangka?: string;

  @Column({ nullable: true })
  foto_no_rangka?: string;

  @Column({ nullable: true })
  no_mesin?: string;

  @Column({ nullable: true })
  foto_no_mesin?: string;

  @Column({ nullable: true })
  no_bpkb?: string;

  @Column({ nullable: true })
  dokumen_bpkb?: string; // file PDF

  // =====================
  // Foto dokumen & kendaraan
  // =====================
  @Column({ nullable: true })
  foto_stnk_depan?: string;

  @Column({ nullable: true })
  foto_stnk_belakang?: string;

  @Column({ nullable: true })
  foto_kendaraan_depan?: string;

  @Column({ nullable: true })
  foto_kendaraan_belakang?: string;

  @Column({ nullable: true })
  foto_kendaraan_samping_kanan?: string;

  @Column({ nullable: true })
  foto_kendaraan_samping_kiri?: string;

  @Column({ nullable: true })
  foto_sambara?: string;

  @Column({ nullable: true })
  foto_kwitansi_jual_beli?: string;

  @Column({ nullable: true })
  foto_ktp_tangan_pertama?: string;

  @Column({ nullable: true })
  foto_faktur_kendaraan?: string;

  @Column({ nullable: true })
  foto_snikb?: string;

  // =====================
  // Metadata
  // =====================
  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date | null;
}
