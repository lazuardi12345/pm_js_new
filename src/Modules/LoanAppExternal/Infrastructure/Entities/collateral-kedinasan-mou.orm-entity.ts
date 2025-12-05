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

  @OneToOne(
    () => LoanApplicationExternal_ORM_Entity,
    (pengajuan) => pengajuan.kedinasan_MOU,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'pengajuan_id',
    foreignKeyConstraintName:
      'FK_LoanApplicationExternalID_at_CollateralByKedinasan_MOU',
  })
  pengajuanLuar: LoanApplicationExternal_ORM_Entity;

  @Column({ nullable: true })
  instansi?: string;

  // ==========================
  // DOKUMEN UTAMA
  // ==========================
  @Column({ nullable: true })
  surat_permohonan_kredit?: string;

  @Column({ nullable: true })
  surat_pernyataan_penjamin?: string;

  @Column({ nullable: true })
  surat_persetujuan_pimpinan?: string;

  @Column({ nullable: true })
  surat_keterangan_gaji?: string;

  // ==========================
  // FOTO PENDUKUNG
  // ==========================
  @Column({ nullable: true })
  foto_form_pengajuan?: string;

  @Column({ nullable: true })
  foto_surat_kuasa_pemotongan?: string;

  @Column({ nullable: true })
  foto_surat_pernyataan_peminjam?: string;

  @Column({ nullable: true })
  foto_sk_golongan_terbaru?: string;

  @Column({ nullable: true })
  foto_keterangan_tpp?: string;

  @Column({ nullable: true })
  foto_biaya_operasional?: string;

  @Column({ nullable: true })
  foto_surat_kontrak?: string;

  @Column({ nullable: true })
  foto_rekomendasi_bendahara?: string;

  // ==========================
  // TIMESTAMP
  // ==========================
  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date | null;
}
