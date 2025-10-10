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
  @JoinColumn({ name: 'pengajuan_id', foreignKeyConstraintName: 'FK_LoanApplicationExternalID_at_CollateralByBPKB' })
  pengajuan: LoanApplicationExternal_ORM_Entity;

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
  no_mesin?: string;

  @Column({ nullable: true })
  no_bpkb?: string;

  @Column({ nullable: true })
  foto_stnk?: string;

  @Column({ nullable: true })
  foto_bpkb?: string;

  @Column({ nullable: true })
  foto_motor?: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date | null;
}
