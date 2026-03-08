import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VoidPaymentDto {
    @ApiProperty({ example: 'Pago duplicado' })
    @IsNotEmpty()
    @IsString()
    reason: string;
}
