import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
// import { CreateDraftLoanApplicationDto } from 'src/Shared/Modules/Drafts/Applications/DTOS/LoanAppInt_MarketingInput/CreateDraft_LoanAppInt.dto';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { MKT_CreateDraftLoanApplicationUseCase } from '../../Applications/Services/MKT_CreateDraftLoanApp.usecase';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
import multer from 'multer';
import { FileUploadAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/file-upload.decorator';
import { PayloadExternalDTO } from 'src/Shared/Modules/Drafts/Applications/DTOS/LoanAppExt_MarketingInput/CreateDraft_LoanAppExt.dto';
import { ExternalCollateralType } from 'src/Shared/Enums/General/General.enum';
import { JenisPembiayaanEnum } from 'src/Shared/Enums/External/Loan-Application.enum';

@UseGuards(FileUploadAuthGuard)
@Controller('mkt/ext/drafts')
export class MKT_CreateDraftLoanApplicationController {
  constructor(
    private readonly MKT_CreateDraftLoanAppUseCase: MKT_CreateDraftLoanApplicationUseCase,
  ) {}

  // @Public()
  @Post('add/:type')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'foto_ktp_peminjam', maxCount: 1 }], {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async createDraft(
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    @CurrentUser('id') marketingId: number,
    @Param('type') external_loan_type: string,
    @Body() dto: any,
  ) {
    try {
      const collateralToJenisPembiayaanMap = {
        t1: JenisPembiayaanEnum.BPJS,
        t2: JenisPembiayaanEnum.BPKB,
        t3: JenisPembiayaanEnum.SHM,
        t4: JenisPembiayaanEnum.UMKM,
        t5: JenisPembiayaanEnum.KEDINASAN_MOU,
        t6: JenisPembiayaanEnum.KEDINASAN_NON_MOU,
      };

      const jenisPembiayaan =
        collateralToJenisPembiayaanMap[external_loan_type];

      if (!jenisPembiayaan) {
        throw new BadRequestException(
          `Invalid loan type: ${external_loan_type}. Valid types: t1-t6`,
        );
      }

      let payload: PayloadExternalDTO =
        typeof dto.payload === 'string'
          ? JSON.parse(dto.payload)
          : dto.payload || { client_external: {} };

      payload.marketing_id = marketingId;

      if (!files || Object.values(files).length === 0) {
        throw new BadRequestException('No files uploaded');
      }
      return this.MKT_CreateDraftLoanAppUseCase.executeCreateDraft(
        payload,
        files,
        external_loan_type as ExternalCollateralType,
        jenisPembiayaan,
      );
    } catch (error) {
      console.error('Error occurred:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }

  @Get()
  async getDraftByMarketingId(@CurrentUser('id') marketingId: number) {
    return this.MKT_CreateDraftLoanAppUseCase.renderDraftByMarketingId(
      marketingId,
    );
  }

  @Get(':id')
  async getDraftById(
    @Param('id') Id: string,
    @CurrentUser('id') marketingId: number,
  ) {
    return this.MKT_CreateDraftLoanAppUseCase.renderDraftById(Id, marketingId);
  }

  @Delete('delete/:id')
  async softDelete(@Param('id') Id: string) {
    return this.MKT_CreateDraftLoanAppUseCase.deleteDraftByMarketingId(Id);
  }

  @Patch('update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
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
    ]),
  )
  async updateDraftById(
    @Param('id') Id: string,
    @CurrentUser('id') marketingId: number,
    @Body() updateData: any = {},
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
  ) {
    console.log('Kontol', files);

    const payloadParent =
      typeof updateData.payload === 'string'
        ? JSON.parse(updateData.payload)
        : (updateData.payload ?? {});

    return this.MKT_CreateDraftLoanAppUseCase.updateDraftById(
      Id,
      marketingId,
      { payload: payloadParent },
      files,
    );
  }
}
