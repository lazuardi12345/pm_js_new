import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { FileUploadAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/file-upload.decorator';

import { AdBIC_CreateApprovalResponseUseCase } from '../Applications/AdBIC_CreateApprovalResponse.usecase';
import { AdBIC_CreatePayloadDto } from '../Applications/DTOS/AdBIC_CreatePayload.dto';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

@UseGuards(FileUploadAuthGuard)
@Controller('admin-bi/int')
export class AdBIC_CreateApprovalResponseController {
  constructor(private readonly useCase: AdBIC_CreateApprovalResponseUseCase) {}

  @Roles(USERTYPE.ADMIN_BI)
  @Post('response/add')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'attachments', maxCount: 3 }], {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async createApprovalResponse(
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    @Body('payload') payload: any, // ⬅ cuma ambil "payload"
  ) {
    try {
      if (!files || Object.values(files).length === 0) {
        throw new BadRequestException('No files uploaded');
      }

      // auto parse kalau masih string
      const dto: AdBIC_CreatePayloadDto =
        typeof payload === 'string' ? JSON.parse(payload) : payload;

      return this.useCase.executeCreateDraft(dto, files);
    } catch (error) {
      console.error('Create approval recommendation failed:', error);
      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }
}
