export const PASSWORD_HASHER = 'PASSWORD_HASHER';
export interface IPasswordHasher {
  hash(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}
