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
import { ClientInstallmentFrequency_ORM_Entity } from './client_loan_installment_frequency.orm-entity';
import { ClientLoanInstallmentDetail_ORM_Entity } from './client_loan_installment_detail.orm-entity';
import { InstallmentStatus } from 'src/Shared/Enums/Admins/Account-Receivable/InstallmentStatus';
import { InstallmentMetadata } from '../../Domain/Entities/client_loan_installment.entity';

@Entity('client_loan_installment')
@Index('IDX_INSTALLMENT_FREQ_STATUS', ['frequency_id', 'status', 'deleted_at'])
export class ClientLoanInstallment_ORM_Entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', comment: 'Nomor bulan cicilan, e.g. 1, 2, 3' })
  frequency_number: number;

  @Index('IDX_ADMIN_ACCOUNT_RECEIVABLE_CONTRACT_NUMBER')
  @Column({
    type: 'char',
    length: 15,
  })
  nomor_kontrak: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount_due: number;

  @Column({
    type: 'enum',
    enum: InstallmentStatus,
    default: InstallmentStatus.UNPAID,
  })
  status: InstallmentStatus;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Additional metadata for installment',
  })
  metadata: InstallmentMetadata;

  // FK → tbl_client_installment_frequency
  @Column({ type: 'uuid' })
  frequency_id: string;

  @ManyToOne(
    () => ClientInstallmentFrequency_ORM_Entity,
    (freq) => freq.installments,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'frequency_id' })
  frequency: ClientInstallmentFrequency_ORM_Entity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => ClientLoanInstallmentDetail_ORM_Entity,
    (detail) => detail.installment,
  )
  payment_details: ClientLoanInstallmentDetail_ORM_Entity[];
}
