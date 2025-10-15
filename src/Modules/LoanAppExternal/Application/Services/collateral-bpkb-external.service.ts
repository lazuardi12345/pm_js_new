import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ICollateralByBPKBRepository,
  COLLATERAL_BPKB_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/collateral-bpkb-external.repository';
import { CollateralByBPKB } from '../../Domain/Entities/collateral-bpkb-external.entity';
import { CreatePengajuanBPKBDto } from '../DTOS/dto-Collateral-BPKB/create-collateral-bpkb.dto';
import { UpdatePengajuanBPKBDto } from '../DTOS/dto-Collateral-BPKB/update-collateral-bpkb.dto';

@Injectable()
export class CollateralBpkbExternalService {
  constructor(
    @Inject(COLLATERAL_BPKB_EXTERNAL_REPOSITORY)
    private readonly repo: ICollateralByBPKBRepository,
  ) {}

  async create(dto: CreatePengajuanBPKBDto): Promise<CollateralByBPKB> {
    const now = new Date();

    if (!dto.pengajuan_id) {
      throw new BadRequestException('Pengajuan ID harus diisi.');
    }

    // Validasi business rule minimal nomor BPKB dan STNK harus ada
    if (!dto.no_bpkb || !dto.no_stnk) {
      throw new BadRequestException('Nomor BPKB dan nomor STNK wajib diisi.');
    }

    const collateral = new CollateralByBPKB(
      { id: dto.pengajuan_id },
      dto.atas_nama_bpkb,
      dto.no_stnk,
      dto.alamat_pemilik_bpkb,
      dto.type_kendaraan,
      dto.tahun_perakitan,
      dto.warna_kendaraan,
      dto.stransmisi,
      dto.no_rangka,
      dto.no_mesin,
      dto.no_bpkb,
      dto.foto_stnk,
      dto.foto_bpkb,
      dto.foto_motor,
      undefined, // id biasanya auto-generated di db
      now,
      now,
      null,
    );

    try {
      return await this.repo.save(collateral);
    } catch (error) {
      console.error('Create Collateral BPKB Error:', error);
      throw new InternalServerErrorException('Gagal membuat collateral BPKB');
    }
  }

  async update(id: number, dto: UpdatePengajuanBPKBDto): Promise<CollateralByBPKB> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Collateral BPKB dengan ID ${id} tidak ditemukan`);
    }

    // Build updateData dengan partial properties
    const updateData: Partial<{
      atas_nama_bpkb?: string;
      no_stnk?: string;
      alamat_pemilik_bpkb?: string;
      type_kendaraan?: string;
      tahun_perakitan?: string;
      warna_kendaraan?: string;
      stransmisi?: string;
      no_rangka?: string;
      no_mesin?: string;
      no_bpkb?: string;
      foto_stnk?: string;
      foto_bpkb?: string;
      foto_motor?: string;
    }> = {};

    if (dto.atas_nama_bpkb !== undefined) updateData.atas_nama_bpkb = dto.atas_nama_bpkb;
    if (dto.no_stnk !== undefined) updateData.no_stnk = dto.no_stnk;
    if (dto.alamat_pemilik_bpkb !== undefined) updateData.alamat_pemilik_bpkb = dto.alamat_pemilik_bpkb;
    if (dto.type_kendaraan !== undefined) updateData.type_kendaraan = dto.type_kendaraan;
    if (dto.tahun_perakitan !== undefined) updateData.tahun_perakitan = dto.tahun_perakitan;
    if (dto.warna_kendaraan !== undefined) updateData.warna_kendaraan = dto.warna_kendaraan;
    if (dto.stransmisi !== undefined) updateData.stransmisi = dto.stransmisi;
    if (dto.no_rangka !== undefined) updateData.no_rangka = dto.no_rangka;
    if (dto.no_mesin !== undefined) updateData.no_mesin = dto.no_mesin;
    if (dto.no_bpkb !== undefined) updateData.no_bpkb = dto.no_bpkb;
    if (dto.foto_stnk !== undefined) updateData.foto_stnk = dto.foto_stnk;
    if (dto.foto_bpkb !== undefined) updateData.foto_bpkb = dto.foto_bpkb;
    if (dto.foto_motor !== undefined) updateData.foto_motor = dto.foto_motor;

    // Kalau update nomor BPKB atau STNK pastikan valid (tidak kosong)
    if ('no_bpkb' in updateData && !updateData.no_bpkb) {
      throw new BadRequestException('Nomor BPKB tidak boleh kosong.');
    }
    if ('no_stnk' in updateData && !updateData.no_stnk) {
      throw new BadRequestException('Nomor STNK tidak boleh kosong.');
    }

    try {
      return await this.repo.update(id, updateData);
    } catch (error) {
      console.error('Update Collateral BPKB Error:', error);
      throw new InternalServerErrorException('Gagal mengupdate collateral BPKB');
    }
  }

  async findById(id: number): Promise<CollateralByBPKB> {
    const collateral = await this.repo.findById(id);
    if (!collateral) {
      throw new NotFoundException(`Collateral BPKB dengan ID ${id} tidak ditemukan`);
    }
    return collateral;
  }

  async findAll(): Promise<CollateralByBPKB[]> {
    try {
      return await this.repo.findAll();
    } catch (error) {
      console.error('Find All Collateral BPKB Error:', error);
      throw new InternalServerErrorException('Gagal mengambil data collateral BPKB');
    }
  }

  async delete(id: number): Promise<void> {
    const collateral = await this.repo.findById(id);
    if (!collateral) {
      throw new NotFoundException(`Collateral BPKB dengan ID ${id} tidak ditemukan`);
    }

    try {
      await this.repo.delete(id);
    } catch (error) {
      console.error('Delete Collateral BPKB Error:', error);
      throw new InternalServerErrorException('Gagal menghapus collateral BPKB');
    }
  }
}
