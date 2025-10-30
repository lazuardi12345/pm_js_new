import { AddressInternal_ORM_Entity } from './address-internal.orm-entity';
import { LoanApplicationInternal_ORM_Entity } from './loan-application-internal.orm-entity';
import { CollateralInternal_ORM_Entity } from './collateral-internal.orm-entity';
import { FamilyInternal_ORM_Entity } from './family-internal.orm-entity';
import { JobInternal_ORM_Entity } from './job-internal.orm-entity';
import { RelativeInternal_ORM_Entity } from './relative-internal.orm-entity';
import { Users_ORM_Entity } from 'src/Modules/Users/Infrastructure/Entities/users.orm-entity';
import {
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/Internal/Clients.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';

@Entity('client_internal')
@Index('IDX_CLIENT_INTERNAL_SEARCH', ['nama_lengkap', 'no_ktp'], {
  fulltext: true,
})
export class ClientInternal_ORM_Entity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Users_ORM_Entity, (user) => user.clientInternals, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({
    name: 'marketing_id',
    foreignKeyConstraintName: 'FK_MarketingID_at_ClientInternal',
  }) // refer to kolom FK di atas
  marketing: Users_ORM_Entity;

  @Column()
  nama_lengkap: string;

  @Column()
  no_ktp: string;

  @Column({ type: 'enum', enum: GENDER })
  jenis_kelamin: GENDER;

  @Column()
  tempat_lahir: string;

  @Column({ type: 'date' })
  tanggal_lahir: Date;

  @Column({ type: 'tinyint', default: 0 })
  enable_edit: boolean;

  @Column({ nullable: true })
  points?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;

  // * CLIENTS (nasabah_id_dalam) RELATIONSHIPS TO ANOTHER ENTITIES
  @OneToMany(
    () => AddressInternal_ORM_Entity,
    (addressInternal) => addressInternal.nasabah,
  )
  addressInternal: AddressInternal_ORM_Entity[];
  @OneToMany(
    () => CollateralInternal_ORM_Entity,
    (collateralInternal) => collateralInternal.nasabah_id,
  )
  collateralInternal: CollateralInternal_ORM_Entity[];
  @OneToMany(
    () => FamilyInternal_ORM_Entity,
    (familyInternal) => familyInternal.nasabah,
  )
  familyInternal: FamilyInternal_ORM_Entity[];
  @OneToMany(
    () => RelativeInternal_ORM_Entity,
    (relativeInternal) => relativeInternal.nasabah,
  )
  relativeInternal: RelativeInternal_ORM_Entity[];
  @OneToMany(() => JobInternal_ORM_Entity, (jobInternal) => jobInternal.nasabah)
  jobInternal: JobInternal_ORM_Entity[];
  @OneToMany(
    () => LoanApplicationInternal_ORM_Entity,
    (loanApplicationInternal) => loanApplicationInternal.nasabah,
  )
  applicationInfoInternal: LoanApplicationInternal_ORM_Entity[];
}
