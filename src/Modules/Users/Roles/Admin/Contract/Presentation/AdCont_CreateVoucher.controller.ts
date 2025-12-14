import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AdCont_CreateVoucherUseCase } from '../Applications/Services/AdCont_CreateVoucher.usecase';
import { AdCont_CreateVoucherDto } from '../Applications/DTOS/AdCont_CreateContractPayload.dto';

@Controller('admin-contracts')
export class AdCont_CreateVouchersController {
  constructor(
    private readonly createVoucherUseCase: AdCont_CreateVoucherUseCase,
  ) {}

  @Post('vouchers/create')
  async create(@Body() payload: AdCont_CreateVoucherDto) {
    try {
      const result = await this.createVoucherUseCase.execute(payload);

      return {
        status: HttpStatus.OK,
        ...result,
      };
    } catch (err) {
      console.log(err);
      throw new HttpException(
        err.response || {
          payload: {
            error: 'UNEXPECTED ERROR',
            message: err.message || 'Unknown error',
            reference: 'VOUCHER_CONTROLLER_ERROR',
          },
        },
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
