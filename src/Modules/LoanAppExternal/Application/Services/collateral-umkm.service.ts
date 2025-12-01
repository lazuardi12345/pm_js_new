import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ICollateralByUMKMRepository,
  COLLATERAL_UMKM_REPOSITORY,
} from '../../Domain/Repositories/collateral-umkm.repository';
import { CollateralByUMKM } from '../../Domain/Entities/collateral-umkm.entity';
import { CreatePengajuanUmkmDto } from '../DTOS/dto-Collateral-UMKM/create-collateral-umkm.dto';
import { UpdatePengajuanUmkmDto } from '../DTOS/dto-Collateral-UMKM/update-collateral-umkm.dto';

function toArray(value: string | string[] | undefined): string[] | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value : [value];
}

@Injectable()
export class CollateralUMKMService {
  findByPengajuanId(arg0: number) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @Inject(COLLATERAL_UMKM_REPOSITORY)
    private readonly repo: ICollateralByUMKMRepository,
  ) {}

  async create(dto: CreatePengajuanUmkmDto): Promise<CollateralByUMKM> {
    if (!dto.pengajuan_id) {
      throw new BadRequestException('Pengajuan ID harus diisi.');
    }

    const now = new Date();

    const fotoUsahaArray: string[] | undefined = dto.foto_usaha
      ? Array.isArray(dto.foto_usaha)
        ? dto.foto_usaha
        : [dto.foto_usaha]
      : undefined;

    const collateral = new CollateralByUMKM(
      { id: dto.pengajuan_id },
      dto.foto_sku,
      fotoUsahaArray,
      dto.foto_pembukuan,
      undefined, // id otomatis
      now,
      now,
      null,
    );

    try {
      return await this.repo.save(collateral);
    } catch (error) {
      console.error('Create Collateral UMKM Error:', error);
      throw new InternalServerErrorException('Gagal membuat collateral UMKM');
    }
  }

  async update(
    id: number,
    dto: UpdatePengajuanUmkmDto,
  ): Promise<CollateralByUMKM> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Collateral UMKM dengan ID ${id} tidak ditemukan`,
      );
    }

    const fotoUsahaArray =
      toArray(dto.foto_usaha) ?? toArray(existing.foto_usaha);

    const updatedData = new CollateralByUMKM(
      existing.pengajuan,
      dto.foto_sku ?? existing.foto_sku,
      fotoUsahaArray,
      dto.foto_pembukuan ?? existing.foto_pembukuan,
      existing.id,
      existing.created_at,
      new Date(),
      existing.deleted_at,
    );

    try {
      return await this.repo.update(id, updatedData);
    } catch (error) {
      console.error('Update Collateral UMKM Error:', error);
      throw new InternalServerErrorException(
        'Gagal mengupdate collateral UMKM',
      );
    }
  }

  async findById(id: number): Promise<CollateralByUMKM> {
    const data = await this.repo.findById(id);
    if (!data) {
      throw new NotFoundException(
        `Collateral UMKM dengan ID ${id} tidak ditemukan`,
      );
    }
    return data;
  }

  async findAll(): Promise<CollateralByUMKM[]> {
    try {
      return await this.repo.findAll();
    } catch (error) {
      console.error('Find All Collateral UMKM Error:', error);
      throw new InternalServerErrorException(
        'Gagal mengambil data collateral UMKM',
      );
    }
  }

  async delete(id: number): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Collateral UMKM dengan ID ${id} tidak ditemukan`,
      );
    }

    try {
      await this.repo.delete(id);
    } catch (error) {
      console.error('Delete Collateral UMKM Error:', error);
      throw new InternalServerErrorException('Gagal menghapus collateral UMKM');
    }
  }
}
