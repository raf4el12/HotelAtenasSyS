import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { DocumentType, Gender } from '../../../../generated/prisma/client/enums.js';

export class CreateGuestDto {
    @ApiProperty({ example: '12345678', description: 'DNI del huésped' })
    @IsString({ message: 'El DNI debe ser un texto' })
    @IsNotEmpty({ message: 'El DNI es obligatorio' })
    dni: string;

    @ApiProperty({ example: 'Juan', description: 'Nombre del huésped' })
    @IsString({ message: 'El nombre debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    firstName: string;

    @ApiProperty({ example: 'Pérez', description: 'Apellido del huésped' })
    @IsString({ message: 'El apellido debe ser un texto' })
    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    lastName: string;

    @ApiPropertyOptional({ example: '987654321', description: 'Teléfono del huésped' })
    @IsOptional()
    @IsString({ message: 'El teléfono debe ser un texto' })
    phone?: string;

    @ApiPropertyOptional({ example: 'DNI', description: 'Tipo de documento', enum: DocumentType })
    @IsOptional()
    @IsEnum(DocumentType)
    documentType?: DocumentType;

    @ApiPropertyOptional({ example: 'PE', description: 'Nacionalidad' })
    @IsOptional()
    @IsString()
    nationality?: string;

    @ApiPropertyOptional({ example: 'juan@email.com', description: 'Correo electrónico' })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiPropertyOptional({ example: '1990-01-15', description: 'Fecha de nacimiento' })
    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;

    @ApiPropertyOptional({ example: 'MALE', description: 'Género', enum: Gender })
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @ApiPropertyOptional({ example: 'Av. Principal 123', description: 'Dirección' })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ example: 'Lima', description: 'Ciudad' })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional({ example: 'PE', description: 'País' })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiPropertyOptional({ description: 'Notas adicionales' })
    @IsOptional()
    @IsString()
    notes?: string;
}
