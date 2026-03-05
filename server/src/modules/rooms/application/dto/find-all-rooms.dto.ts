import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { RoomStatus } from '../../../../shared/domain/enums/room-status.enum.js';
import { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';

export class FindAllRoomsDto {
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

    @ApiPropertyOptional({ description: 'Filtrar por piso' })
    @IsOptional()
    @IsString()
    floorId?: string;

    @ApiPropertyOptional({ enum: RoomStatus, description: 'Filtrar por estado' })
    @IsOptional()
    @IsEnum(RoomStatus)
    status?: RoomStatus;

    @ApiPropertyOptional({ enum: RoomCategory, description: 'Filtrar por categoría' })
    @IsOptional()
    @IsEnum(RoomCategory)
    category?: RoomCategory;
}
