import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import {
  DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY,
  ILoanApplicationDraftExternalRepository,
} from '../../../Domain/Repositories/ext/LoanAppInt.repository';
import { CreateDraftLoanApplicationExtDto } from '../../DTOS/LoanAppExt_MarketingInput/CreateDraft_LoanAppExt.dto';
import { LoanApplicationExtEntity } from '../../../Domain/Entities/ext/LoanAppExt.entity';
import { UpdateDraftLoanApplicationDto } from '../../DTOS/LoanAppInt_MarketingInput/UpdateDraft_LoanAppInt.dto';
import { isEqual, merge } from 'lodash';

@Injectable()
export class CreateDraftLoanApplicationExtUseCase {
  constructor(
    @Inject(DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppDraftRepo: ILoanApplicationDraftExternalRepository,
  ) {}

  async executeCreateDraft(
    marketingId: number,
    dto: CreateDraftLoanApplicationExtDto,
  ) {
    try {
      console.log(dto);
      const loanApp = await this.loanAppDraftRepo.create({
        marketing_id: marketingId,
        client_external: dto.payload.client_external,
        address_external: dto.payload.address_external,
        job_external: dto.payload.job_external,
        loan_application_external: dto.payload.loan_application_external,
        loan_guarantor_external: dto.payload.loan_guarantor,
        emergency_contact_external: dto.payload.emergency_contact_dto,
        financial_dependents_external: dto.payload.financial_dependents,
        other_exist_loan_external: dto.payload.other_exist_loan,
        collateral_bpjs: dto.payload.collateral_bpjs,
        collateral_bpkb: dto.payload.collateral_bpkb,
        collateral_shm: dto.payload.collateral_shm,
        collateral_umkm: dto.payload.collateral_umkm,
        collateral_kedinasan_mou: dto.payload.collateral_kedinasan_mou,
        collateral_kedinasan_non_mou: dto.payload.collateral_kedinasan_non_mou,
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

    const entityUpdate: Partial<LoanApplicationExtEntity> = {
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
