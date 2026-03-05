import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateFloorDto {
    @ApiProperty({ example: 'Piso 1', description: 'Nombre del piso' })
    @IsString({ message: 'El nombre debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name: string;

    @ApiProperty({ example: 1, description: 'Número del piso' })
    @IsInt({ message: 'El número de piso debe ser un entero' })
    @Min(0, { message: 'El número de piso debe ser mayor o igual a 0' })
    number: number;
}
