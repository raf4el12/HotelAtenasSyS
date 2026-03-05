import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}
