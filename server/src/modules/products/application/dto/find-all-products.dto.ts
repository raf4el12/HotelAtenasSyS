import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductCategory } from '../../../../shared/domain/enums/product-category.enum.js';
import { ProductStatus } from '../../../../shared/domain/enums/product-status.enum.js';

export class FindAllProductsDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    searchValue?: string;

    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'La página debe ser un número' })
    currentPage?: number;

    @ApiPropertyOptional({ default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'El tamaño de página debe ser un número' })
    pageSize?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    orderBy?: string;

    @ApiPropertyOptional({ enum: ['asc', 'desc'] })
    @IsOptional()
    @IsString()
    orderByMode?: string;

    @ApiPropertyOptional({ enum: ProductCategory })
    @IsOptional()
    @IsEnum(ProductCategory)
    category?: ProductCategory;

    @ApiPropertyOptional({ enum: ProductStatus })
    @IsOptional()
    @IsEnum(ProductStatus)
    status?: ProductStatus;
}
