import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.js';
import type { IPasswordService } from '../../../auth/domain/contracts/password-service.interface.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';
import { UserResponseDto } from '../dto/user-response.dto.js';
import type { UpdateUserData } from '../../domain/interfaces/update-user-data.interface.js';
import { mapToUserResponse } from './helpers/map-user-response.js';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IPasswordService') private readonly passwordService: IPasswordService,
  ) {}

  async execute(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByIdWithProfile(id);
    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (dto.email && dto.email !== existingUser.email) {
      const emailExists = await this.userRepository.existsByEmail(dto.email);
      if (emailExists) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    if (dto.profile?.dni && dto.profile.dni !== existingUser.profile?.dni) {
      const dniExists = await this.userRepository.existsByDni(dto.profile.dni);
      if (dniExists) {
        throw new ConflictException('El DNI ya está registrado');
      }
    }

    const updateData: UpdateUserData = { ...dto };

    if (dto.password) {
      updateData.password = await this.passwordService.hash(dto.password);
    }

    const updatedUser = await this.userRepository.updateUser(id, updateData);
    return mapToUserResponse(updatedUser);
  }
}
