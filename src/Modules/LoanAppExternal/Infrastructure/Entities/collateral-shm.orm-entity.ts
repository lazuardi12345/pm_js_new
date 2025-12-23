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

@Entity('collateral_by_shm')
export class CollateralBySHM_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @OneToOne(
    () => LoanApplicationExternal_ORM_Entity,
    (pengajuan) => pengajuan.shm,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'pengajuan_id',
    foreignKeyConstraintName: 'FK_LoanApplicationExternalID_at_CollateralBySHM',
  })
  pengajuanLuar: LoanApplicationExternal_ORM_Entity;

  @Column({ nullable: true })
  atas_nama_shm?: string;

  @Column({ nullable: true })
  hubungan_shm?: string;

  @Column({ nullable: true })
  alamat_shm?: string;

  @Column({ nullable: true })
  luas_shm?: string;

  @Column({ nullable: true })
  njop_shm?: string;

  @Column({ nullable: true })
  foto_shm?: string;

  @Column({ nullable: true })
  foto_kk_pemilik_shm?: string;

  @Column({ nullable: true })
  foto_pbb?: string;

  @Column({ type: 'text', nullable: true })
  foto_objek_jaminan?: string; // bisa simpan array JSON string

  @Column({ nullable: true })
  foto_buku_nikah_suami_istri?: string;

  @Column({ nullable: true })
  foto_npwp?: string;

  @Column({ nullable: true })
  foto_imb?: string;

  @Column({ nullable: true })
  foto_surat_ahli_waris?: string;

  @Column({ nullable: true })
  foto_surat_akte_kematian?: string;

  @Column({ nullable: true })
  foto_surat_pernyataan_kepemilikan_tanah?: string;

  @Column({ nullable: true })
  foto_surat_pernyataan_tidak_dalam_sengketa?: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date | null;
}
