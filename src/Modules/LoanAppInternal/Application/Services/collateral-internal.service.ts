import { Injectable, Inject } from '@nestjs/common';
import {
  ICollateralInternalRepository,
  COLLATERAL_INTERNAL_REPOSITORY,
} from '../../Domain/Repositories/collateral-internal.repository';
import { CollateralInternal } from '../../Domain/Entities/collateral-internal.entity';
import { CreateCollateralDto } from '../DTOS/dto-Collateral/create-collateral-internal.dto';
import { UpdateCollateralDto } from '../DTOS/dto-Collateral/update-collateral-internal.dto';

@Injectable()
export class CollateralInternalService {
  constructor(
    @Inject(COLLATERAL_INTERNAL_REPOSITORY)
    private readonly repo: ICollateralInternalRepository,
  ) {}

  async create(dto: CreateCollateralDto): Promise<CollateralInternal> {
    const now = new Date();
    const address = new CollateralInternal(
      {id: dto.nasabah_id},
      dto.jaminan_hrd,
      dto.jaminan_cg,
      dto.penjamin,
      undefined,
      now,
      null,
      
      dto.nama_penjamin,
      dto.lama_kerja_penjamin,
      dto.bagian,
      dto.absensi,
      dto.riwayat_pinjam_penjamin,
      dto.riwayat_nominal_penjamin,
      dto.riwayat_tenor_penjamin,
      dto.sisa_pinjaman_penjamin,
      dto.jaminan_cg_penjamin,
      dto.status_hubungan_penjamin,
      dto.foto_ktp_penjamin,
      dto.foto_id_card_penjamin,
      now,
    );
    return this.repo.save(address);
  }

  async update(
    id: number,
    dto: UpdateCollateralDto,
  ): Promise<CollateralInternal> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<CollateralInternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<CollateralInternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
