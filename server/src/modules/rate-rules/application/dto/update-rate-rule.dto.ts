import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';
import { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';

export class UpdateRateRuleDto {
    @ApiPropertyOptional({ example: 'Tarifa actualizada' })
    @IsOptional()
    @IsString({ message: 'El nombre debe ser un texto' })
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ enum: StayMode })
    @IsOptional()
    @IsEnum(StayMode, { message: 'El modo debe ser HOURLY, OVERNIGHT o PACKAGE' })
    stayMode?: StayMode;

    @ApiPropertyOptional({ enum: RoomCategory })
    @IsOptional()
    @IsEnum(RoomCategory, { message: 'La categoría debe ser NORMAL o PREMIUM' })
    category?: RoomCategory;

    @ApiPropertyOptional({ example: 30.00 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con máximo 2 decimales' })
    @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
    price?: number;

    @ApiPropertyOptional({ example: 90 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'La duración mínima debe ser un entero' })
    @Min(1, { message: 'La duración mínima debe ser al menos 1' })
    durationMin?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida' })
    validFrom?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida' })
    validTo?: string;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'La prioridad debe ser un entero' })
    priority?: number;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean({ message: 'isActive debe ser un booleano' })
    isActive?: boolean;
}
