import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/External/Client-External.enum';
import { Users_ORM_Entity } from 'src/Modules/Users/Infrastructure/Entities/users.orm-entity';
import { AddressExternal_ORM_Entity } from './address-external.orm-entity';
import { EmergencyContactExternal_ORM_Entity } from './emergency-contact.orm-entity';
import { JobExternal_ORM_Entity } from './job.orm-entity';
import { LoanApplicationExternal_ORM_Entity } from './loan-application-external.orm-entity';
import { LoanGuarantorExternal_ORM_Entity } from './loan-guarantor.orm-entity';
import { FinancialDependentsExternal_ORM_Entity } from './financial-dependents.orm-entity';
import { IsNumber, IsOptional } from 'class-validator';

@Entity('client_external')
export class ClientExternal_ORM_Entity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Users_ORM_Entity, (user) => user.clientExternals, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({
    name: 'marketing_id',
    foreignKeyConstraintName: 'FK_MarketingID_at_ClientExternal',
  })
  marketing: Users_ORM_Entity;

  @Column()
  nama_lengkap: string;

  @Column({ type: 'bigint' })
  @IsNumber()
  nik: number;

  @Column()
  no_kk: string;

  @Column()
  tempat_lahir: string;

  @Column({ type: 'date' })
  tanggal_lahir: Date;

  @Column({ default: 0 })
  @IsNumber()
  @IsOptional()
  points?: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;

  @OneToMany(() => AddressExternal_ORM_Entity, (address) => address.nasabah, {
    cascade: true,
  })
  alamatNasabahLuars: AddressExternal_ORM_Entity[];

  @OneToMany(
    () => EmergencyContactExternal_ORM_Entity,
    (emergencyContactExternal) => emergencyContactExternal.nasabah,
  )
  kontakDaruratNasabahLuars: EmergencyContactExternal_ORM_Entity[];

  @OneToMany(() => JobExternal_ORM_Entity, (jobExternal) => jobExternal.nasabah)
  pekerjaanNasabahLuars: JobExternal_ORM_Entity[];

  @OneToMany(
    () => LoanApplicationExternal_ORM_Entity,
    (loanApplicationsExternal) => loanApplicationsExternal.nasabah,
  )
  loanApplications: LoanApplicationExternal_ORM_Entity[];

  @OneToMany(
    () => LoanGuarantorExternal_ORM_Entity,
    (loanGuarantorExternal) => loanGuarantorExternal.nasabah,
  )
  loanGuarantors: LoanGuarantorExternal_ORM_Entity[];

  @OneToMany(
    () => FinancialDependentsExternal_ORM_Entity,
    (financialDependentsExternal) => financialDependentsExternal.nasabah,
  )
  financialDependents: FinancialDependentsExternal_ORM_Entity;
}
