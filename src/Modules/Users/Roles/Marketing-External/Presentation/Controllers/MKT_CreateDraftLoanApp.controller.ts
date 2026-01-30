import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
import multer from 'multer';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { MKT_CreateDraftLoanApplicationUseCase } from '../../Applications/Services/MKT_CreateDraftLoanApp.usecase';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileUploadAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/file-upload.decorator';
import { PayloadExternalDTO } from 'src/Shared/Modules/Drafts/Applications/DTOS/LoanAppExt_MarketingInput/CreateDraft_LoanAppExt.dto';
import { ExternalCollateralType } from 'src/Shared/Enums/General/General.enum';
import { JenisPembiayaanEnum } from 'src/Shared/Enums/External/Loan-Application.enum';
import {
  secureFileFilter,
  uploadLimits,
} from 'src/Shared/Modules/Authentication/Infrastructure/Helpers/FileFilter.help';
import { JwtToken } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/jwt-extractor.decorator';
import { CurrentSpvId } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/is-user-has-spv.decorator';

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
    @CurrentSpvId() spvId: number | null,
    @Param('type') external_loan_type: string,
    @Body() dto: any,
    @JwtToken() token?: string,
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

      if (
        payload.client_external.no_hp.length >= 14 &&
        /[\(\)\+]/.test(payload.client_external.no_hp)
      ) {
        throw new BadRequestException(
          'Nomor HP tidak boleh mengandung tanda kurung () atau + jika panjangnya 14 karakter atau lebih',
        );
      } else if (
        !payload.client_external?.nik ||
        !/^\d{16}$/.test(payload.client_external.nik)
      ) {
        throw new BadRequestException('NIK wajib berupa 16 digit angka');
      } else if (
        !payload.loan_application_external ||
        payload.loan_application_external.nominal_pinjaman === undefined ||
        payload.loan_application_external.nominal_pinjaman <= 0 ||
        typeof payload.loan_application_external.nominal_pinjaman !== 'number'
      ) {
        throw new BadRequestException(
          'Nominal wajib diisi dengan angka bernilai > 0',
        );
      }
      if (!files || Object.values(files).length === 0) {
        throw new BadRequestException('No files uploaded');
      }
      return this.MKT_CreateDraftLoanAppUseCase.executeCreateDraft(
        payload,
        files,
        external_loan_type as ExternalCollateralType,
        jenisPembiayaan,
        spvId,
        token,
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

        //? UMKM
        { name: 'foto_sku', maxCount: 1 },
        { name: 'foto_usaha', maxCount: 1 },
        { name: 'foto_pembukuan', maxCount: 1 },

        //? KEDINASAN_MOU_AND_NON_MOU
        { name: 'surat_permohonan_kredit', maxCount: 1 },
        { name: 'surat_pernyataan_penjamin', maxCount: 1 },
        { name: 'surat_persetujuan_pimpinan', maxCount: 1 },
        { name: 'surat_keterangan_gaji', maxCount: 1 },
        { name: 'foto_form_pengajuan', maxCount: 1 },
        { name: 'foto_surat_kuasa_pemotongan', maxCount: 1 },
        { name: 'foto_surat_pernyataan_peminjam', maxCount: 1 },
        { name: 'foto_sk_golongan_terbaru', maxCount: 1 },
        { name: 'foto_keterangan_tpp', maxCount: 1 },
        { name: 'foto_biaya_operasional', maxCount: 1 },
        { name: 'foto_surat_kontrak', maxCount: 1 },
        { name: 'foto_rekomendasi_bendahara', maxCount: 1 },
      ],
      {
        storage: multer.memoryStorage(),
        limits: uploadLimits,
        fileFilter: secureFileFilter,
      },
    ),
  )
  async updateDraftById(
    @Param('id') Id: string,
    @CurrentUser('id') marketingId: number,
    @Body() updateData: any = {},
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
  ) {
    const payloadParent =
      typeof updateData.payload === 'string'
        ? JSON.parse(updateData.payload)
        : (updateData.payload ?? {});

    console.log('payloadParentPatchDraft', { payloadParent });

    return this.MKT_CreateDraftLoanAppUseCase.updateDraftById(
      Id,
      marketingId,
      { payload: payloadParent },
      files,
    );
  }
}
