import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../../../shared/domain/enums/user-role.enum.js';
import { UpdateProfileAdminDto } from './update-profile-admin.dto.js';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'nuevo@hotelatenas.com' })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe ser un correo válido' })
  email?: string;

  @ApiPropertyOptional({ example: 'NuevaPass123!' })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol debe ser un valor válido' })
  role?: UserRole;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  isActive?: boolean;

  @ApiPropertyOptional({ type: UpdateProfileAdminDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateProfileAdminDto)
  profile?: UpdateProfileAdminDto;
}
