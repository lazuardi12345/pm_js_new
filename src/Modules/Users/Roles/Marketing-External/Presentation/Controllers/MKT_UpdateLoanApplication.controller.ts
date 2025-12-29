import {
  Controller,
  Patch,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MKT_UpdateLoanApplicationUseCase } from '../../Applications/Services/MKT_UpdateLoanApplication.usecase';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { LoanApplicationExternalService } from 'src/Modules/LoanAppExternal/Application/Services/loanApp-external.service';

@Controller('mkt/ext/loan-apps')
export class MKT_UpdateLoanApplicationController {
  constructor(
    private readonly updateLoanApplication: MKT_UpdateLoanApplicationUseCase,
    private readonly loanAppService: LoanApplicationExternalService,
  ) {}

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
  async update(
    @Param('id') loanId: string,
    @CurrentUser('id') marketingId: number,
    @Body('payload') rawPayload: string,
    @UploadedFiles() files: { [key: string]: Express.Multer.File[] },
  ) {
    const fixTypeParams = Number(loanId);
    const results = await this.loanAppService.findById(fixTypeParams);
    const getClientId = Number(results?.nasabah.id);
    try {
      const clientId = Number(getClientId);
      if (isNaN(clientId)) {
        throw new BadRequestException('Invalid client ID');
      }

      let parsedPayload: any;
      try {
        parsedPayload =
          typeof rawPayload === 'string' ? JSON.parse(rawPayload) : rawPayload;
      } catch (err) {
        throw new BadRequestException('Payload harus dalam format JSON');
      }

      const result = await this.updateLoanApplication.execute(
        parsedPayload,
        files,
        clientId,
        marketingId,
        fixTypeParams,
      );
      return result.payload;
    } catch (error) {
      console.error('Error in update controller:', error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }
}
