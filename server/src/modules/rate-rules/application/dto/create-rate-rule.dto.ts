import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';
import { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';

export class CreateRateRuleDto {
    @ApiProperty({ example: 'Tarifa por hora Normal', description: 'Nombre de la tarifa' })
    @IsString({ message: 'El nombre debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name: string;

    @ApiPropertyOptional({ example: 'Tarifa estándar por hora para habitaciones normales' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ enum: StayMode, description: 'Modalidad de estadía' })
    @IsEnum(StayMode, { message: 'El modo debe ser HOURLY, OVERNIGHT o PACKAGE' })
    stayMode: StayMode;

    @ApiProperty({ enum: RoomCategory, description: 'Categoría de habitación' })
    @IsEnum(RoomCategory, { message: 'La categoría debe ser NORMAL o PREMIUM' })
    category: RoomCategory;

    @ApiProperty({ example: 25.00, description: 'Precio de la tarifa' })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con máximo 2 decimales' })
    @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
    price: number;

    @ApiPropertyOptional({ example: 60, description: 'Duración mínima en minutos (para modo HOURLY)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'La duración mínima debe ser un entero' })
    @Min(1, { message: 'La duración mínima debe ser al menos 1' })
    durationMin?: number;

    @ApiPropertyOptional({ example: '2025-01-01T00:00:00Z', description: 'Fecha de inicio de vigencia' })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida' })
    validFrom?: string;

    @ApiPropertyOptional({ example: '2025-12-31T23:59:59Z', description: 'Fecha de fin de vigencia' })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida' })
    validTo?: string;

    @ApiPropertyOptional({ example: 0, default: 0, description: 'Prioridad (mayor = más prioritario)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'La prioridad debe ser un entero' })
    priority?: number;
}
