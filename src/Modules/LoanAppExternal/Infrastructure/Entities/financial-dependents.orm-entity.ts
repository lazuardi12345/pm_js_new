import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ClientExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/client-external.orm-entity';

@Entity('financial_dependents_external')
export class FinancialDependentsExternal_ORM_Entity {
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
    foreignKeyConstraintName:
      'FK_ClientExternalID_at_FinancialDependentsExternal',
  })
  nasabah: ClientExternal_ORM_Entity;

  @Column({ type: 'longtext', nullable: true })
  kondisi_tanggungan?: string;

  @Column({ type: 'tinyint', width: 1, nullable: true })
  validasi_tanggungan?: boolean;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;
}
