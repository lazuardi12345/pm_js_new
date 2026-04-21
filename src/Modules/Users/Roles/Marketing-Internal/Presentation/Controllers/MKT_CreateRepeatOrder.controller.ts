import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  UseInterceptors,
  Param,
  UploadedFiles,
  ParseIntPipe,
  UseGuards,
  Get,
  Patch,
  Delete,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpException,
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { MKT_CreateRepeatOrderUseCase } from '../../Applications/Services/MKT_CreateRepeatOrder.usecase';
import { PayloadDTO } from 'src/Shared/Modules/Drafts/Applications/DTOS/RepeatOrderInt_MarketingInput/CreateRO_DraftRepeatOrder.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import {
  secureFileFilter,
  uploadLimits,
} from 'src/Shared/Modules/Authentication/Infrastructure/Helpers/FileFilter.help';

@Controller('mkt/int/loan-apps')
@UseGuards(RolesGuard)
export class MKT_CreateRepeatOrderController {
  constructor(
    private readonly createRepeatOrder: MKT_CreateRepeatOrderUseCase,
  ) {}

  private validateRequiredFiles(files: any, fields: string[]) {
    const missing = fields.filter((f) => !files?.[f] || files[f].length === 0);
    if (missing.length > 0) {
      throw new BadRequestException(
        `Missing required files: ${missing.join(', ')}`,
      );
    }
  }

  private parsePayload(payload: any) {
    if (!payload) throw new BadRequestException('Payload field is required');
    try {
      return typeof payload === 'string' ? JSON.parse(payload) : payload;
    } catch {
      throw new BadRequestException('Invalid JSON format in payload field');
    }
  }

  private async validateDto(dto: any) {
    const errors = await validate(dto, { whitelist: true });
    if (errors.length > 0) {
      const messages = errors.map((e) =>
        Object.values(e.constraints || {}).join(', '),
      );
      throw new BadRequestException({
        message: 'Validation failed',
        errors: messages,
      });
    }
  }

  @Post('create/repeat-order/:client_id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'foto_ktp', maxCount: 1 },
        { name: 'foto_kk', maxCount: 1 },
        { name: 'foto_id_card', maxCount: 1 },
        { name: 'bukti_absensi', maxCount: 1 },
        { name: 'foto_rekening', maxCount: 1 },
        { name: 'foto_ktp_penjamin', maxCount: 1 },
        { name: 'foto_id_card_penjamin', maxCount: 1 },
      ],
      {
        storage: multer.memoryStorage(),
        fileFilter: secureFileFilter,
        limits: uploadLimits,
      },
    ),
  )
  async submitRepeatOrder(
    @Param('client_id', ParseIntPipe) client_id: number,
    @CurrentUser('id') marketingId: number,
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    @Body() body: any,
  ) {
    try {
      this.validateRequiredFiles(files, ['foto_ktp']);

      const parsedPayload = this.parsePayload(body.payload);
      parsedPayload.marketing_id = marketingId;

      const dtoInstance = plainToInstance(PayloadDTO, parsedPayload, {
        enableImplicitConversion: true,
      });

      await this.validateDto(dtoInstance);

      const repeatFromLoanId = body.repeatFromLoanId
        ? Number(body.repeatFromLoanId)
        : undefined;
      if (body.repeatFromLoanId && isNaN(repeatFromLoanId ?? 0)) {
        throw new BadRequestException('Invalid repeatFromLoanId format');
      }

      return await this.createRepeatOrder.executeCreateRepeatOrder(
        dtoInstance,
        client_id,
        marketingId,
        files,
        repeatFromLoanId,
      );
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      // Jika error tidak terduga (misal crash database)
      throw new InternalServerErrorException({
        payload: {
          error: true,
          message: 'Internal Server Error',
          reference: 'LOAN_UNKNOWN_ERROR',
        },
      });
    }
  }

  @Patch('update/repeat-order/:id')
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
  async updateRepeatOrderById(
    @Param('id') Id: string,
    @Body() updateData: any = {},
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
  ) {
    const payloadParent =
      typeof updateData.payload === 'string'
        ? JSON.parse(updateData.payload)
        : (updateData.payload ?? {});

    return this.createRepeatOrder.updateRepeatOrderById(
      Id,
      { payload: payloadParent }, // tetap ada key parent 'payload'
      files,
    );
  }
  @Get('repeat-order/:id')
  async getRepeatOrderById(@Param('id') Id: string) {
    return this.createRepeatOrder.renderRepeatOrderById(Id);
  }

  @Get('draft/repeat-order')
  async getRepeatOrderByMarketingId(@CurrentUser('id') marketingId: number) {
    return this.createRepeatOrder.renderRepeatOrderByMarketingId(marketingId);
  }

  @Delete('repeat-order/delete/:id')
  async softDelete(@Param('id') Id: string) {
    return this.createRepeatOrder.deleteRepeatOrderByMarketingId(Id);
  }
}
