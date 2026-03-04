import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { RedisService } from '../../../../shared/redis/redis.service.js';
import type { IRefreshTokenRepository } from '../../domain/contracts/refresh-token-repository.interface.js';
import type { RefreshTokenData } from '../../domain/interfaces/refresh-token-data.interface.js';

@Injectable()
export class RedisRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly redisService: RedisService) {}

  async save(data: RefreshTokenData, ttlSeconds: number): Promise<void> {
    const hashedToken = createHash('sha256').update(data.refreshToken).digest('hex');
    await this.redisService.set(
      `refresh:${data.userId}:${data.deviceId}`,
      hashedToken,
      ttlSeconds,
    );
  }

  async find(userId: string, deviceId: string): Promise<string | null> {
    return this.redisService.get(`refresh:${userId}:${deviceId}`);
  }

  async delete(userId: string, deviceId: string): Promise<void> {
    await this.redisService.del(`refresh:${userId}:${deviceId}`);
  }

  async deleteAllByUser(userId: string): Promise<void> {
    await this.redisService.delByPattern(`refresh:${userId}:*`);
  }
}
