import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ICollateralByBPJSRepository,
  COLLATERAL_BPJS_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/collateral-bpjs-external.repository';
import { CollateralByBPJS } from '../../Domain/Entities/collateral-bpjs-external.entity';
import { CreatePengajuanBPJSDto } from '../DTOS/dto-Collateral-BPJS/create-collateral-bpjs.dto';
import { UpdatePengajuanBPJSDto } from '../DTOS/dto-Collateral-BPJS/update-collateral-bpjs.dto';

@Injectable()
export class CollateralByBpjsExternalService {
  constructor(
    @Inject(COLLATERAL_BPJS_EXTERNAL_REPOSITORY)
    private readonly repo: ICollateralByBPJSRepository,
  ) {}

  /**
   * Membuat data collateral BPJS baru
   */
  async create(dto: CreatePengajuanBPJSDto): Promise<CollateralByBPJS> {
    const now = new Date();

    if (!dto.pengajuan_id) {
      throw new BadRequestException('pengajuan_id wajib diisi.');
    }

    if (!dto.tanggal_bayar_terakhir) {
      throw new BadRequestException('tanggal_bayar_terakhir wajib diisi.');
    }

    const tanggalBayarTerakhir = new Date(dto.tanggal_bayar_terakhir);
    if (isNaN(tanggalBayarTerakhir.getTime())) {
      throw new BadRequestException('Format tanggal_bayar_terakhir tidak valid.');
    }

    const collateral = new CollateralByBPJS(
      { id: dto.pengajuan_id },
      dto.saldo_bpjs,
      tanggalBayarTerakhir,
      dto.username,
      dto.password,
      dto.foto_bpjs,
      dto.jaminan_tambahan,
      undefined,
      now,
      now,
      null,
    );

    try {
      return await this.repo.save(collateral);
    } catch (error) {
      console.error('[Collateral BPJS] Error saat create:', error);
      throw new InternalServerErrorException('Gagal membuat collateral BPJS.');
    }
  }

  /**
   * Update data collateral BPJS
   */
async update(id: number, dto: UpdatePengajuanBPJSDto): Promise<CollateralByBPJS> {
  const existing = await this.repo.findById(id);
  if (!existing) {
    throw new NotFoundException(`Collateral BPJS dengan ID ${id} tidak ditemukan.`);
  }

  // Siapkan data update tanpa langsung mengubah properti readonly
  const updateData = {
    saldo_bpjs: dto.saldo_bpjs ?? existing.saldo_bpjs,
    username: dto.username ?? existing.username,
    password: dto.password ?? existing.password,
    foto_bpjs: dto.foto_bpjs ?? existing.foto_bpjs,
    jaminan_tambahan: dto.jaminan_tambahan ?? existing.jaminan_tambahan,
    tanggal_bayar_terakhir: dto.tanggal_bayar_terakhir
      ? new Date(dto.tanggal_bayar_terakhir)
      : existing.tanggal_bayar_terakhir,
  };

  // Validasi tanggal (jika dikirim)
  if (dto.tanggal_bayar_terakhir) {
    const parsedDate = new Date(dto.tanggal_bayar_terakhir);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Format tanggal_bayar_terakhir tidak valid.');
    }
    updateData.tanggal_bayar_terakhir = parsedDate;
  }

  try {
    return await this.repo.update(id, updateData);
  } catch (error) {
    console.error('[Collateral BPJS] Error saat update:', error);
    throw new InternalServerErrorException('Gagal mengupdate collateral BPJS.');
  }
}

  /**
   * Ambil data collateral BPJS berdasarkan ID
   */
  async findById(id: number): Promise<CollateralByBPJS> {
    const collateral = await this.repo.findById(id);
    if (!collateral) {
      throw new NotFoundException(`Collateral BPJS dengan ID ${id} tidak ditemukan.`);
    }
    return collateral;
  }

  /**
   * Ambil semua data collateral BPJS
   */
  async findAll(): Promise<CollateralByBPJS[]> {
    try {
      return await this.repo.findAll();
    } catch (error) {
      console.error('[Collateral BPJS] Error saat findAll:', error);
      throw new InternalServerErrorException('Gagal mengambil data collateral BPJS.');
    }
  }

  /**
   * Hapus data collateral BPJS berdasarkan ID
   */
  async delete(id: number): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Collateral BPJS dengan ID ${id} tidak ditemukan.`);
    }

    try {
      await this.repo.delete(id);
    } catch (error) {
      console.error('[Collateral BPJS] Error saat delete:', error);
      throw new InternalServerErrorException('Gagal menghapus collateral BPJS.');
    }
  }
}
