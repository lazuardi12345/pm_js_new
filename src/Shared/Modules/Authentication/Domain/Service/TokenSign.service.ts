export const TOKEN_SIGN = 'TOKEN_SIGN';
export interface ITokenSign {
  sign(payload: any): Promise<string>;
}
