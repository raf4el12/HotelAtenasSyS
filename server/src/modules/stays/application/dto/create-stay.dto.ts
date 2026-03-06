import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';

export class CreateStayDto {
    @ApiProperty({ description: 'ID del huésped' })
    @IsString()
    @IsNotEmpty({ message: 'El huésped es obligatorio' })
    guestId: string;

    @ApiProperty({ description: 'ID de la habitación' })
    @IsString()
    @IsNotEmpty({ message: 'La habitación es obligatoria' })
    roomId: string;

    @ApiProperty({ enum: StayMode, description: 'Modalidad de estadía' })
    @IsEnum(StayMode, { message: 'El modo debe ser HOURLY, OVERNIGHT o PACKAGE' })
    stayMode: StayMode;

    @ApiPropertyOptional({ description: 'ID de la tarifa aplicada' })
    @IsOptional()
    @IsString()
    rateRuleId?: string;

    @ApiPropertyOptional({ description: 'ID del paquete aplicado' })
    @IsOptional()
    @IsString()
    packageId?: string;

    @ApiProperty({ example: 50.00, description: 'Precio de la estadía' })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    stayPrice: number;

    @ApiProperty({ description: 'Fecha/hora de check-in' })
    @IsDateString()
    checkIn: string;

    @ApiProperty({ description: 'Fecha/hora de check-out programado' })
    @IsDateString()
    checkOut: string;

    @ApiPropertyOptional({ description: 'ID de la reserva asociada' })
    @IsOptional()
    @IsString()
    reservationId?: string;
}
