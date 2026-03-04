import { Inject, Injectable } from '@nestjs/common';
import type { IRefreshTokenRepository } from '../../domain/contracts/refresh-token-repository.interface.js';

@Injectable()
export class LogoutAllDevicesUseCase {
  constructor(
    @Inject('IRefreshTokenRepository') private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    await this.refreshTokenRepo.deleteAllByUser(userId);
  }
}
