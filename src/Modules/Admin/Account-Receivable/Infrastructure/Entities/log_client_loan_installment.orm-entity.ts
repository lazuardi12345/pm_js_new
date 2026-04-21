// Infrastructure/Entities/log_client_loan_installment_status.orm-entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ClientLoanInstallment_ORM_Entity } from './client_loan_installment.orm-entity';
import { InstallmentStatus } from 'src/Shared/Enums/Admins/Account-Receivable/InstallmentStatus';

@Entity('log_client_loan_installment')
export class LogClientLoanInstallment_ORM_Entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  installment_id: string;

  @ManyToOne(() => ClientLoanInstallment_ORM_Entity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'installment_id' })
  installment: ClientLoanInstallment_ORM_Entity;

  @Column({ type: 'enum', enum: InstallmentStatus })
  previous_status: InstallmentStatus;

  @Column({ type: 'enum', enum: InstallmentStatus })
  new_status: InstallmentStatus;

  @Column({ type: 'int' })
  changer_id: number; // user.id dari token

  @Column({ type: 'varchar', length: 255 })
  changed_by: string; // user.nama dari token

  @CreateDateColumn()
  changed_at: Date;
}
