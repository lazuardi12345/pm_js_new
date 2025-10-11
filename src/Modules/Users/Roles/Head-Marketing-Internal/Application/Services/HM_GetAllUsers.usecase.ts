import { Injectable, Inject } from '@nestjs/common';
import {
  IUsersRepository,
  USERS_REPOSITORY,
} from 'src/Modules/Users/Domain/Repositories/users.repository';

@Injectable()
export class HM_GetAllUsers_UseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepo: IUsersRepository,
  ) {}

  async execute(page = 1, pageSize = 10) {
  try {
    const { data, total } = await this.usersRepo.callSP_HM_GetAllUsers(page, pageSize);

    if (!data || data.length === 0) {
      throw new Error('Data user tidak ditemukan');
    }

    const formattedData = data.map((item) => ({
      id: Number(item.id),
      nama: item.nama,
      email: item.email,
      usertype: item.usertype,
      type: item.type,
      marketing_code: item.marketing_code,
      spv_id: item.spv_id ? Number(item.spv_id) : null,
      is_active: item.is_active === 1,
    }));

    return {
      data: formattedData,
      total,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal mengambil data user';
    throw new Error(message);
  }
}

}
