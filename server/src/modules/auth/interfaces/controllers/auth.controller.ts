import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Auth } from '../../../../shared/decorators/auth.decorator.js';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../domain/interfaces/jwt-payload.interface.js';
import { LoginUseCase } from '../../application/use-cases/login.use-case.js';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case.js';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case.js';
import { LogoutAllDevicesUseCase } from '../../application/use-cases/logout-all-devices.use-case.js';
import { GetProfileUseCase } from '../../application/use-cases/get-profile.use-case.js';
import { UpdateProfileUseCase } from '../../application/use-cases/update-profile.use-case.js';
import { LoginDto } from '../../application/dto/login.dto.js';
import { AuthResponseDto } from '../../application/dto/auth-response.dto.js';
import { ProfileResponseDto } from '../../application/dto/profile-response.dto.js';
import { UpdateProfileDto } from '../../application/dto/update-profile.dto.js';

const COOKIE_OPTIONS_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly logoutAllDevicesUseCase: LogoutAllDevicesUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { user, tokens, deviceId } = await this.loginUseCase.execute(dto);

    res.cookie('accessToken', tokens.accessToken, {
      ...COOKIE_OPTIONS_BASE,
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      ...COOKIE_OPTIONS_BASE,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth',
    });

    res.cookie('deviceId', deviceId, {
      ...COOKIE_OPTIONS_BASE,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return { user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar access token' })
  @ApiResponse({ status: 200, description: 'Token refrescado exitosamente' })
  @ApiResponse({ status: 401, description: 'Token de refresco inválido' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    const deviceId = req.cookies?.deviceId;

    if (!refreshToken || !deviceId) {
      throw new UnauthorizedException('No se encontró token de refresco');
    }

    const { tokens } = await this.refreshTokenUseCase.execute(refreshToken, deviceId);

    res.cookie('accessToken', tokens.accessToken, {
      ...COOKIE_OPTIONS_BASE,
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      ...COOKIE_OPTIONS_BASE,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth',
    });

    return { message: 'Token refrescado exitosamente' };
  }

  @Post('logout')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' })
  async logout(
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const deviceId = req.cookies?.deviceId;
    if (deviceId) {
      await this.logoutUseCase.execute(user.id, deviceId);
    }

    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/auth' });
    res.clearCookie('deviceId', { path: '/' });

    return { message: 'Sesión cerrada exitosamente' };
  }

  @Post('logout-all')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar todas las sesiones' })
  @ApiResponse({ status: 200, description: 'Todas las sesiones cerradas' })
  async logoutAll(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.logoutAllDevicesUseCase.execute(user.id);

    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/auth' });
    res.clearCookie('deviceId', { path: '/' });

    return { message: 'Todas las sesiones cerradas' };
  }

  @Get('profile')
  @Auth()
  @ApiOperation({ summary: 'Obtener perfil del usuario logueado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario', type: ProfileResponseDto })
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.getProfileUseCase.execute(user.id);
  }

  @Patch('profile')
  @Auth()
  @ApiOperation({ summary: 'Actualizar perfil propio' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado', type: ProfileResponseDto })
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.updateProfileUseCase.execute(user.id, dto);
  }
}
