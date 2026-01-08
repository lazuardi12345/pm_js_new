import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { OtherExistLoansExternal_ORM_Entity } from './other-exist-loans.orm-entity';

@Entity('detail_installment_items')
export class DetailInstallmentItemsExternal_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nama_pembiayaan: string;

  @Column({ type: 'bigint', nullable: false })
  total_pinjaman: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    transformer: {
      to(value: number): number {
        return value;
      },
      from(value: string): number {
        return parseFloat(value);
      },
    },
  })
  cicilan_perbulan: number;

  @Column({ type: 'int' })
  sisa_tenor: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  @ManyToOne(
    () => OtherExistLoansExternal_ORM_Entity,
    (otherExistLoan) => otherExistLoan.detailInstallments,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'other_exist_loan_id',
  })
  otherExistLoan: OtherExistLoansExternal_ORM_Entity;
}
