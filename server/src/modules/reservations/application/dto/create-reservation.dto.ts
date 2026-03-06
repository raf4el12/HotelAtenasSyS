import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';

export class CreateReservationDto {
    @ApiProperty({ description: 'ID del huésped' })
    @IsString()
    @IsNotEmpty({ message: 'El huésped es obligatorio' })
    guestId: string;

    @ApiProperty({ description: 'ID de la habitación' })
    @IsString()
    @IsNotEmpty({ message: 'La habitación es obligatoria' })
    roomId: string;

    @ApiProperty({ enum: StayMode })
    @IsEnum(StayMode, { message: 'El modo debe ser HOURLY, OVERNIGHT o PACKAGE' })
    stayMode: StayMode;

    @ApiProperty({ description: 'Fecha/hora de check-in programado' })
    @IsDateString()
    scheduledCheckIn: string;

    @ApiProperty({ description: 'Fecha/hora de check-out programado' })
    @IsDateString()
    scheduledCheckOut: string;

    @ApiProperty({ example: 100.00, description: 'Precio estimado' })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    estimatedPrice: number;

    @ApiPropertyOptional({ description: 'Notas adicionales' })
    @IsOptional()
    @IsString()
    notes?: string;
}
