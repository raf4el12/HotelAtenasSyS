import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';
import { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';

export class UpdatePackageDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

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
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    totalPrice?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    validFrom?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    validTo?: string;
}
