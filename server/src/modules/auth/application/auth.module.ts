import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { PasswordService } from '../infrastructure/services/password.service.js';
import { TokenService } from '../infrastructure/services/token.service.js';
import { RedisRefreshTokenRepository } from '../infrastructure/repositories/redis-refresh-token.repository.js';
import { JwtStrategy } from '../infrastructure/strategies/jwt.strategy.js';

import { LoginUseCase } from './use-cases/login.use-case.js';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case.js';
import { LogoutUseCase } from './use-cases/logout.use-case.js';
import { LogoutAllDevicesUseCase } from './use-cases/logout-all-devices.use-case.js';
import { GetProfileUseCase } from './use-cases/get-profile.use-case.js';
import { UpdateProfileUseCase } from './use-cases/update-profile.use-case.js';

import { AuthController } from '../interfaces/controllers/auth.controller.js';
import { UsersModule } from '../../users/application/users.module.js';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [
    { provide: 'IPasswordService', useClass: PasswordService },
    { provide: 'ITokenService', useClass: TokenService },
    { provide: 'IRefreshTokenRepository', useClass: RedisRefreshTokenRepository },

    JwtStrategy,

    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    LogoutAllDevicesUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,
  ],
  exports: ['IPasswordService', 'ITokenService'],
})
export class AuthModule {}
