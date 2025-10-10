import { SetMetadata } from '@nestjs/common';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

export const ROLES_KEY = 'usertype';
export const Roles = (...roles: USERTYPE[]) => SetMetadata(ROLES_KEY, roles);
