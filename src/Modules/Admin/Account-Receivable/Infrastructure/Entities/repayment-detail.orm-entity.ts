import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('repayment_detail')
export class RepaymentData_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'int' })
  repayment_data_id: number;

  @Column({ type: 'int' })
  month_sequence: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  actual_repayment_amount: number;

  @Column({ type: 'date' })
  due_date: Date;

  @Column({ type: 'boolean', default: false })
  is_fully_paid: boolean;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
