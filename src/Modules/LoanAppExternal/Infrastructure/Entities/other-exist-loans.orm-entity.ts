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
  OneToMany,
} from 'typeorm';
import { ClientExternal_ORM_Entity } from './client-external.orm-entity';
import { CicilanLainEnum } from 'src/Shared/Enums/External/Other-Exist-Loans.enum';
import { DetailInstallmentItemsExternal_ORM_Entity } from './detail-installment-items.orm-entity';
import { LoanApplicationExternal_ORM_Entity } from './loan-application-external.orm-entity';

@Entity('other_exist_loans_external')
export class OtherExistLoansExternal_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'enum', enum: CicilanLainEnum })
  cicilan_lain: CicilanLainEnum;

  //? Ini ke Pengajuan External ID
  @OneToOne(
    () => LoanApplicationExternal_ORM_Entity,
    (loanAppExternal) => loanAppExternal.otherExistLoans,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'loan_application_external_id',
    foreignKeyConstraintName: 'FK_ClientExternalID_at_OtherExistLoansExternal',
  })
  loanAppExternal: LoanApplicationExternal_ORM_Entity;

  //? Ini ke Data Data Cicilan
  @OneToMany(
    () => DetailInstallmentItemsExternal_ORM_Entity,
    (detail) => detail.otherExistLoan,
    { cascade: true },
  )
  detailInstallments: DetailInstallmentItemsExternal_ORM_Entity[];

  @Column({
    type: 'tinyint',
    width: 1,
    nullable: true,
    transformer: {
      to(value: boolean): number {
        return value ? 1 : 0;
      },
      from(value: number): boolean {
        return value === 1;
      },
    },
  })
  validasi_pinjaman_lain?: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  catatan?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
