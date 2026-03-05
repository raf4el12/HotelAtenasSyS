import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateGuestDto {
    @ApiPropertyOptional({ example: '87654321', description: 'DNI del huésped' })
    @IsOptional()
    @IsString({ message: 'El DNI debe ser un texto' })
    dni?: string;

    @ApiPropertyOptional({ example: 'Carlos', description: 'Nombre del huésped' })
    @IsOptional()
    @IsString({ message: 'El nombre debe ser un texto' })
    firstName?: string;

    @ApiPropertyOptional({ example: 'García', description: 'Apellido del huésped' })
    @IsOptional()
    @IsString({ message: 'El apellido debe ser un texto' })
    lastName?: string;

    @ApiPropertyOptional({ example: '912345678', description: 'Teléfono del huésped' })
    @IsOptional()
    @IsString({ message: 'El teléfono debe ser un texto' })
    phone?: string;
}
