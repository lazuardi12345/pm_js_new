// Infrastructure/Repositories/survey-photos-external.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyPhotos } from '../../Domain/Entities/survey-photos-external.entity';
import { ISurveyPhotosRepository } from '../../Domain/Repositories/survey-photos-external.repository';
import { SurveyPhotos_ORM_Entity } from '../Entities/survey-photos.orm-entity';

@Injectable()
export class SurveyPhotosRepositoryImpl implements ISurveyPhotosRepository {
  constructor(
    @InjectRepository(SurveyPhotos_ORM_Entity)
    private readonly ormRepo: Repository<SurveyPhotos_ORM_Entity>,
  ) {}

  private toDomain(entity: SurveyPhotos_ORM_Entity): SurveyPhotos {
    return new SurveyPhotos(
      entity.id,
      entity.hasil_survey?.id,
      entity.foto_survey ?? undefined,
      entity.created_at ?? undefined,
      entity.updated_at ?? undefined,
      entity.deleted_at ?? undefined,
    );
  }

  private toOrm(domain: SurveyPhotos): Partial<SurveyPhotos_ORM_Entity> {
    return {
      id: domain.id ?? undefined,
      hasil_survey: { id: domain.hasilSurveyId } as any,
      foto_survey: domain.fotoSurvey,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
      deleted_at: domain.deletedAt,
    };
  }

  private toOrmPartial(
    partial: Partial<SurveyPhotos>,
  ): Partial<SurveyPhotos_ORM_Entity> {
    const ormData: Partial<SurveyPhotos_ORM_Entity> = {};
    if (partial.hasilSurveyId)
      ormData.hasil_survey = { id: partial.hasilSurveyId } as any;
    if (partial.fotoSurvey !== undefined) ormData.foto_survey = partial.fotoSurvey;
    if (partial.createdAt) ormData.created_at = partial.createdAt;
    if (partial.updatedAt) ormData.updated_at = partial.updatedAt;
    if (partial.deletedAt) ormData.deleted_at = partial.deletedAt;
    return ormData;
  }

  async findById(id: number): Promise<SurveyPhotos | null> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: ['hasil_survey'],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByHasilSurveyId(hasilSurveyId: number): Promise<SurveyPhotos[]> {
    const entities = await this.ormRepo.find({
      where: { hasil_survey: { id: hasilSurveyId } },
      relations: ['hasil_survey'],
    });
    return entities.map((e) => this.toDomain(e));
  }

  async findAll(): Promise<SurveyPhotos[]> {
    const entities = await this.ormRepo.find({
      relations: ['hasil_survey'],
    });
    return entities.map((e) => this.toDomain(e));
  }

  async save(address: SurveyPhotos): Promise<SurveyPhotos> {
    const ormEntity = this.toOrm(address);
    const saved = await this.ormRepo.save(ormEntity);
    return this.toDomain(saved as SurveyPhotos_ORM_Entity);
  }

  async update(
    id: number,
    address: Partial<SurveyPhotos>,
  ): Promise<SurveyPhotos> {
    await this.ormRepo.update(id, this.toOrmPartial(address));
    const updated = await this.ormRepo.findOne({
      where: { id },
      relations: ['hasil_survey'],
    });
    if (!updated) throw new Error('SurveyPhotos not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.softDelete(id);
  }
}
