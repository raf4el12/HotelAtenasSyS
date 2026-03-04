import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash } from 'crypto';
import type { ITokenService } from '../../domain/contracts/token-service.interface.js';
import type { IRefreshTokenRepository } from '../../domain/contracts/refresh-token-repository.interface.js';
import type { IUserRepository } from '../../../users/domain/repositories/user.repository.js';
import type { AuthTokens } from '../../domain/entities/auth-tokens.entity.js';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('ITokenService') private readonly tokenService: ITokenService,
    @Inject('IRefreshTokenRepository') private readonly refreshTokenRepo: IRefreshTokenRepository,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(refreshToken: string, deviceId: string): Promise<{ tokens: AuthTokens; deviceId: string }> {
    const payload = this.tokenService.verifyRefreshToken(refreshToken);

    const storedHash = await this.refreshTokenRepo.find(payload.id, deviceId);
    if (!storedHash) {
      throw new UnauthorizedException('Sesión no válida o expirada');
    }

    const incomingHash = createHash('sha256').update(refreshToken).digest('hex');
    if (incomingHash !== storedHash) {
      await this.refreshTokenRepo.deleteAllByUser(payload.id);
      throw new UnauthorizedException('Token de refresco inválido');
    }

    const user = await this.userRepository.findById(payload.id);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    const newPayload = { id: user.id, email: user.email, role: user.role };
    const newTokens = this.tokenService.generateTokens(newPayload);

    await this.refreshTokenRepo.delete(payload.id, deviceId);
    await this.refreshTokenRepo.save(
      { userId: user.id, deviceId, refreshToken: newTokens.refreshToken },
      7 * 24 * 60 * 60,
    );

    return { tokens: newTokens, deviceId };
  }
}
