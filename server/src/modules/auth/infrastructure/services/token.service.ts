import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import type { ITokenService } from '../../domain/contracts/token-service.interface.js';
import type { JwtPayload } from '../../domain/interfaces/jwt-payload.interface.js';
import { AuthTokens } from '../../domain/entities/auth-tokens.entity.js';

@Injectable()
export class TokenService implements ITokenService {
  private readonly accessSecret = process.env.JWT_SECRET!;
  private readonly accessExpiresIn = (process.env.JWT_EXPIRES_IN ?? '15m') as jwt.SignOptions['expiresIn'];
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET!;
  private readonly refreshExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as jwt.SignOptions['expiresIn'];

  generateTokens(payload: JwtPayload): AuthTokens {
    const tokenPayload = { id: payload.id, email: payload.email, role: payload.role };

    const tokens = new AuthTokens();
    tokens.accessToken = jwt.sign(tokenPayload, this.accessSecret, {
      expiresIn: this.accessExpiresIn!,
    });
    tokens.refreshToken = jwt.sign(tokenPayload, this.refreshSecret, {
      expiresIn: this.refreshExpiresIn!,
    });

    return tokens;
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.refreshSecret) as jwt.JwtPayload;
      return { id: decoded.id, email: decoded.email, role: decoded.role };
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }
}
