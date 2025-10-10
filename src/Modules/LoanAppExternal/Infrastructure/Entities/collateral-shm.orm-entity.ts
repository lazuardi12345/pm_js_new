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

  @OneToOne(() => LoanApplicationExternal_ORM_Entity, (pengajuan) => pengajuan.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pengajuan_id', foreignKeyConstraintName: 'FK_LoanApplicationExternalID_at_CollateralBySHM' })
  pengajuan: LoanApplicationExternal_ORM_Entity;

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

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date | null;
}
