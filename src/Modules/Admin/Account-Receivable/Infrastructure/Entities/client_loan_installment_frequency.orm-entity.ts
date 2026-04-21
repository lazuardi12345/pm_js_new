import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { ClientLoanInstallmentInternal_ORM_Entity } from './client_loan_installment_internal.orm-entity';
import { ClientLoanInstallment_ORM_Entity } from './client_loan_installment.orm-entity';
import { PayType } from 'src/Shared/Enums/Admins/Account-Receivable/PayType';
import { FrequencyStatus } from 'src/Shared/Enums/Admins/Account-Receivable/FrequencyStatus';
import { LoanAggrement_ORM_Entity } from 'src/Modules/Admin/Contracts/Infrastructure/Entities/loan-agreement.orm-entity';

@Entity('client_loan_installment_frequency')
@Index('IDX_FREQ_CLIENT_STATUS_DELETED', [
  'client_id',
  'frequency_status',
  'deleted_at',
])
export class ClientInstallmentFrequency_ORM_Entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bigint', nullable: true })
  loan_agreement_id: number;

  @Column({ type: 'char', length: 15, nullable: true })
  nomor_kontrak: string;

  @Column({ type: 'int' })
  loan_frequency: number;

  @Column({ type: 'date' })
  application_date: Date;

  @Column({ type: 'date', nullable: true })
  expected_payout_date?: Date | null;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  loan_amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  revenue_forecast: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  outstanding_receivable_total: number;

  @Column({ type: 'int', comment: 'Tenor in months' })
  loan_tenor: number;

  @Column({ type: 'enum', enum: PayType })
  pay_type: PayType;

  @Column({
    type: 'enum',
    enum: FrequencyStatus,
    default: FrequencyStatus.ON_GOING,
    comment: 'Status keseluruhan frekuensi pinjaman ini',
  })
  frequency_status: FrequencyStatus;

  @Column({ type: 'uuid' })
  client_id: string;

  @ManyToOne(
    () => ClientLoanInstallmentInternal_ORM_Entity,
    (client) => client.loan_frequencies,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'client_id' })
  client: ClientLoanInstallmentInternal_ORM_Entity;

  @ManyToOne(
    () => LoanAggrement_ORM_Entity,
    (agreement) => agreement.frequencies,
    { onDelete: 'SET NULL' },
  )
  @JoinColumn({ name: 'loan_agreement_id' })
  loan_agreement: LoanAggrement_ORM_Entity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => ClientLoanInstallment_ORM_Entity,
    (installment) => installment.frequency,
  )
  installments: ClientLoanInstallment_ORM_Entity[];
}
