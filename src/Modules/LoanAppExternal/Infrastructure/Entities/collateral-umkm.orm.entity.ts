import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { LoanApplicationExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/loan-application-external.orm-entity';

@Entity({ name: 'collateral_by_umkm' })
export class CollateralByUMKM_ORM_Entity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LoanApplicationExternal_ORM_Entity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'pengajuan_id',
    foreignKeyConstraintName: 'FK_LoanApplicationExternal_at_CollateralByUMKM',
  })
  pengajuanLuar: LoanApplicationExternal_ORM_Entity;

  @Column({ name: 'foto_sku', type: 'varchar', length: 255, nullable: true })
  foto_sku?: string;

  // Gunakan JSON karena berisi array string (link foto)
  @Column({ name: 'foto_usaha', type: 'json', nullable: true })
  foto_usaha?: string[];

  @Column({
    name: 'foto_pembukuan',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  foto_pembukuan?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
