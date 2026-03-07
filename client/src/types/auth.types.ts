export enum UserRole {
  ADMIN = 'ADMIN',
  RECEPTIONIST = 'RECEPTIONIST',
  HOUSEKEEPING = 'HOUSEKEEPING',
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  profile: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  } | null;
}

export interface LoginRequest {
  email: string;
  password: string;
  deviceId: string;
}

export interface LogoutRequest {
  deviceId: string;
}

export interface RefreshTokenRequest {
  deviceId: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}
