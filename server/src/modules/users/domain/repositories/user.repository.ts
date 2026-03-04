import type { UserEntity } from '../entities/user.entity.js';
import type { ProfileEntity } from '../entities/profile.entity.js';
import type { CreateUserData } from '../interfaces/create-user-data.interface.js';
import type { UpdateUserData } from '../interfaces/update-user-data.interface.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';
import type { UserRole } from '../../../../shared/domain/enums/user-role.enum.js';

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  findByIdWithProfile(id: string): Promise<UserEntity | null>;
  existsByEmail(email: string): Promise<boolean>;
  existsByDni(dni: string): Promise<boolean>;
  createUser(data: CreateUserData): Promise<UserEntity>;
  findAllPaginated(params: PaginationParams, role?: UserRole): Promise<PaginatedResult<UserEntity>>;
  updateUser(id: string, data: UpdateUserData): Promise<UserEntity>;
  updateProfile(userId: string, data: Partial<ProfileEntity>): Promise<UserEntity>;
  softDelete(id: string): Promise<void>;
}
