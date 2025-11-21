import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateDraftLoanApplicationIntDto } from '../../Applications/DTOS/LoanAppInt_MarketingInput/CreateDraft_LoanAppInt.dto';
import { CreateDraftRepeatOrderIntUseCase } from '../../Applications/Services/LoanAppInternal/CreateDraftRepeatOrder_Marketing.usecase';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { merge, isEqual } from 'lodash';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('drafts')
export class CreateDraftRepeatOrderController {
  updateDraftService: any;
  constructor(
    private readonly createDraftLoanAppUseCase: CreateDraftRepeatOrderIntUseCase,
  ) {}

  @Post('add')
  async createDraft(
    @CurrentUser('id') marketingId: number,
    @Body() dto: CreateDraftLoanApplicationIntDto,
  ) {
    return this.createDraftLoanAppUseCase.executeCreateDraft(marketingId, dto);
  }

  // @Public()
  @Get()
  async getDraftByMarketingId(@CurrentUser('id') marketingId: number) {
    return this.createDraftLoanAppUseCase.renderDraftByMarketingId(marketingId);
  }

  @Delete('delete/:id')
  // async (@CurrentUser('id') Id: number) {
  async softDelete(@Param('id') Id: string) {
    return this.createDraftLoanAppUseCase.deleteDraftByMarketingId(Id);
  }
  // ================= Patch untuk FormData + File =================
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'foto_ktp', maxCount: 1 },
      { name: 'foto_kk', maxCount: 1 },
      { name: 'foto_id_card', maxCount: 1 },
      { name: 'foto_rekening', maxCount: 1 },
    ]),
  )
  async updateDraftById(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: any,
  ) {
    try {
      console.log('🟢 [updateDraftById] START');
      console.log('➡️ Incoming ID:', id);
      console.log('➡️ RAW body:', body);

      // Ambil payload jika ada, kalau tidak pakai body langsung
      let payloadData = body.payload ?? body;

      // Parse JSON jika payload string
      if (typeof payloadData === 'string') {
        try {
          payloadData = JSON.parse(payloadData);
          console.log('✅ Payload parsed from string JSON');
        } catch (err) {
          console.error('⚠️ Payload JSON invalid:', err);
          throw new BadRequestException('Payload JSON tidak valid');
        }
      }

      // Prepare uploaded_files
      const uploaded_files: Record<string, string[]> = {};
      if (files) {
        for (const [field, fileArray] of Object.entries(files) as [
          string,
          Express.Multer.File[],
        ][]) {
          if (Array.isArray(fileArray) && fileArray.length > 0) {
            uploaded_files[field] = fileArray.map((f) => f.filename);
          }
        }
      }

      console.log('➡️ Uploaded files:', uploaded_files);

      // Merge uploaded_files ke payload tanpa membuat nested payload lagi
      const mergedBody = merge({}, payloadData, { uploaded_files });
      console.log(
        '➡️ Merged body to update:',
        JSON.stringify(mergedBody, null, 2),
      );

      // Panggil service update
      const result = await this.updateDraftService.updateDraftById(
        id,
        mergedBody,
      );

      if (!result.isUpdated) {
        return {
          error: true,
          message: 'Tidak ada data yang diubah',
          reference: 'LOAN_UPDATE_NO_CHANGES',
          data: result.entity,
        };
      }

      return {
        error: false,
        message: 'Draft loan applications updated',
        reference: 'LOAN_UPDATE_OK',
        data: result.entity,
      };
    } catch (error) {
      console.error('❌ Update FormData error:', error);
      throw new BadRequestException('Failed to update draft');
    }
  }

  // ================= Patch untuk JSON murni =================
  @Patch(':id/json')
  async updateDraftJsonOnly(@Param('id') id: string, @Body() body: any) {
    try {
      console.log('🟢 [updateDraftJsonOnly] START');
      console.log('➡️ Incoming ID:', id);
      console.log('➡️ RAW body:', body);

      // Ambil payload jika ada, kalau tidak pakai body langsung
      let payloadData = body.payload ?? body;

      if (typeof payloadData === 'string') {
        try {
          payloadData = JSON.parse(payloadData);
          console.log('✅ Payload parsed from string JSON');
        } catch (err) {
          console.error('⚠️ Payload JSON invalid:', err);
          throw new BadRequestException('Payload JSON tidak valid');
        }
      }

      // Panggil service update
      const result = await this.updateDraftService.updateDraftById(
        id,
        payloadData,
      );

      if (!result.isUpdated) {
        return {
          error: true,
          message: 'Tidak ada data yang diubah',
          reference: 'LOAN_UPDATE_NO_CHANGES',
          data: result.entity,
        };
      }

      return {
        error: false,
        message: 'Draft loan applications updated',
        reference: 'LOAN_UPDATE_OK',
        data: result.entity,
      };
    } catch (error) {
      console.error('❌ Update JSON error:', error);
      throw new BadRequestException('Failed to update draft');
    }
  }
}
