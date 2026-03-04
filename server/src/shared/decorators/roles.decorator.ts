import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../domain/enums/user-role.enum.js';
import { ROLES_KEY } from '../constants/roles.constant.js';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
