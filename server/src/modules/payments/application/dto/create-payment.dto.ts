import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaymentMethod } from '../../../../shared/domain/enums/payment-method.enum.js';
import { PaymentType } from '../../../../shared/domain/enums/payment-type.enum.js';

export class CreatePaymentDto {
    @ApiProperty({ example: 150.00 })
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    amount: number;

    @ApiProperty({ enum: PaymentMethod })
    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    method: PaymentMethod;

    @ApiProperty({ enum: PaymentType })
    @IsNotEmpty()
    @IsEnum(PaymentType)
    type: PaymentType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    stayId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    reservationId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    saleId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiPropertyOptional({ description: 'Código de referencia (nro operación, Stripe payment intent ID, etc.)' })
    @IsOptional()
    @IsString()
    referenceCode?: string;
}
