import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateFloorDto {
    @ApiPropertyOptional({ example: 'Piso 1 Renovado', description: 'Nombre del piso' })
    @IsOptional()
    @IsString({ message: 'El nombre debe ser un texto' })
    name?: string;

    @ApiPropertyOptional({ example: 2, description: 'Número del piso' })
    @IsOptional()
    @IsInt({ message: 'El número de piso debe ser un entero' })
    @Min(0, { message: 'El número de piso debe ser mayor o igual a 0' })
    number?: number;
}
