import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllGuestsDto {
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
}
