import { Injectable, Inject } from '@nestjs/common';
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
  ): Promise<OtherExistLoansExternal[]> {
    const now = new Date();
    const result: OtherExistLoansExternal[] = [];

    for (const item of dto.cicilan) {
      const entity = new OtherExistLoansExternal(
        { id: dto.nasabah_id },
        item.cicilan_lain,
        item.nama_pembiayaan,
        item.cicilan_perbulan,
        item.sisa_tenor,
        undefined,
        item.total_pinjaman,
        dto.validasi_pinjaman_lain,
        dto.catatan,
        now,
        now,
        undefined,
      );

      const savedData = await this.repo.save(entity);
      result.push(savedData);
    }

    return result;
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
