import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.js';
import { UserResponseDto } from '../dto/user-response.dto.js';
import { mapToUserResponse } from './helpers/map-user-response.js';

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByIdWithProfile(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return mapToUserResponse(user);
  }
}
