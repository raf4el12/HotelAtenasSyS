import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ReservationStatus } from '../../../../shared/domain/enums/reservation-status.enum.js';
import { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';

export class FindAllReservationsDto {
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

    @ApiPropertyOptional({ enum: ReservationStatus })
    @IsOptional()
    @IsEnum(ReservationStatus)
    status?: ReservationStatus;

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
