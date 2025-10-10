export interface JwtPayloadDto {
  sub: number;
  nama: string;
  email: string;
  roles: string[];
  type: string;
  marketing_code?: string | null;
  is_active: boolean | number;
  iat?: number;
  exp?: number;
  jti?: string;
}
