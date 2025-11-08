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

  /**
   * Membuat data Collateral BPKB baru
   */
  async create(dto: CreatePengajuanBPKBDto): Promise<CollateralByBPKB> {
    const now = new Date();

    if (!dto.pengajuan_id) {
      throw new BadRequestException('pengajuan_id wajib diisi.');
    }
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
      dto.foto_no_rangka,
      dto.no_mesin,
      dto.foto_no_mesin,
      dto.no_bpkb,
      dto.dokumen_bpkb,
      dto.foto_stnk_depan,
      dto.foto_stnk_belakang,
      dto.foto_kendaraan_depan,
      dto.foto_kendaraan_belakang,
      dto.foto_kendaraan_samping_kanan,
      dto.foto_kendaraan_samping_kiri,
      dto.foto_sambara,
      dto.foto_kwitansi_jual_beli,
      dto.foto_ktp_tangan_pertama,
      dto.foto_faktur_kendaraan,
      dto.foto_snikb,
      undefined,
      now,
      now,
      null,
    );

    try {
      return await this.repo.save(collateral);
    } catch (error) {
      console.error('[Collateral BPKB] Error saat create:', error);
      throw new InternalServerErrorException('Gagal membuat data collateral BPKB.');
    }
  }

  /**
   * Mengupdate data Collateral BPKB
   */
  async update(id: number, dto: UpdatePengajuanBPKBDto): Promise<CollateralByBPKB> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Collateral BPKB dengan ID ${id} tidak ditemukan.`);
    }

    // siapkan field yang boleh diupdate
    const updateData: Partial<CollateralByBPKB> = {};

    const fields = [
      'atas_nama_bpkb', 'no_stnk', 'alamat_pemilik_bpkb', 'type_kendaraan',
      'tahun_perakitan', 'warna_kendaraan', 'stransmisi', 'no_rangka',
      'foto_no_rangka', 'no_mesin', 'foto_no_mesin', 'no_bpkb', 'dokumen_bpkb',
      'foto_stnk_depan', 'foto_stnk_belakang', 'foto_kendaraan_depan',
      'foto_kendaraan_belakang', 'foto_kendaraan_samping_kanan',
      'foto_kendaraan_samping_kiri', 'foto_sambara', 'foto_kwitansi_jual_beli',
      'foto_ktp_tangan_pertama', 'foto_faktur_kendaraan', 'foto_snikb'
    ] as const;

    for (const field of fields) {
      if (dto[field] !== undefined) {
        (updateData as any)[field] = dto[field];
      }
    }

    if ('no_bpkb' in updateData && !updateData.no_bpkb) {
      throw new BadRequestException('Nomor BPKB tidak boleh kosong.');
    }
    if ('no_stnk' in updateData && !updateData.no_stnk) {
      throw new BadRequestException('Nomor STNK tidak boleh kosong.');
    }

    try {
      return await this.repo.update(id, updateData);
    } catch (error) {
      console.error('[Collateral BPKB] Error saat update:', error);
      throw new InternalServerErrorException('Gagal mengupdate data collateral BPKB.');
    }
  }

  /**
   * Mendapatkan data berdasarkan ID
   */
  async findById(id: number): Promise<CollateralByBPKB> {
    const data = await this.repo.findById(id);
    if (!data) {
      throw new NotFoundException(`Collateral BPKB dengan ID ${id} tidak ditemukan.`);
    }
    return data;
  }

  /**
   * Mendapatkan semua data
   */
  async findAll(): Promise<CollateralByBPKB[]> {
    try {
      return await this.repo.findAll();
    } catch (error) {
      console.error('[Collateral BPKB] Error saat findAll:', error);
      throw new InternalServerErrorException('Gagal mengambil data collateral BPKB.');
    }
  }

  /**
   * Menghapus data berdasarkan ID
   */
  async delete(id: number): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Collateral BPKB dengan ID ${id} tidak ditemukan.`);
    }

    try {
      await this.repo.delete(id);
    } catch (error) {
      console.error('[Collateral BPKB] Error saat delete:', error);
      throw new InternalServerErrorException('Gagal menghapus collateral BPKB.');
    }
  }
}
