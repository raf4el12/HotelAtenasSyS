import { Inject, Injectable, ConflictException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.js';
import type { IPasswordService } from '../../../auth/domain/contracts/password-service.interface.js';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { UserResponseDto } from '../dto/user-response.dto.js';
import { mapToUserResponse } from './helpers/map-user-response.js';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IPasswordService') private readonly passwordService: IPasswordService,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const emailExists = await this.userRepository.existsByEmail(dto.email);
    if (emailExists) {
      throw new ConflictException('El email ya está registrado');
    }

    const dniExists = await this.userRepository.existsByDni(dto.profile.dni);
    if (dniExists) {
      throw new ConflictException('El DNI ya está registrado');
    }

    const hashedPassword = await this.passwordService.hash(dto.password);

    const user = await this.userRepository.createUser({
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
      profile: dto.profile,
    });

    return mapToUserResponse(user);
  }
}
