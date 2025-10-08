import { UsersEntity } from "../Entities/users.entity";

export const USERS_REPOSITORY = 'USERS_REPOSITORY';

export interface IUsersRepository {
  findById(id: number): Promise<UsersEntity | null>;
  findByEmail(email: string): Promise<UsersEntity | null>;
  findAll(): Promise<UsersEntity[]>;
  save(user: UsersEntity): Promise<UsersEntity>;
  update(id: number, user: Partial<UsersEntity>): Promise<UsersEntity>;
  softDelete(id: number): Promise<void>;
}
