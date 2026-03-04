import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ShiftType } from '../../../../shared/domain/enums/shift-type.enum.js';

export class CreateProfileDto {
  @ApiProperty({ example: 'María' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  firstName: string;

  @ApiProperty({ example: 'González' })
  @IsString({ message: 'El apellido debe ser un texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName: string;

  @ApiProperty({ example: '12345678' })
  @IsString({ message: 'El DNI debe ser un texto' })
  @Matches(/^\d{8}$/, { message: 'El DNI debe tener 8 dígitos' })
  dni: string;

  @ApiPropertyOptional({ example: '987654321' })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un texto' })
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'La URL del avatar debe ser un texto' })
  avatarUrl?: string;

  @ApiPropertyOptional({ example: '1990-01-15' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida' })
  birthDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'La dirección debe ser un texto' })
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'El distrito debe ser un texto' })
  district?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'La ciudad debe ser un texto' })
  city?: string;

  @ApiPropertyOptional()
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

  @ApiPropertyOptional({ enum: ShiftType })
  @IsOptional()
  @IsEnum(ShiftType, { message: 'El turno debe ser un valor válido' })
  shift?: ShiftType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Las notas de turno deben ser un texto' })
  shiftNotes?: string;
}
