import { Inject, Injectable } from '@nestjs/common';
import type { IRefreshTokenRepository } from '../../domain/contracts/refresh-token-repository.interface.js';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject('IRefreshTokenRepository') private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  async execute(userId: string, deviceId: string): Promise<void> {
    await this.refreshTokenRepo.delete(userId, deviceId);
  }
}
