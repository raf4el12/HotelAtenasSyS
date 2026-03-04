import type { UserEntity } from '../../../domain/entities/user.entity.js';
import { UserResponseDto } from '../../dto/user-response.dto.js';

export function mapToUserResponse(user: UserEntity): UserResponseDto {
  const response = new UserResponseDto();
  response.id = user.id;
  response.email = user.email;
  response.role = user.role;
  response.isActive = user.isActive;
  response.createdAt = user.createdAt;
  response.updatedAt = user.updatedAt;
  response.profile = user.profile
    ? {
        id: user.profile.id,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        dni: user.profile.dni,
        phone: user.profile.phone,
        avatarUrl: user.profile.avatarUrl,
        birthDate: user.profile.birthDate,
        address: user.profile.address,
        district: user.profile.district,
        city: user.profile.city,
        province: user.profile.province,
        emergencyContactName: user.profile.emergencyContactName,
        emergencyContactPhone: user.profile.emergencyContactPhone,
        emergencyContactRelation: user.profile.emergencyContactRelation,
        shift: user.profile.shift,
        shiftNotes: user.profile.shiftNotes,
      }
    : null;
  return response;
}
