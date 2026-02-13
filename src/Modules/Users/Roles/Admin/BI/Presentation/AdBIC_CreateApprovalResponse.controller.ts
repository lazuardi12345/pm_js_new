import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { FileUploadAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/file-upload.decorator';

import { AdBIC_CreateApprovalResponseUseCase } from '../Applications/AdBIC_CreateApprovalResponse.usecase';
import { AdBIC_CreatePayloadDto } from '../Applications/DTOS/AdBIC_CreatePayload.dto';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { LoanTypeEnum } from 'src/Shared/Enums/Admins/BI/approval-recommendation.enum';
import { JwtToken } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/jwt-extractor.decorator';

@UseGuards(FileUploadAuthGuard)
@Controller('admin-bi')
export class AdBIC_CreateApprovalResponseController {
  constructor(private readonly useCase: AdBIC_CreateApprovalResponseUseCase) {}

  @Roles(USERTYPE.ADMIN_BI)
  @Post('int/:type/response/add')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 3 }], {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async createApprovalInternalResponse(
    @Param('type') type: LoanTypeEnum,
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    @Body('payload') payload: any, // ⬅ cuma ambil "payload"
    @JwtToken() token?: string,
  ) {
    try {
      if (!files || Object.values(files).length === 0) {
        throw new BadRequestException('No files uploaded');
      } else if (
        ![LoanTypeEnum.EXTERNAL, LoanTypeEnum.INTERNAL].includes(type)
      ) {
        throw new BadRequestException('Invalid type');
      }

      // auto parse kalau masih string
      const dto: AdBIC_CreatePayloadDto =
        typeof payload === 'string' ? JSON.parse(payload) : payload;

      return this.useCase.executeCreateDraft(dto, files, type, token);
    } catch (error) {
      console.error('Create approval recommendation failed:', error);
      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }

  @Roles(USERTYPE.ADMIN_BI)
  @Post('ext/:type/response/add')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 3 }], {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async createApprovalExternalResponse(
    @Param('type') type: LoanTypeEnum,
    @UploadedFiles()
    files: Record<string, Express.Multer.File[]>,
    @Body('payload') payload: any, // ⬅ cuma ambil "payload"
    @JwtToken() token?: string,
  ) {
    try {
      if (!files || Object.values(files).length === 0) {
        throw new BadRequestException('No files uploaded');
      }

      // auto parse kalau masih string
      const dto: AdBIC_CreatePayloadDto =
        typeof payload === 'string' ? JSON.parse(payload) : payload;

      return this.useCase.executeCreateDraft(dto, files, type, token);
    } catch (error) {
      console.error('Create approval recommendation failed:', error);
      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }
}
