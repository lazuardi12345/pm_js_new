import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { ClientInstallmentFrequency_ORM_Entity } from './client_loan_installment_frequency.orm-entity';

@Entity('client_loan_installment_internal')
@Index('IDX_CLIENT_LOAN_INSTALLMENT_DELETED_AT', ['deleted_at'])
@Index('IDX_CLIENT_LOAN_INSTALLMENT_CREATED_AT', ['created_at'])
@Index('IDX_INTERNAL_COMPANY_DELETED', ['company_name', 'deleted_at'])
export class ClientLoanInstallmentInternal_ORM_Entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Index('IDX_CLIENT_LOAN_INSTALLMENT_INTERNAL_CLIENT_NAME_SEARCH', {
    fulltext: true,
  })
  client_name: string;

  @Column({ type: 'bigint' })
  nik: number;

  @Column({ type: 'varchar', length: 255 })
  company_name: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  original_loan_principal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  revenue_forecast: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  outstanding_receivable_total: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date | null;

  @OneToMany(() => ClientInstallmentFrequency_ORM_Entity, (freq) => freq.client)
  loan_frequencies: ClientInstallmentFrequency_ORM_Entity[];
}
