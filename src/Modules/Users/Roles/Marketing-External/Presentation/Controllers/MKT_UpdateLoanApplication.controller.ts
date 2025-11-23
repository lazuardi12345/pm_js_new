import {
  Controller,
  Patch,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  ValidationPipe,
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
      { name: 'foto_ktp', maxCount: 1 },
      { name: 'foto_kk', maxCount: 1 },
      { name: 'foto_id_card_penjamin', maxCount: 1 },
      { name: 'foto_ktp_penjamin', maxCount: 1 },
      { name: 'foto_id_card', maxCount: 1 },
      { name: 'bukti_absensi_file', maxCount: 1 },
      { name: 'foto_rekening', maxCount: 1 },
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
