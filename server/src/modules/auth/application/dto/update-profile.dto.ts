import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Carlos' })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'García' })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser un texto' })
  lastName?: string;

  @ApiPropertyOptional({ example: '987654321' })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un texto' })
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'La URL del avatar debe ser un texto' })
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'Av. Principal 123' })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser un texto' })
  address?: string;

  @ApiPropertyOptional({ example: 'Miraflores' })
  @IsOptional()
  @IsString({ message: 'El distrito debe ser un texto' })
  district?: string;

  @ApiPropertyOptional({ example: 'Lima' })
  @IsOptional()
  @IsString({ message: 'La ciudad debe ser un texto' })
  city?: string;

  @ApiPropertyOptional({ example: 'Lima' })
  @IsOptional()
  @IsString({ message: 'La provincia debe ser un texto' })
  province?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'El nombre del contacto de emergencia debe ser un texto' })
  emergencyContactName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'El teléfono del contacto de emergencia debe ser un texto' })
  emergencyContactPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'La relación del contacto de emergencia debe ser un texto' })
  emergencyContactRelation?: string;
}
