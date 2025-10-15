import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ICollateralBySHMRepository,
  COLLATERAL_SHM_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/collateral-shm-external.repository';
import { CollateralBySHM } from '../../Domain/Entities/collateral-shm-external.entity';
import { CreatePengajuanSHMDto } from '../DTOS/dto-Collateral-SHM/create-collateral-shm.dto';
import { UpdatePengajuanSHMDto } from '../DTOS/dto-Collateral-SHM/update-collateral-shm.dto';

@Injectable()
export class CollateralSHMService {
  constructor(
    @Inject(COLLATERAL_SHM_EXTERNAL_REPOSITORY)
    private readonly repo: ICollateralBySHMRepository,
  ) {}

  async create(dto: CreatePengajuanSHMDto): Promise<CollateralBySHM> {
    if (!dto.pengajuan_id) {
      throw new BadRequestException('Pengajuan ID harus diisi.');
    }

    const now = new Date();

    const collateral = new CollateralBySHM(
      { id: dto.pengajuan_id },
      dto.atas_nama_shm,
      dto.hubungan_shm,
      dto.alamat_shm,
      dto.luas_shm,
      dto.njop_shm,
      dto.foto_shm,
      dto.foto_kk_pemilik_shm,
      dto.foto_pbb,
      undefined, // id otomatis
      now,
      now,
      null,
    );

    try {
      return await this.repo.save(collateral);
    } catch (error) {
      console.error('Create Collateral SHM Error:', error);
      throw new InternalServerErrorException('Gagal membuat collateral SHM');
    }
  }

async update(id: number, dto: UpdatePengajuanSHMDto): Promise<CollateralBySHM> {
  const existing = await this.repo.findById(id);
  if (!existing) {
    throw new NotFoundException(`Collateral SHM dengan ID ${id} tidak ditemukan`);
  }

  // Gabungkan data lama dengan data update (immutable)
  const updatedData = new CollateralBySHM(
    existing.pengajuan,
    dto.atas_nama_shm ?? existing.atas_nama_shm,
    dto.hubungan_shm ?? existing.hubungan_shm,
    dto.alamat_shm ?? existing.alamat_shm,
    dto.luas_shm ?? existing.luas_shm,
    dto.njop_shm ?? existing.njop_shm,
    dto.foto_shm ?? existing.foto_shm,
    dto.foto_kk_pemilik_shm ?? existing.foto_kk_pemilik_shm,
    dto.foto_pbb ?? existing.foto_pbb,
    existing.id,
    existing.created_at,
    new Date(), // updated_at di-set ke sekarang
    existing.deleted_at,
  );

  try {
    return await this.repo.update(id, updatedData);
  } catch (error) {
    console.error('Update Collateral SHM Error:', error);
    throw new InternalServerErrorException('Gagal mengupdate collateral SHM');
  }
}


  async findById(id: number): Promise<CollateralBySHM> {
    const collateral = await this.repo.findById(id);
    if (!collateral) {
      throw new NotFoundException(`Collateral SHM dengan ID ${id} tidak ditemukan`);
    }
    return collateral;
  }

  async findAll(): Promise<CollateralBySHM[]> {
    try {
      return await this.repo.findAll();
    } catch (error) {
      console.error('Find All Collateral SHM Error:', error);
      throw new InternalServerErrorException('Gagal mengambil data collateral SHM');
    }
  }

  async delete(id: number): Promise<void> {
    const collateral = await this.repo.findById(id);
    if (!collateral) {
      throw new NotFoundException(`Collateral SHM dengan ID ${id} tidak ditemukan`);
    }

    try {
      await this.repo.delete(id);
    } catch (error) {
      console.error('Delete Collateral SHM Error:', error);
      throw new InternalServerErrorException('Gagal menghapus collateral SHM');
    }
  }
}
