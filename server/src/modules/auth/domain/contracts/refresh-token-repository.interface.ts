import type { RefreshTokenData } from '../interfaces/refresh-token-data.interface.js';

export interface IRefreshTokenRepository {
  save(data: RefreshTokenData, ttlSeconds: number): Promise<void>;
  find(userId: string, deviceId: string): Promise<string | null>;
  delete(userId: string, deviceId: string): Promise<void>;
  deleteAllByUser(userId: string): Promise<void>;
}
