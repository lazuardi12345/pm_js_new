import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISurveyReportsRepository } from '../../Domain/Repositories/survey-reports-external.repository';
import { SurveyReports } from '../../Domain/Entities/survey-reports-external.entity';
import { SurveyReports_ORM_Entity } from '../Entities/survey-reports.orm-entity';
import { SurveyPhotos } from '../../Domain/Entities/survey-photos-external.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SurveyReportsRepositoryImpl implements ISurveyReportsRepository {
  constructor(
    @InjectRepository(SurveyReports_ORM_Entity)
    private readonly repo: Repository<SurveyReports_ORM_Entity>,
  ) {}

  private toDomain(entity: SurveyReports_ORM_Entity): SurveyReports {
    return new SurveyReports(
      entity.pengajuan_luar.id,
      entity.berjumpa_siapa,
      entity.hubungan,
      entity.status_rumah,
      entity.hasil_cekling1,
      entity.hasil_cekling2,
      entity.kesimpulan,
      entity.rekomendasi,
      entity.id,
      entity.created_at,
      entity.updated_at,
      entity.deleted_at,
    );
  }

  async findById(id: number): Promise<SurveyReports | null> {
    const found = await this.repo.findOne({
      where: { id },
      relations: ['foto_surveys', 'pengajuan_luar'],
    });
    return found ? this.toDomain(found) : null;
  }

  async findByPengajuanLuarId(
    pengajuanLuarId: number,
  ): Promise<SurveyReports[]> {
    const found = await this.repo.find({
      where: { pengajuan_luar: { id: pengajuanLuarId } },
      relations: ['foto_surveys', 'pengajuan_luar'],
    });
    return found.map(this.toDomain);
  }

  async findAll(): Promise<SurveyReports[]> {
    const all = await this.repo.find({
      relations: ['foto_surveys', 'pengajuan_luar'],
    });
    return all.map(this.toDomain);
  }

  async save(report: SurveyReports): Promise<SurveyReports> {
    const entity = this.repo.create({
      id: report.id ?? undefined,
      pengajuan_luar: { id: report.pengajuanLuarId } as any,
      berjumpa_siapa: report.berjumpaSiapa,
      hubungan: report.hubungan,
      status_rumah: report.statusRumah,
      hasil_cekling1: report.hasilCekling1,
      hasil_cekling2: report.hasilCekling2,
      kesimpulan: report.kesimpulan,
      rekomendasi: report.rekomendasi,
    });
    const saved = await this.repo.save(entity);
    return this.findById(saved.id) as Promise<SurveyReports>;
  }

  async update(
    id: number,
    partial: Partial<SurveyReports>,
  ): Promise<SurveyReports> {
    await this.repo.update(id, {
      berjumpa_siapa: partial.berjumpaSiapa,
      hubungan: partial.hubungan,
      status_rumah: partial.statusRumah,
      hasil_cekling1: partial.hasilCekling1,
      hasil_cekling2: partial.hasilCekling2,
      kesimpulan: partial.kesimpulan,
      rekomendasi: partial.rekomendasi,
    });
    return (await this.findById(id))!;
  }

  async delete(id: number): Promise<void> {
    await this.repo.softDelete(id);
  }
}
