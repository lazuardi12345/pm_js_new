import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { LoanApplicationExternal_ORM_Entity } from './loan-application-external.orm-entity';
import { SurveyPhotos_ORM_Entity } from './survey-photos.orm-entity';
@Entity('survey_reports_external')
export class SurveyReports_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @OneToOne(
    () => LoanApplicationExternal_ORM_Entity,
    (pengajuan) => pengajuan.hasil_survey,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'pengajuan_id',
    foreignKeyConstraintName: 'FK_LoanApplicationExternalID_at_SurveyReports',
  })
  pengajuan_luar: LoanApplicationExternal_ORM_Entity;

  @Column({ type: 'varchar', length: 255 })
  berjumpa_siapa: string;

  @Column({ type: 'varchar', length: 255 })
  hubungan: string;

  @Column({ type: 'varchar', length: 255 })
  status_rumah: string;

  @Column({ type: 'varchar', length: 255 })
  hasil_cekling1: string;

  @Column({ type: 'varchar', length: 255 })
  hasil_cekling2: string;

  @Column({ type: 'longtext' })
  kesimpulan: string;

  @Column({ type: 'longtext' })
  rekomendasi: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  @OneToMany(() => SurveyPhotos_ORM_Entity, (foto) => foto.hasil_survey)
  foto_surveys: SurveyPhotos_ORM_Entity[];
}
