import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ICollateralByKedinasanNonMouRepository, COLLATERAL_KEDINASAN_NON_MOU_EXTERNAL_REPOSITORY } from '../../Domain/Repositories/collateral-kedinasan-non-mou.repository';
import { CollateralByKedinasanNonMOU } from '../../Domain/Entities/collateral-kedinasan-non-mou-external.entity';
import { CreatePengajuanKedinasanNonMouDto } from '../DTOS/dto-Collateral-Kedinasan_NON_MOU/create-collateral-kedinasan.dto';
import { UpdatePengajuanKedinasanNonMouDto } from '../DTOS/dto-Collateral-Kedinasan_NON_MOU/update-collateral-kedinasan.dto';

@Injectable()
export class CollateralKedinasanNonMouExternalService {
  constructor(
    @Inject(COLLATERAL_KEDINASAN_NON_MOU_EXTERNAL_REPOSITORY)
    private readonly repo: ICollateralByKedinasanNonMouRepository,
  ) {}

  async create(dto: CreatePengajuanKedinasanNonMouDto): Promise<UpdatePengajuanKedinasanNonMouDto> {
    const now = new Date();

    if (!dto.pengajuan_id) {
      throw new BadRequestException('Pengajuan ID harus diisi.');
    }

    const collateral = new CollateralByKedinasanNonMOU(
      { id: dto.pengajuan_id },
      dto.instansi,

      dto.surat_permohonan_kredit,
      dto.surat_pernyataan_penjamin,
      dto.surat_persetujuan_pimpinan,
      dto.surat_keterangan_gaji,

      dto.foto_sk,
      dto.foto_keterangan_tpp,
      dto.foto_biaya_operasional,
     
      undefined, 
      now,
      now,
      null,
    );

    try {
      return await this.repo.save(collateral);
    } catch (error) {
      console.error('Create Collateral Kedinasan NON MOU Error:', error);
      throw new InternalServerErrorException('Gagal membuat collateral kedinasan.');
    }
  }

 async update(id: number, dto: UpdatePengajuanKedinasanNonMouDto): Promise<CollateralByKedinasanNonMOU > {
  const existing = await this.repo.findById(id);
  if (!existing) {
    throw new NotFoundException(`Collateral Kedinasan NON MOU dengan ID ${id} tidak ditemukan.`);
  }


  const updated = new CollateralByKedinasanNonMOU(
    existing.pengajuan,
    dto.instansi ?? existing.instansi,

    dto.surat_permohonan_kredit ?? existing.surat_permohonan_kredit,
    dto.surat_pernyataan_penjamin ?? existing.surat_pernyataan_penjamin,
    dto.surat_persetujuan_pimpinan ?? existing.surat_persetujuan_pimpinan,
    dto.surat_keterangan_gaji ?? existing.surat_keterangan_gaji,

    dto.foto_sk ?? existing.foto_sk,
    dto.foto_keterangan_tpp ?? existing.foto_keterangan_tpp,
    dto.foto_biaya_operasional ?? existing.foto_biaya_operasional,

    existing.id,
    existing.created_at,
    new Date(),
    existing.deleted_at,
  );

  try {
    return await this.repo.update(id, updated);
  } catch (error) {
    console.error('Update Collateral Kedinasan Error:', error);
    throw new InternalServerErrorException('Gagal mengupdate collateral kedinasan.');
  }
}


  async findById(id: number): Promise<CollateralByKedinasanNonMOU > {
    const collateral = await this.repo.findById(id);
    if (!collateral) {
      throw new NotFoundException(`Collateral Kedinasan dengan ID ${id} tidak ditemukan.`);
    }
    return collateral;
  }

  async findAll(): Promise<CollateralByKedinasanNonMOU []> {
    try {
      return await this.repo.findAll();
    } catch (error) {
      console.error('Find All Collateral Kedinasan Error:', error);
      throw new InternalServerErrorException('Gagal mengambil data collateral kedinasan NON MOU.');
    }
  }

  async delete(id: number): Promise<void> {
    const collateral = await this.repo.findById(id);
    if (!collateral) {
      throw new NotFoundException(`Collateral Kedinasan dengan ID ${id} tidak ditemukan.`);
    }

    try {
      await this.repo.delete(id);
    } catch (error) {
      console.error('Delete Collateral Kedinasan Error:', error);
      throw new InternalServerErrorException('Gagal menghapus collateral kedinasan NON MOU.');
    }
  }
}
