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
import { SurveyReports_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/survey-reports.orm-entity';

@Entity('foto_surveys')
export class SurveyPhotos_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => SurveyReports_ORM_Entity, (hasil) => hasil.foto_surveys, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hasil_survey_id', foreignKeyConstraintName: 'FK_SurveyReportsID_at_SurveyPhotos' })
  hasil_survey: SurveyReports_ORM_Entity;

  @Column({ type: 'varchar', length: 255, nullable: true })
  foto_survey?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
