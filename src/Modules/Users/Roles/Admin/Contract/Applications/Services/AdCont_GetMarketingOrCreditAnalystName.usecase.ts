// src/Modules/Admin/Contracts/Application/UseCases/AdCont_GetMarketingOrCreditAnalyst_UseCase.ts
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  IUsersRepository,
  USERS_REPOSITORY,
} from 'src/Modules/Users/Domain/Repositories/users.repository';

@Injectable()
export class AdCont_GetMarketingOrCreditAnalystUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly userRepo: IUsersRepository,
  ) {}

  async execute(type: 'MARKETING' | 'CREDIT_ANALYST', name?: string) {
    try {
      // Validasi minimal karakter untuk pencarian nama
      if (name && name.trim().length < 3) {
        throw new BadRequestException({
          success: false,
          message: 'Pencarian nama minimal 3 karakter untuk performa optimal',
          reference: 'SEARCH_NAME_MIN_LENGTH',
        });
      }

      // Memanggil repository user, bukan loan agreement
      const users =
        await this.userRepo.AdCont_findMarketingOrCreditAnalystByName(
          type,
          name ? name.trim() : undefined,
        );

      console.log('pepe: ', users);

      if (!users || users.length === 0) {
        return {
          payload: {
            success: true,
            message: `No ${type} data found`,
            reference: 'USER_NOT_FOUND',
            data: [],
          },
        };
      }

      // Mapping data user yang relevan untuk dropdown/pilihan di UI
      const mappedData = users.map((user: any) => ({
        id: user.id,
        name: user.nama,
        user_code: user.marketing_code || user.marketingCode || null,
      }));

      return {
        error: false,
        message: `${type} data retrieved successfully`,
        reference: 'USER_GET_OK',
        data: mappedData,
      };
    } catch (err) {
      console.error('Error in GetMarketingOrCreditAnalyst UseCase:', err);

      if (err instanceof BadRequestException) {
        throw err;
      }

      return {
        payload: {
          error: true,
          message: err.message || 'Failed to retrieve user data',
          reference: 'USER_INTERNAL_ERROR',
        },
      };
    }
  }
}
