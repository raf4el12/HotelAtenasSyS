import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';
import { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';

export class PackageItemInputDto {
    @ApiProperty({ description: 'ID del producto' })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ example: 2, description: 'Cantidad' })
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreatePackageDto {
    @ApiProperty({ example: 'Paquete Romántico', description: 'Nombre del paquete' })
    @IsString({ message: 'El nombre debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name: string;

    @ApiPropertyOptional({ example: 'Incluye bebidas y snacks' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ enum: RoomCategory })
    @IsEnum(RoomCategory, { message: 'La categoría debe ser NORMAL o PREMIUM' })
    category: RoomCategory;

    @ApiProperty({ enum: StayMode })
    @IsEnum(StayMode, { message: 'El modo debe ser HOURLY, OVERNIGHT o PACKAGE' })
    stayMode: StayMode;

    @ApiProperty({ example: 150.00, description: 'Precio total del paquete' })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe tener máximo 2 decimales' })
    @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
    totalPrice: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString({}, { message: 'Fecha válida requerida' })
    validFrom?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString({}, { message: 'Fecha válida requerida' })
    validTo?: string;

    @ApiProperty({ type: [PackageItemInputDto], description: 'Productos incluidos en el paquete' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PackageItemInputDto)
    items: PackageItemInputDto[];
}
