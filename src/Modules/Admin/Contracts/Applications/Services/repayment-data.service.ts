import { Inject } from '@nestjs/common';
import { RepaymentData } from '../../Domain/Entities/repayment-data.entity';
import { CreateRepaymentDataDto } from '../DTOS/dto-Repayment-Data/create-repayment-data.dto';
import { UpdateRepaymentDataDto } from '../DTOS/dto-Repayment-Data/update-repayment-data.dto';
import {
  IRepaymentDataRepository,
  REPAYMENT_DATA_REPOSITORY,
} from '../../Domain/Repositories/repayment-data.repository';
export class RepaymentDataService {
  constructor(
    @Inject(REPAYMENT_DATA_REPOSITORY)
    private readonly repo: IRepaymentDataRepository,
  ) {}

  async create(dto: CreateRepaymentDataDto): Promise<RepaymentData> {
    const now = new Date();

    const address = new RepaymentData(
      dto.id_pinjam, // id_pinjam
      dto.nama_konsumen, // nama_konsumen
      dto.divisi, // divisi
      dto.tgl_pencairan, // tgl_pencairan
      dto.pokok_pinjaman, // pokok_pinjaman
      dto.jumlah_tenor_seharusnya, // jumlah_tenor_seharusnya
      dto.cicilan_per_bulan, // cicilan_per_bulan
      dto.pinjaman_ke, // pinjaman_ke
      dto.sisa_tenor, // sisa_tenor
      dto.sisa_pinjaman, // sisa_pinjaman
      undefined,
      now,
      null,
      now,
    );
    return this.repo.save(address);
  }

  async update(
    id: number,
    dto: UpdateRepaymentDataDto,
  ): Promise<RepaymentData> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<RepaymentData | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<RepaymentData[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
