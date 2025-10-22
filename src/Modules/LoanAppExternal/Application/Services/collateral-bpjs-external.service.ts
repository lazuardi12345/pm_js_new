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
  ) { }

  async create(dto: CreatePengajuanBPJSDto): Promise<CollateralByBPJS> {
    const now = new Date();

    // Pastikan kamu pakai nama properti ID yang benar dari DTO.
    // Kalau belum ada pengajuan_id, tolong DTO kamu update dulu supaya ada.
    if (!(dto as any).pengajuan_id) {
      throw new BadRequestException('Pengajuan ID harus diisi.');
    }

    // Konversi tanggal string ke Date
    const tanggalBayarTerakhir = dto.tanggal_bayar_terakhir
      ? new Date(dto.tanggal_bayar_terakhir)
      : undefined;

    if (!tanggalBayarTerakhir || isNaN(tanggalBayarTerakhir.getTime())) {
      throw new BadRequestException('Tanggal bayar terakhir BPJS tidak valid atau kosong.');
    }

    // Buat entity baru
    const collateral = new CollateralByBPJS(
      { id: (dto as any).pengajuan_id },       
      dto.saldo_bpjs,                         
      tanggalBayarTerakhir,                   
      dto.username,                          
      dto.password,                          
      dto.foto_bpjs, 
      dto.foto_ktp_suami_istri,
      dto.foto_ktp_penjamin,
      dto.foto_kk_pemohon_penjamin,                       
      dto.foto_id_card_suami_istri,         
      dto.slip_gaji,                       
      dto.rekening_koran,                   
      dto.foto_jaminan_tambahan,            
      undefined,                            // id (misal belum ada)
      now,                                 // created_at
      now,                                 // updated_at
      null                                 // deleted_at
    );



    try {
      return await this.repo.save(collateral);
    } catch (error) {
      console.error('Create Collateral BPJS Error:', error);
      throw new InternalServerErrorException('Gagal membuat collateral BPJS');
    }
  }

  async update(id: number, dto: UpdatePengajuanBPJSDto): Promise<CollateralByBPJS> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Collateral BPJS dengan ID ${id} tidak ditemukan`);
    }

    const updateData: Partial<{
      saldo_bpjs?: number;
      tanggal_bayar_terakhir?: Date;
      username?: string;
      password?: string;
      foto_bpjs?: string;
      foto_jaminan_tambahan?: string;
    }> = {};

    if (dto.saldo_bpjs !== undefined) updateData.saldo_bpjs = dto.saldo_bpjs;

    if (dto.tanggal_bayar_terakhir !== undefined) {
      const parsedDate = new Date(dto.tanggal_bayar_terakhir);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Tanggal bayar terakhir BPJS tidak valid.');
      }
      updateData.tanggal_bayar_terakhir = parsedDate;
    }

    if (dto.username !== undefined) updateData.username = dto.username;
    if (dto.password !== undefined) updateData.password = dto.password;
    if (dto.foto_bpjs !== undefined) updateData.foto_bpjs = dto.foto_bpjs;
    if (dto.foto_jaminan_tambahan !== undefined)
      updateData.foto_jaminan_tambahan = dto.foto_jaminan_tambahan;

    try {
      return await this.repo.update(id, updateData);
    } catch (error) {
      console.error('Update Collateral BPJS Error:', error);
      throw new InternalServerErrorException('Gagal mengupdate collateral BPJS');
    }
  }


  async findById(id: number): Promise<CollateralByBPJS> {
    const collateral = await this.repo.findById(id);
    if (!collateral) {
      throw new NotFoundException(`Collateral BPJS dengan ID ${id} tidak ditemukan`);
    }
    return collateral;
  }

  async findAll(): Promise<CollateralByBPJS[]> {
    try {
      return await this.repo.findAll();
    } catch (error) {
      console.error('Find All Collateral BPJS Error:', error);
      throw new InternalServerErrorException('Gagal mengambil data collateral BPJS');
    }
  }

  async delete(id: number): Promise<void> {
    const collateral = await this.repo.findById(id);
    if (!collateral) {
      throw new NotFoundException(`Collateral BPJS dengan ID ${id} tidak ditemukan`);
    }

    try {
      await this.repo.delete(id);
    } catch (error) {
      console.error('Delete Collateral BPJS Error:', error);
      throw new InternalServerErrorException('Gagal menghapus collateral BPJS');
    }
  }
}
