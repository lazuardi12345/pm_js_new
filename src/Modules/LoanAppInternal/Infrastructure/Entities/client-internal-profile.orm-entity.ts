import {
  CLIENT_TYPE,
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
  OneToOne,
} from 'typeorm';
import { ClientInternal_ORM_Entity } from './client-internal.orm-entity';
import { LoanApplicationInternal_ORM_Entity } from './loan-application-internal.orm-entity';

@Entity('client_internal_profile')
export class ClientInternalProfile_ORM_Entity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: CLIENT_TYPE, default: CLIENT_TYPE.REGULER })
  tipe_nasabah: CLIENT_TYPE;

  @Column()
  nama_lengkap: string;

  @Column({ type: 'enum', enum: GENDER })
  jenis_kelamin: GENDER;

  @Column()
  no_hp: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: 'enum', enum: MARRIAGE_STATUS })
  status_nikah: MARRIAGE_STATUS;

  @Column({ nullable: true })
  foto_ktp?: string;

  @Column({ nullable: true })
  foto_kk?: string;

  @Column({ nullable: true })
  foto_id_card?: string;

  @Column({ nullable: true })
  foto_rekening?: string;

  @Column({ nullable: true })
  no_rekening?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;

  @ManyToOne(
    () => ClientInternal_ORM_Entity,
    (clientInternal) => clientInternal.id,
    {
      onDelete: 'CASCADE',
      eager: true,
      nullable: false,
    },
  )
  @JoinColumn({
    name: 'nasabah_id',
    foreignKeyConstraintName: 'FK_ClientInternalID_at_ClientInternalProfile',
  })
  nasabah: ClientInternal_ORM_Entity;
  @OneToOne(
    () => LoanApplicationInternal_ORM_Entity,
    (pengajuan) => pengajuan.id,
    {
      onDelete: 'CASCADE',
      eager: true,
      nullable: false,
    },
  )
  @JoinColumn({
    name: 'pengajuan_id',
    foreignKeyConstraintName: 'FK_PengajuanID_at_ClientInternalProfile',
  })
  pengajuan: LoanApplicationInternal_ORM_Entity;
}
