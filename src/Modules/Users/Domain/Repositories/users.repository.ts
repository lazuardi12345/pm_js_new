import { UsersEntity } from "../Entities/users.entity";

export const USERS_REPOSITORY = 'USERS_REPOSITORY';

export interface IUsersRepository {
 callSP_HM_GetAllUsers(page: number, pageSize: number): Promise<{
    data: any[];
    total: number;
  }>;
  findById(id: number): Promise<UsersEntity | null>;
  findByEmail(email: string): Promise<UsersEntity | null>;
  findAll(): Promise<UsersEntity[]>;
  save(user: UsersEntity): Promise<UsersEntity>;
  update(id: number, user: Partial<UsersEntity>): Promise<UsersEntity>;
  softDelete(id: number): Promise<void>;
}

