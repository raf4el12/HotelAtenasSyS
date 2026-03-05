import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';
import { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';

export class FindAllPackagesDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    searchValue?: string;

    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    currentPage?: number;

    @ApiPropertyOptional({ default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    pageSize?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    orderBy?: string;

    @ApiPropertyOptional({ enum: ['asc', 'desc'] })
    @IsOptional()
    @IsString()
    orderByMode?: string;

    @ApiPropertyOptional({ enum: RoomCategory })
    @IsOptional()
    @IsEnum(RoomCategory)
    category?: RoomCategory;

    @ApiPropertyOptional({ enum: StayMode })
    @IsOptional()
    @IsEnum(StayMode)
    stayMode?: StayMode;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    isActive?: boolean;
}
