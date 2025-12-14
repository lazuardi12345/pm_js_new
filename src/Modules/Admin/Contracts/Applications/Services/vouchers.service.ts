import { Inject } from '@nestjs/common';
import { Vouchers } from '../../Domain/Entities/vouchers.entity';
import { CreateVoucherDto } from '../DTOS/dto-Vouchers/create-voucher.dto';
import { UpdateVoucherDto } from '../DTOS/dto-Vouchers/update-voucher.dto';
import {
  VOUCHER_REPOSITORY,
  IVouchersRepository,
} from '../../Domain/Repositories/vouchers.repository';

export class VouchersService {
  constructor(
    @Inject(VOUCHER_REPOSITORY)
    private readonly repo: IVouchersRepository,
  ) {}

  async create(dto: CreateVoucherDto): Promise<Vouchers> {
    const now = new Date();

    const voucher = new Vouchers(
      dto.nama,
      dto.nik,
      dto.kode_voucher,
      dto.kadaluarsa,
      dto.type,
      dto.saldo,
      dto.is_claim ?? 0,
      undefined,
      now,
      now,
    );

    return this.repo.save(voucher);
  }

  async update(id: number, dto: UpdateVoucherDto): Promise<Vouchers> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<Vouchers | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<Vouchers[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
