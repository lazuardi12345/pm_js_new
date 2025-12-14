import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';

import {
  VOUCHER_REPOSITORY,
  IVouchersRepository,
} from 'src/Modules/Admin/Contracts/Domain/Repositories/vouchers.repository';
import { AdCont_CreateVoucherDto } from '../DTOS/AdCont_CreateContractPayload.dto';
import { Vouchers } from 'src/Modules/Admin/Contracts/Domain/Entities/vouchers.entity';

@Injectable()
export class AdCont_CreateVoucherUseCase {
  constructor(
    @Inject(VOUCHER_REPOSITORY)
    private readonly voucherRepo: IVouchersRepository,
  ) {}

  async execute(dto: AdCont_CreateVoucherDto) {
    try {
      if (!dto.nik) {
        throw new BadRequestException('NIK is required');
      }
      if (!dto.nama) {
        throw new BadRequestException('Nama is required');
      }
      if (!dto.kode_voucher) {
        throw new BadRequestException('Kode voucher is required');
      }
      if (!dto.kadaluarsa) {
        throw new BadRequestException('Kadaluarsa is required');
      }

      const now = new Date();
      const voucherEntity = new Vouchers(
        dto.nama,
        dto.nik,
        dto.kode_voucher,
        dto.kadaluarsa,
        dto.type,
        dto.saldo,
        dto.is_claim ?? 0,
        undefined,
        now,
        now,
        now,
      );

      const saved = await this.voucherRepo.save(voucherEntity);

      if (!saved) {
        throw new HttpException(
          {
            payload: {
              error: 'CREATE FAILED',
              message: 'Failed to create voucher',
              reference: 'VOUCHER_CREATE_FAILED',
            },
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        payload: {
          error: false,
          message: 'Voucher created successfully',
          reference: 'VOUCHER_CREATE_OK',
          data: saved,
        },
      };
    } catch (err) {
      console.error(err);

      if (err.code === 11000) {
        throw new HttpException(
          {
            payload: {
              error: 'DUPLICATE KEY',
              message: `Duplicate field: ${Object.keys(err.keyValue).join(', ')}`,
              reference: 'VOUCHER_DUPLICATE_KEY',
            },
          },
          HttpStatus.CONFLICT,
        );
      }
      if (err.name === 'ValidationError') {
        throw new HttpException(
          {
            payload: {
              error: 'VALIDATION ERROR',
              message: Object.values(err.errors)
                .map((e: any) => e.message)
                .join(', '),
              reference: 'VOUCHER_VALIDATION_ERROR',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          payload: {
            error: 'UNEXPECTED ERROR',
            message: err.message || 'Unexpected error',
            reference: 'VOUCHER_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
