export type UserRole = 'ADMIN' | 'RECEPTIONIST' | 'HOUSEKEEPING';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone?: string;
  avatarUrl?: string;
  birthDate?: string;
  address?: string;
  district?: string;
  city?: string;
  province?: string;
  shift?: string;
  shiftNotes?: string;
  emergencyContact?: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  role: UserRole;
  profile: {
    firstName: string;
    lastName: string;
    dni: string;
    phone?: string;
    shift?: string;
  };
}

export interface UpdateUserPayload {
  email?: string;
  role?: UserRole;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}
