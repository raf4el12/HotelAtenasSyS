import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../../users/domain/repositories/user.repository.js';
import { UpdateProfileDto } from '../dto/update-profile.dto.js';
import { ProfileResponseDto } from '../dto/profile-response.dto.js';

function mapToProfileResponse(user: any): ProfileResponseDto {
  const profile = user.profile;
  if (!profile) return null;

  const response = new ProfileResponseDto();
  response.id = profile.id;
  response.firstName = profile.firstName;
  response.lastName = profile.lastName;
  response.dni = profile.dni;
  response.phone = profile.phone;
  response.avatarUrl = profile.avatarUrl;
  response.birthDate = profile.birthDate;
  response.address = profile.address;
  response.district = profile.district;
  response.city = profile.city;
  response.province = profile.province;
  response.emergencyContactName = profile.emergencyContactName;
  response.emergencyContactPhone = profile.emergencyContactPhone;
  response.emergencyContactRelation = profile.emergencyContactRelation;
  response.shift = profile.shift;
  response.shiftNotes = profile.shiftNotes;
  return response;
}

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, dto: UpdateProfileDto): Promise<ProfileResponseDto> {
    const user = await this.userRepository.findByIdWithProfile(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const updated = await this.userRepository.updateProfile(userId, dto);
    return mapToProfileResponse(updated);
  }
}
