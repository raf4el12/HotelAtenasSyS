import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductCategory } from '../../../../shared/domain/enums/product-category.enum.js';

export class CreateProductDto {
    @ApiProperty({ example: 'Agua San Luis 500ml', description: 'Nombre del producto' })
    @IsString({ message: 'El nombre debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name: string;

    @ApiProperty({ enum: ProductCategory, description: 'Categoría del producto' })
    @IsEnum(ProductCategory, { message: 'La categoría debe ser un valor válido' })
    category: ProductCategory;

    @ApiProperty({ example: 2.50, description: 'Precio del producto' })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con máximo 2 decimales' })
    @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
    price: number;

    @ApiPropertyOptional({ example: 20, default: 0, description: 'Stock inicial' })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'El stock debe ser un entero' })
    @Min(0, { message: 'El stock debe ser mayor o igual a 0' })
    stock?: number;

    @ApiPropertyOptional({ example: 5, default: 5, description: 'Stock mínimo para alertas' })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'El stock mínimo debe ser un entero' })
    @Min(0, { message: 'El stock mínimo debe ser mayor o igual a 0' })
    minStock?: number;
}
