import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { CreateDraftRepeatOrderDto } from '../../DTOS/RepeatOrderInt_MarketingInput/CreateRO_DraftRepeatOrder.dto';
import { LoanApplicationEntity } from '../../../Domain/Entities/LoanAppInt.entity';
import { isEqual, merge } from 'lodash';
import {
  CREATE_DRAFT_REPEAT_ORDER_REPOSITORY,
  IDraftRepeatOrderRepository,
} from '../../../Domain/Repositories/DraftRepeatOrder.repository';

@Injectable()
export class CreateDraftRepeatOrderUseCase {
  constructor(
    @Inject(CREATE_DRAFT_REPEAT_ORDER_REPOSITORY)
    private readonly loanAppDraftRepo: IDraftRepeatOrderRepository,
  ) {}

  async executeCreateDraft(
    marketingId: number,
    dto: CreateDraftRepeatOrderDto,
  ) {
    try {
      console.log(dto);
      const loanApp = await this.loanAppDraftRepo.create({
        marketing_id: marketingId,
        client_internal: dto.payload.client_internal,
        address_internal: dto.payload.address_internal,
        family_internal: dto.payload.family_internal,
        job_internal: dto.payload.job_internal,
        loan_application_internal: dto.payload.loan_application_internal,
        collateral_internal: dto.payload.collateral_internal,
        relative_internal: dto.payload.relative_internal,
        uploaded_files: dto.uploaded_files,
      });

      return {
        error: false,
        message: 'Draft loan application created',
        reference: 'LOAN_CREATE_OK',
        data: loanApp,
      };
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new HttpException(
          {
            error: true,
            message: Object.values(err.errors)
              .map((e: any) => e.message)
              .join(', '),
            reference: 'LOAN_VALIDATION_ERROR',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (err.code === 11000) {
        throw new HttpException(
          {
            error: true,
            message: `Duplicate field: ${Object.keys(err.keyValue).join(', ')}`,
            reference: 'LOAN_DUPLICATE_KEY',
          },
          HttpStatus.CONFLICT,
        );
      }

      throw new HttpException(
        {
          error: true,
          message: err.message || 'Unexpected error',
          reference: 'LOAN_UNKNOWN_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async renderDraftByMarketingId(marketingId: number) {
    try {
      const loanApps =
        await this.loanAppDraftRepo.findByMarketingId(marketingId);
      if (loanApps.length === 0) {
        return {
          error: true,
          message: 'No draft loan applications found for this marketing ID',
          reference: 'LOAN_NOT_FOUND',
          data: [],
        };
      }
      return {
        error: false,
        message: 'Draft loan applications retrieved',
        reference: 'LOAN_RETRIEVE_OK',
        data: loanApps,
      };
    } catch (error) {
      return {
        error: true,
        message: error.message || 'Unexpected error',
        reference: 'LOAN_UNKNOWN_ERROR',
      };
    }
  }

  async deleteDraftByMarketingId(Id: string) {
    try {
      await this.loanAppDraftRepo.softDelete(Id);
      return {
        error: false,
        message: 'Draft loan applications deleted',
        reference: 'LOAN_DELETE_OK',
      };
    } catch (error) {
      return {
        error: true,
        message: error.message || 'Unexpected error',
        reference: 'LOAN_UNKNOWN_ERROR',
      };
    }
  }

  async updateDraftById(id: string, updateData: any, files?: any) {
    console.log('🟢 [updateDraftById] START');
    console.log('➡️ Incoming ID:', id);
    console.log('➡️ Incoming Raw Body:', updateData);

    const existingDraft = await this.loanAppDraftRepo.findById(id);
    if (!existingDraft) throw new Error('Draft tidak ditemukan');

    console.log('🔍 Existing Draft:', JSON.stringify(existingDraft, null, 2));

    // Ambil payload dari body atau dari updateData.payload
    let payloadData: any = updateData.payload ?? updateData;

    // Jika payload berupa string (FormData JSON), parse
    if (typeof payloadData === 'string') {
      try {
        payloadData = JSON.parse(payloadData);
        console.log('✅ Payload parsed from string JSON');
      } catch (err) {
        console.error('⚠️ Payload JSON invalid:', err);
        throw new BadRequestException('Payload JSON tidak valid');
      }
    }

    // Ambil file yang dikirim
    const uploaded_files: Record<string, any> = {};
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

    // Merge payload lama dengan payload baru, merge files juga
    const mergedPayload = merge({}, existingDraft.payload || {}, payloadData);
    const mergedFiles = merge(
      {},
      existingDraft.uploaded_files || {},
      uploaded_files,
    );

    const isPayloadChanged = !isEqual(existingDraft.payload, mergedPayload);
    const isFilesChanged = !isEqual(existingDraft.uploaded_files, mergedFiles);

    if (!isPayloadChanged && !isFilesChanged) {
      console.log('⚠️ Tidak ada perubahan data. Update dibatalkan.');
      return {
        error: true,
        message: 'Tidak ada data yang diubah',
        reference: 'LOAN_UPDATE_NO_CHANGES',
        data: existingDraft,
      };
    }

    const entityUpdate: Partial<LoanApplicationEntity> = {
      payload: mergedPayload,
      uploaded_files: mergedFiles,
    };

    console.log(
      '🔍 Final entityUpdate to save:',
      JSON.stringify(entityUpdate, null, 2),
    );

    const result = await this.loanAppDraftRepo.updateDraftById(
      id,
      entityUpdate,
    );
    console.log('✅ Repository returned:', JSON.stringify(result, null, 2));

    return {
      error: false,
      message: 'Draft loan applications updated',
      reference: 'LOAN_UPDATE_OK',
      data: result.entity,
    };
  }
}
