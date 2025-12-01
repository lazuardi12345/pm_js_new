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
import { PayloadDTO } from 'src/Shared/Modules/Drafts/Applications/DTOS/LoanAppInt_MarketingInput/CreateDraft_LoanAppInt.dto';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
import multer from 'multer';
import { FileUploadAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/file-upload.decorator';

@UseGuards(FileUploadAuthGuard)
@Controller('mkt/int/drafts')
export class MKT_CreateDraftLoanApplicationController {
  constructor(
    private readonly MKT_CreateDraftLoanAppUseCase: MKT_CreateDraftLoanApplicationUseCase,
  ) {}

  // @Public()
  @Post('add')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'foto_ktp', maxCount: 1 }], {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async createDraft(
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    @CurrentUser('id') marketingId: number,
    @Body() dto: any,
  ) {
    try {
      let payload: PayloadDTO;

      // parsing dto.payload biar tetap fleksibel (string / object)
      if (dto.payload) {
        payload =
          typeof dto.payload === 'string'
            ? JSON.parse(dto.payload)
            : dto.payload;
      } else {
        payload = { client_internal: {} } as PayloadDTO;
      }
      payload.marketing_id = marketingId;

      if (!files || Object.values(files).length === 0) {
        throw new BadRequestException('No files uploaded');
      }

      return this.MKT_CreateDraftLoanAppUseCase.executeCreateDraft(
        payload,
        files,
      );
    } catch (error) {
      console.error('Error occurred:', error);
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
  async getDraftById(@Param('id') Id: string) {
    return this.MKT_CreateDraftLoanAppUseCase.renderDraftById(Id);
  }

  @Delete('delete/:id')
  async softDelete(@Param('id') Id: string) {
    return this.MKT_CreateDraftLoanAppUseCase.deleteDraftByMarketingId(Id);
  }

  @Patch('update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'foto_ktp', maxCount: 1 },
      { name: 'foto_kk', maxCount: 1 },
      { name: 'foto_rekening', maxCount: 1 },
      { name: 'foto_id_card', maxCount: 1 },
      { name: 'foto_jaminan', maxCount: 3 },
      { name: 'bukti_absensi', maxCount: 1 },
      { name: 'foto_ktp_penjamin', maxCount: 1 },
      { name: 'foto_id_card_penjamin', maxCount: 1 },
    ]),
  )
  async updateDraftById(
    @Param('id') Id: string,
    @Body() updateData: any = {},
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
  ) {
    const payloadParent =
      typeof updateData.payload === 'string'
        ? JSON.parse(updateData.payload)
        : (updateData.payload ?? {});

    return this.MKT_CreateDraftLoanAppUseCase.updateDraftById(
      Id,
      { payload: payloadParent }, // tetap ada key parent 'payload'
      files,
    );
  }
}
