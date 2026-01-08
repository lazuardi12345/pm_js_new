import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  UseInterceptors,
  Param,
  UploadedFiles,
  ParseIntPipe,
  UseGuards,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { MKT_CreateRepeatOrderUseCase } from '../../Applications/Services/MKT_CreateRepeatOrder.usecase';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { PayloadExternalDTO } from 'src/Shared/Modules/Drafts/Applications/DTOS/RepeatOrderExt_MarketingInput/CreateRO_DraftRepeatOrder.dto';
import { JenisPembiayaanEnum } from 'src/Shared/Enums/External/Loan-Application.enum';
import { ExternalCollateralType } from 'src/Shared/Enums/General/General.enum';

@Controller('mkt/ext/loan-apps')
@UseGuards(RolesGuard)
export class MKT_CreateRepeatOrderController {
  constructor(
    private readonly createRepeatOrder: MKT_CreateRepeatOrderUseCase,
  ) {}

  @Post('create/repeat-order/:client_id/:type')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        //? GENERAL
        { name: 'foto_ktp_peminjam', maxCount: 1 },
        { name: 'foto_ktp_penjamin', maxCount: 1 },
        { name: 'foto_kk_peminjam', maxCount: 1 },
        { name: 'foto_rekening', maxCount: 1 },
        { name: 'dokumen_pendukung', maxCount: 1 },
        { name: 'foto_meteran_listrik', maxCount: 1 },
        { name: 'foto_id_card_peminjam', maxCount: 1 },
        { name: 'id_card_peminjam', maxCount: 1 },
        { name: 'slip_gaji_peminjam', maxCount: 1 },

        //? UMKM
        { name: 'foto_sku', maxCount: 1 },
        { name: 'foto_usaha', maxCount: 1 },
        { name: 'foto_pembukuan', maxCount: 1 },

        //? BPJS
        { name: 'foto_bpjs', maxCount: 1 },
        { name: 'kelengkapan_dokumen', maxCount: 1 },

        //? SHM
        { name: 'foto_shm', maxCount: 1 },
        { name: 'foto_kk_pemilik_shm', maxCount: 1 },
        { name: 'foto_pbb', maxCount: 1 },
        { name: 'foto_objek_jaminan', maxCount: 1 },
        { name: 'foto_buku_nikah_suami_istri', maxCount: 1 },
        { name: 'foto_npwp', maxCount: 1 },
        { name: 'foto_imb', maxCount: 1 },
        { name: 'foto_surat_ahli_waris', maxCount: 1 },
        { name: 'foto_surat_akte_kematian', maxCount: 1 },
        { name: 'foto_surat_pernyataan_kepemilikan_tanah', maxCount: 1 },

        //? BPKB
        { name: 'foto_no_rangka', maxCount: 1 },
        { name: 'foto_no_mesin', maxCount: 1 },
        { name: 'foto_faktur_kendaraan', maxCount: 1 },
        { name: 'foto_snikb', maxCount: 1 },
        { name: 'dokumen_bpkb', maxCount: 1 },
        { name: 'foto_stnk_depan', maxCount: 1 },
        { name: 'foto_stnk_belakang', maxCount: 1 },
        { name: 'foto_kendaraan_depan', maxCount: 1 },
        { name: 'foto_kendaraan_belakang', maxCount: 1 },
        { name: 'foto_kendaraan_samping_kanan', maxCount: 1 },
        { name: 'foto_kendaraan_samping_kiri', maxCount: 1 },
        { name: 'foto_sambara', maxCount: 1 },
        { name: 'foto_kwitansi_jual_beli', maxCount: 1 },
        { name: 'foto_ktp_tangan_pertama', maxCount: 1 },
      ],
      {
        storage: multer.memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 },
      },
    ),
  )
  async submitRepeatOrder(
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    @Param('client_id', ParseIntPipe) client_id: number,
    @Param('type') external_loan_type: string,
    @CurrentUser('id') marketingId: number,
    @Body() body: any,
  ) {
    try {
      if (!body.payload)
        throw new BadRequestException('Payload field is required');

      let parsedPayload =
        typeof body.payload === 'string'
          ? JSON.parse(body.payload)
          : body.payload;
      let repeatFromLoanId: number | undefined;

      if (body.repeatFromLoanId) {
        repeatFromLoanId = Number(body.repeatFromLoanId);
        if (isNaN(repeatFromLoanId))
          throw new BadRequestException('Invalid repeatFromLoanId');
      }

      // ================== LOAN TYPE MAP ==================
      const collateralToJenisPembiayaanMap = {
        t1: JenisPembiayaanEnum.BPJS,
        t2: JenisPembiayaanEnum.BPKB,
        t3: JenisPembiayaanEnum.SHM,
        t4: JenisPembiayaanEnum.UMKM,
        t5: JenisPembiayaanEnum.KEDINASAN_MOU,
        t6: JenisPembiayaanEnum.KEDINASAN_NON_MOU,
      };

      const loanTypeToEnumMap = {
        t1: 'BPJS',
        t2: 'BPKB',
        t3: 'SHM',
        t4: 'UMKM',
        t5: 'KEDINASAN_MOU',
        t6: 'KEDINASAN_NON_MOU',
      };

      // ================== SAMAKAN NAMA FIELD DENGAN DTO & PAYLOAD ==================
      const collateralFieldMap = {
        t1: 'collateral_bpjs', // ← tanpa _external
        t2: 'collateral_bpkb',
        t3: 'collateral_shm',
        t4: 'collateral_umkm',
        t5: 'collateral_kedinasan_mou',
        t6: 'collateral_kedinasan_non_mou',
      };

      const jenisPembiayaan =
        collateralToJenisPembiayaanMap[external_loan_type];
      if (!jenisPembiayaan)
        throw new BadRequestException(
          `Invalid loan type: ${external_loan_type}`,
        );

      parsedPayload.loan_external_type = loanTypeToEnumMap[external_loan_type];
      parsedPayload.marketing_id = marketingId;

      if (parsedPayload.loan_application_external) {
        parsedPayload.loan_application_external.jenis_pembiayaan =
          jenisPembiayaan;
      }

      // ================== FIX JOB EXTERNAL (rename field kalau ada) ==================
      if (parsedPayload.job_external?.id_card_peminjam) {
        parsedPayload.job_external.foto_id_card_peminjam =
          parsedPayload.job_external.id_card_peminjam;
        delete parsedPayload.job_external.id_card_peminjam; // optional: bersihkan field lama
      }

      // ================== FIX other_exist_loan_external ==================
      if (!parsedPayload.other_exist_loan_external) {
        parsedPayload.other_exist_loan_external = {
          cicilan_lain: '',
          cicilan: [],
          validasi_pinjaman_lain: false,
          catatan: '',
        };
      }

      // ================== VALIDATION ==================
      const dtoInstance = plainToInstance(PayloadExternalDTO, parsedPayload, {
        enableImplicitConversion: true,
      });

      const errors = await validate(dtoInstance);
      if (errors.length > 0) {
        console.log('Validation errors:', JSON.stringify(errors, null, 2)); // debug
        throw new BadRequestException(errors);
      }

      // ================== EXECUTE USE CASE ==================
      return await this.createRepeatOrder.executeCreateRepeatOrder(
        external_loan_type as ExternalCollateralType,
        jenisPembiayaan,
        dtoInstance,
        client_id,
        marketingId,
        files,
        repeatFromLoanId,
      );
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.error('Submit repeat order error:', error);
      throw new InternalServerErrorException(
        error.message || 'Terjadi kesalahan server',
      );
    }
  }

  @Patch('update/repeat-order/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        //? GENERAL
        { name: 'foto_ktp_peminjam', maxCount: 1 },
        { name: 'foto_ktp_penjamin', maxCount: 1 },
        { name: 'foto_kk_peminjam', maxCount: 1 },
        { name: 'foto_rekening', maxCount: 1 },
        { name: 'dokumen_pendukung', maxCount: 1 },
        { name: 'foto_meteran_listrik', maxCount: 1 },
        { name: 'foto_id_card_peminjam', maxCount: 1 },
        { name: 'slip_gaji_peminjam', maxCount: 1 },

        //? BPJS
        { name: 'foto_bpjs', maxCount: 1 },
        { name: 'dokumen_pendukung_bpjs', maxCount: 1 },

        //? SHM
        { name: 'foto_shm', maxCount: 1 },
        { name: 'foto_kk_pemilik_shm', maxCount: 1 },
        { name: 'foto_pbb', maxCount: 1 },
        { name: 'foto_objek_jaminan', maxCount: 1 },
        { name: 'foto_buku_nikah_suami_istri', maxCount: 1 },
        { name: 'foto_npwp', maxCount: 1 },
        { name: 'foto_imb', maxCount: 1 },
        { name: 'foto_surat_ahli_waris', maxCount: 1 },
        { name: 'foto_surat_akte_kematian', maxCount: 1 },
        { name: 'foto_surat_pernyataan_kepemilikan_tanah', maxCount: 1 },

        //? BPKB
        { name: 'foto_no_rangka', maxCount: 1 },
        { name: 'foto_no_mesin', maxCount: 1 },
        { name: 'foto_faktur_kendaraan', maxCount: 1 },
        { name: 'foto_snikb', maxCount: 1 },
        { name: 'dokumen_bpkb', maxCount: 1 },
        { name: 'foto_stnk_depan', maxCount: 1 },
        { name: 'foto_stnk_belakang', maxCount: 1 },
        { name: 'foto_kendaraan_depan', maxCount: 1 },
        { name: 'foto_kendaraan_belakang', maxCount: 1 },
        { name: 'foto_kendaraan_samping_kanan', maxCount: 1 },
        { name: 'foto_kendaraan_samping_kiri', maxCount: 1 },
        { name: 'foto_sambara', maxCount: 1 },
        { name: 'foto_kwitansi_jual_beli', maxCount: 1 },
        { name: 'foto_ktp_tangan_pertama', maxCount: 1 },
      ],
      {
        storage: multer.memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 },
      },
    ),
  )
  async updateRepeatOrderById(
    @Param('id') Id: string,
    @Body() updateData: any = {},
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
  ) {
    const payloadParent =
      typeof updateData.payload === 'string'
        ? JSON.parse(updateData.payload)
        : (updateData.payload ?? {});

    return this.createRepeatOrder.updateRepeatOrderById(
      Id,
      { payload: payloadParent }, // tetap ada key parent 'payload'
      files,
    );
  }

  @Get('repeat-order/:id')
  async getRepeatOrderById(@Param('id') Id: string) {
    return this.createRepeatOrder.renderRepeatOrderById(Id);
  }

  @Get('draft/repeat-order')
  async getRepeatOrderByMarketingId(@CurrentUser('id') marketingId: number) {
    return this.createRepeatOrder.renderRepeatOrderByMarketingId(marketingId);
  }

  @Delete('repeat-order/delete/:id')
  async softDelete(@Param('id') Id: string) {
    return this.createRepeatOrder.deleteRepeatOrderByMarketingId(Id);
  }
}
