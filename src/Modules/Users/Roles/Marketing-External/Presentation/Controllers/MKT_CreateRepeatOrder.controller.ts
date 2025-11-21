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
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { MKT_CreateRepeatOrderUseCase } from '../../Applications/Services/MKT_CreateRepeatOrder.usecase';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { PayloadExternalDTO } from 'src/Shared/Modules/Drafts/Applications/DTOS/RepeatOrderExt_MarketingInput/CreateRO_DraftRepeatOrder.dto';

@Controller('mkt/ext/loan-apps')
@UseGuards(RolesGuard)
export class MKT_CreateRepeatOrderController {
  constructor(
    private readonly createRepeatOrder: MKT_CreateRepeatOrderUseCase,
  ) {}

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
        limits: { fileSize: 5 * 1024 * 1024 },
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
      // ============== PARSE PAYLOAD ==============
      // Body dari FE: FormData dengan field "payload" (JSON string)
      let parsedPayload: any;
      let repeatFromLoanId: number | undefined;

      // Parse payload field (always string dari FormData)
      if (body.payload) {
        try {
          parsedPayload =
            typeof body.payload === 'string'
              ? JSON.parse(body.payload)
              : body.payload;
        } catch (parseError) {
          throw new BadRequestException('Invalid JSON format in payload field');
        }
      } else {
        throw new BadRequestException('Payload field is required');
      }

      // Extract repeatFromLoanId kalau ada (opsional untuk repeat order)
      if (body.repeatFromLoanId) {
        repeatFromLoanId = Number(body.repeatFromLoanId);
        if (isNaN(repeatFromLoanId)) {
          throw new BadRequestException('Invalid repeatFromLoanId format');
        }
      }

      // ============== VALIDATE DTO ==============
      parsedPayload.marketing_id = marketingId;

      const dtoInstance = plainToInstance(PayloadExternalDTO, parsedPayload, {
        enableImplicitConversion: true,
      });

      const errors = await validate(dtoInstance, {
        whitelist: true,
        forbidNonWhitelisted: false,
      });

      if (errors.length > 0) {
        const errorMessages = errors.map((error) =>
          Object.values(error.constraints || {}).join(', '),
        );
        throw new BadRequestException({
          message: 'Validation failed',
          errors: errorMessages,
        });
      }

      console.log('Validated DTO:', {
        client_id,
        repeatFromLoanId,
        hasFiles: !!files && Object.keys(files).length > 0,
      });

      // ============== EXECUTE USE CASE ==============
      return await this.createRepeatOrder.executeCreateRepeatOrder(
        dtoInstance,
        client_id,
        marketingId,
        files,
        repeatFromLoanId, // ← Parameter ke-4
      );
    } catch (error) {
      console.error('Error occurred:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException({
        message: 'An error occurred while processing your request',
        error: error.message,
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
