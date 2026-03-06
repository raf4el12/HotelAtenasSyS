import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { StayStatus } from '../../../../shared/domain/enums/stay-status.enum.js';
import { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';

export class FindAllStaysDto {
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

    @ApiPropertyOptional({ enum: StayStatus })
    @IsOptional()
    @IsEnum(StayStatus)
    status?: StayStatus;

    @ApiPropertyOptional({ enum: StayMode })
    @IsOptional()
    @IsEnum(StayMode)
    stayMode?: StayMode;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    roomId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    guestId?: string;
}
