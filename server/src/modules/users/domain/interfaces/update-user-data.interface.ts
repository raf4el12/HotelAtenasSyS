import type { UserRole } from '../../../../shared/domain/enums/user-role.enum.js';
import type { ShiftType } from '../../../../shared/domain/enums/shift-type.enum.js';

export interface UpdateUserData {
  email?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    dni?: string;
    phone?: string;
    avatarUrl?: string;
    birthDate?: Date | string;
    address?: string;
    district?: string;
    city?: string;
    province?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
    shift?: ShiftType;
    shiftNotes?: string;
  };
}
