import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  IDetailInstallmentItemsExternalRepository,
  DETAIL_INSTALLMENT_ITEMS_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/detail-installment-items-external.repository';
import { DetailInstallmentItemsExternal } from '../../Domain/Entities/detail-installment-items-external.entity';
import { CreateDetailInstallmentItemsDto } from '../DTOS/dto-Detail-Installment-Items/create-detail-installment-items.dto';
import { UpdateDetailInstallmentItemsDto } from '../DTOS/dto-Detail-Installment-Items/update-detail-installment-items.dto';

@Injectable()
export class DetailInstallmentItemsService {
  constructor(
    @Inject(DETAIL_INSTALLMENT_ITEMS_EXTERNAL_REPOSITORY)
    private readonly repo: IDetailInstallmentItemsExternalRepository,
  ) {}

  async create(
    dto: CreateDetailInstallmentItemsDto,
  ): Promise<DetailInstallmentItemsExternal> {
    const now = new Date();

    const entity = new DetailInstallmentItemsExternal(
      { id: dto.cicilan_id },
      dto.nama_pembiayaan,
      dto.total_pinjaman,
      dto.cicilan_perbulan,
      dto.sisa_tenor,
      undefined,
      now,
      now,
      undefined,
    );

    try {
      return await this.repo.save(entity);
    } catch (error) {
      console.error('Create Emergency Contact Error:', error);
      throw new InternalServerErrorException(
        'Failed to create Installment Items',
      );
    }
  }

  async update(
    id: number,
    dto: UpdateDetailInstallmentItemsDto,
  ): Promise<DetailInstallmentItemsExternal | null> {
    const payload: Partial<DetailInstallmentItemsExternal> = {
      ...dto,
      otherExistLoan: dto.cicilan_id ? { id: dto.cicilan_id } : undefined,
    };

    await this.repo.update(id, payload);
    return this.repo.findById(id);
  }

  async findById(id: number): Promise<DetailInstallmentItemsExternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<DetailInstallmentItemsExternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
