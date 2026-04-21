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
import { ClientLoanInstallment_ORM_Entity } from './client_loan_installment.orm-entity';

@Entity('client_loan_installment_detail')
export class ClientLoanInstallmentDetail_ORM_Entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount_paid: number;

  @Column({ type: 'date' })
  pay_date: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  pay_description: string;

  // FK → tbl_client_loan_installment
  @Column({ type: 'uuid' })
  installment_id: string;

  @ManyToOne(
    () => ClientLoanInstallment_ORM_Entity,
    (installment) => installment.payment_details,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'installment_id' })
  installment: ClientLoanInstallment_ORM_Entity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date | null;
}
