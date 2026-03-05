import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';
import { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';

export class FindAllRateRulesDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    searchValue?: string;

    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'La página debe ser un número' })
    currentPage?: number;

    @ApiPropertyOptional({ default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'El tamaño de página debe ser un número' })
    pageSize?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    orderBy?: string;

    @ApiPropertyOptional({ enum: ['asc', 'desc'] })
    @IsOptional()
    @IsString()
    orderByMode?: string;

    @ApiPropertyOptional({ enum: StayMode, description: 'Filtrar por modalidad' })
    @IsOptional()
    @IsEnum(StayMode)
    stayMode?: StayMode;

    @ApiPropertyOptional({ enum: RoomCategory, description: 'Filtrar por categoría' })
    @IsOptional()
    @IsEnum(RoomCategory)
    category?: RoomCategory;

    @ApiPropertyOptional({ description: 'Filtrar por activo/inactivo' })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    isActive?: boolean;
}
