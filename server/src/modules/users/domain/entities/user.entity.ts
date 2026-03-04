import type { UserRole } from '../../../../shared/domain/enums/user-role.enum.js';
import type { ProfileEntity } from './profile.entity.js';

export class UserEntity {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  profile: ProfileEntity | null;
}
