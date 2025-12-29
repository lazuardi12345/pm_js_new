import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  IUsersRepository,
  USERS_REPOSITORY,
} from 'src/Modules/Users/Domain/Repositories/users.repository';

@Injectable()
export class HM_GetAllUsers_UseCase {
  private readonly logger = new Logger(HM_GetAllUsers_UseCase.name);

  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepo: IUsersRepository,
  ) {}

  async execute(
    page = 1,
    pageSize = 10,
  ): Promise<{
    data: Array<{
      id: number;
      nama: string;
      email: string;
      usertype: string;
      type: string;
      marketing_code: string | null;
      spv_id: number | null;
      is_active: boolean;
    }>;
    total: number;
    page: number;
    pageSize: number;
  }> {
    try {
      const { data, total } = await this.usersRepo.callSP_HM_GetAllUsers(page, pageSize);

      if (!data || data.length === 0) {
        this.logger.warn(`Data user tidak ditemukan pada page ${page} dengan pageSize ${pageSize}`);
        throw new Error('Data user tidak ditemukan');
      }

      // Pastikan field yang digunakan di sini sesuai dengan field dari SP (huruf kecil semua)
      const formattedData = data.map((item) => ({
        id: Number(item.id),
        nama: item.nama,
        email: item.email,
        usertype: item.usertype,
        type: item.type,
        marketing_code: item.marketing_code ?? null,
        spv_id: item.spv_id !== null ? Number(item.spv_id) : null,
        is_active: item.is_active === 1,
      }));

      return {
        data: formattedData,
        total,
        page,
        pageSize,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal mengambil data user';
      this.logger.error(`Gagal mengambil data user: ${message}`);
      throw new Error(message);
    }
  }
}
