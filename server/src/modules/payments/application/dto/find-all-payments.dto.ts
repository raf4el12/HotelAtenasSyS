import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PaymentMethod } from '../../../../shared/domain/enums/payment-method.enum.js';
import { PaymentType } from '../../../../shared/domain/enums/payment-type.enum.js';

export class FindAllPaymentsDto {
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

    @ApiPropertyOptional({ enum: PaymentMethod })
    @IsOptional()
    @IsEnum(PaymentMethod)
    method?: PaymentMethod;

    @ApiPropertyOptional({ enum: PaymentType })
    @IsOptional()
    @IsEnum(PaymentType)
    type?: PaymentType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    stayId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    reservationId?: string;

    @ApiPropertyOptional({ description: 'Filtrar por pagos anulados (true/false)' })
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    voided?: boolean;
}
