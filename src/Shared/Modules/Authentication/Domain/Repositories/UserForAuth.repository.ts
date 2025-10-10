import { UserForAuth } from '../Entities/UserForAuth.entity';

export const USER_FOR_AUTH_REPOSITORY = 'USER_FOR_AUTH_REPOSITORY';

export interface IUserForAuthRepository {
  findByEmail(email: string): Promise<UserForAuth | null>;
  findById(id: number): Promise<UserForAuth | null>;
}
