import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  IOtherExistLoansExternalRepository,
  OTHER_EXIST_LOANS_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/other-exist-loans-external.repository';
import { OtherExistLoansExternal } from '../../Domain/Entities/other-exist-loans-external.entity';
import { CreateOtherExistLoansExternalDto } from '../DTOS/dto-Other-Exist-Loans/create-other-exist-loans.dto';
import { UpdateOtherExistLoansExternalDto } from '../DTOS/dto-Other-Exist-Loans/update-other-exist-loans.dto';

@Injectable()
export class OtherExistLoanExternalService {
  constructor(
    @Inject(OTHER_EXIST_LOANS_EXTERNAL_REPOSITORY)
    private readonly repo: IOtherExistLoansExternalRepository,
  ) {}

  async create(
    dto: CreateOtherExistLoansExternalDto,
  ): Promise<OtherExistLoansExternal> {
    const now = new Date();
    const entity = new OtherExistLoansExternal(
      { id: dto.loan_app_ext_id },
      dto.cicilan_lain,
      undefined,
      dto.validasi_pinjaman_lain,
      dto.catatan,
      now,
      now,
      undefined,
    );

    try {
      return await this.repo.save(entity);
    } catch (error) {
      console.error('Create Emergency Contact Error:', error);
      throw new InternalServerErrorException(
        'Failed to create Installments Data',
      );
    }
  }

  async update(
    id: number,
    dto: UpdateOtherExistLoansExternalDto,
  ): Promise<OtherExistLoansExternal> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<OtherExistLoansExternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<OtherExistLoansExternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
