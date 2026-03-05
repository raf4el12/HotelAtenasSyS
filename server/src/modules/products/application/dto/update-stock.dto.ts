import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStockDto {
    @ApiProperty({ example: 15, description: 'Nuevo valor de stock' })
    @Type(() => Number)
    @IsInt({ message: 'El stock debe ser un entero' })
    @Min(0, { message: 'El stock debe ser mayor o igual a 0' })
    stock: number;
}
