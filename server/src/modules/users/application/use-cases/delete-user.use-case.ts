import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.js';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, currentUserId: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (id === currentUserId) {
      throw new ConflictException('No puede desactivar su propia cuenta');
    }

    await this.userRepository.softDelete(id);
  }
}
