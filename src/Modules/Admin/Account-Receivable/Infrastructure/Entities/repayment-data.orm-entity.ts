import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('repayment_data')
export class RepaymentData_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'char', length: 10 })
  contract_unique_id: string;

  @Column({ type: 'varchar', length: 255 })
  applicant_name: string;

  @Column({ type: 'varchar', length: 255, default: 'Bukan Borongan' })
  division: string;

  @Column({ type: 'date' })
  disbursement_date: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  discount: number;

  @Column({ type: 'boolean', default: false })
  is_deprecated: boolean;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
