import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { IUserRepository } from '../../../users/domain/repositories/user.repository.js';
import type { IPasswordService } from '../../domain/contracts/password-service.interface.js';
import type { ITokenService } from '../../domain/contracts/token-service.interface.js';
import type { IRefreshTokenRepository } from '../../domain/contracts/refresh-token-repository.interface.js';
import type { JwtPayload } from '../../domain/interfaces/jwt-payload.interface.js';
import { LoginDto } from '../dto/login.dto.js';
import { AuthResponseDto } from '../dto/auth-response.dto.js';
import type { AuthTokens } from '../../domain/entities/auth-tokens.entity.js';

function mapToAuthResponse(user: any): AuthResponseDto {
  const response = new AuthResponseDto();
  response.id = user.id;
  response.email = user.email;
  response.role = user.role;
  response.profile = user.profile
    ? {
        id: user.profile.id,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        dni: user.profile.dni,
        phone: user.profile.phone,
        avatarUrl: user.profile.avatarUrl,
        birthDate: user.profile.birthDate,
        address: user.profile.address,
        district: user.profile.district,
        city: user.profile.city,
        province: user.profile.province,
        emergencyContactName: user.profile.emergencyContactName,
        emergencyContactPhone: user.profile.emergencyContactPhone,
        emergencyContactRelation: user.profile.emergencyContactRelation,
        shift: user.profile.shift,
        shiftNotes: user.profile.shiftNotes,
      }
    : null;
  return response;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IPasswordService') private readonly passwordService: IPasswordService,
    @Inject('ITokenService') private readonly tokenService: ITokenService,
    @Inject('IRefreshTokenRepository') private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  async execute(dto: LoginDto): Promise<{ user: AuthResponseDto; tokens: AuthTokens; deviceId: string }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    const isValid = await this.passwordService.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
    const tokens = this.tokenService.generateTokens(payload);

    const deviceId = randomUUID();
    await this.refreshTokenRepo.save(
      { userId: user.id, deviceId, refreshToken: tokens.refreshToken },
      7 * 24 * 60 * 60,
    );

    return { user: mapToAuthResponse(user), tokens, deviceId };
  }
}
