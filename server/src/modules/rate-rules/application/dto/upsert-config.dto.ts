import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpsertConfigDto {
    @ApiProperty({ example: 'checkout_hour', description: 'Clave de configuración' })
    @IsString({ message: 'La clave debe ser un texto' })
    @IsNotEmpty({ message: 'La clave es obligatoria' })
    key: string;

    @ApiProperty({ example: '12:00', description: 'Valor de configuración' })
    @IsString({ message: 'El valor debe ser un texto' })
    @IsNotEmpty({ message: 'El valor es obligatorio' })
    value: string;
}
