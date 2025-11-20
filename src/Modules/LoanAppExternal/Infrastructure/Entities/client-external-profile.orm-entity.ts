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
  CLIENT_TYPE,
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/External/Client-External.enum';
import { Users_ORM_Entity } from 'src/Modules/Users/Infrastructure/Entities/users.orm-entity';
import { LoanApplicationExternal_ORM_Entity } from './loan-application-external.orm-entity';
import { ClientExternal_ORM_Entity } from './client-external.orm-entity';
import { IsBoolean } from 'class-validator';

@Entity('client_external_profile')
export class ClientExternalProfile_ORM_Entity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nama_lengkap: string;

  @Column()
  no_rek: string;

  @Column()
  foto_rekening: string;

  @Column({ type: 'enum', enum: GENDER })
  jenis_kelamin: GENDER;

  @Column()
  no_hp: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: 'enum', enum: MARRIAGE_STATUS })
  status_nikah: MARRIAGE_STATUS;

  @Column({ nullable: true })
  foto_ktp_peminjam?: string;

  @Column({ nullable: true })
  foto_ktp_penjamin?: string;

  @Column({ nullable: true })
  foto_kk_peminjam?: string;

  @Column({ nullable: true })
  foto_kk_penjamin?: string;

  @Column({ nullable: true })
  dokumen_pendukung?: string;

  @Column({ type: 'tinyint', nullable: true })
  validasi_nasabah?: boolean;

  @Column({ nullable: true })
  catatan?: string;

  @Column({ nullable: false })
  @IsBoolean()
  enable_edit?: boolean;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;

  @ManyToOne(
    () => ClientExternal_ORM_Entity,
    (clientExternal) => clientExternal.id,
    {
      onDelete: 'CASCADE',
      eager: true,
      nullable: false,
    },
  )
  @JoinColumn({
    name: 'nasabah_id',
    foreignKeyConstraintName: 'FK_ClientExternalID_at_ClientExternalProfile',
  })
  nasabah: ClientExternal_ORM_Entity;
  @OneToOne(
    () => LoanApplicationExternal_ORM_Entity,
    (pengajuan) => pengajuan.id,
    {
      onDelete: 'CASCADE',
      eager: true,
      nullable: false,
    },
  )
  @JoinColumn({
    name: 'pengajuan_id',
    foreignKeyConstraintName: 'FK_PengajuanID_at_ClientExternalProfile',
  })
  pengajuan: LoanApplicationExternal_ORM_Entity;
}
