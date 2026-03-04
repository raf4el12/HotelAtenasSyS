import type { JwtPayload } from '../interfaces/jwt-payload.interface.js';
import type { AuthTokens } from '../entities/auth-tokens.entity.js';

export interface ITokenService {
  generateTokens(payload: JwtPayload): AuthTokens;
  verifyRefreshToken(token: string): JwtPayload;
}
