import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductCategory } from '../../../../shared/domain/enums/product-category.enum.js';
import { ProductStatus } from '../../../../shared/domain/enums/product-status.enum.js';

export class UpdateProductDto {
    @ApiPropertyOptional({ example: 'Agua San Luis 1L' })
    @IsOptional()
    @IsString({ message: 'El nombre debe ser un texto' })
    name?: string;

    @ApiPropertyOptional({ enum: ProductCategory })
    @IsOptional()
    @IsEnum(ProductCategory, { message: 'La categoría debe ser un valor válido' })
    category?: ProductCategory;

    @ApiPropertyOptional({ example: 3.00 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con máximo 2 decimales' })
    @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
    price?: number;

    @ApiPropertyOptional({ example: 3 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'El stock mínimo debe ser un entero' })
    @Min(0, { message: 'El stock mínimo debe ser mayor o igual a 0' })
    minStock?: number;

    @ApiPropertyOptional({ enum: ProductStatus })
    @IsOptional()
    @IsEnum(ProductStatus, { message: 'El estado debe ser ACTIVE o DISCONTINUED' })
    status?: ProductStatus;
}
