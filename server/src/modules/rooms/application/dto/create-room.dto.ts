import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';

export class CreateRoomDto {
    @ApiProperty({ example: '101', description: 'Número de habitación' })
    @IsString({ message: 'El número de habitación debe ser un texto' })
    @IsNotEmpty({ message: 'El número de habitación es obligatorio' })
    number: string;

    @ApiPropertyOptional({ enum: RoomCategory, default: RoomCategory.NORMAL, description: 'Categoría de habitación' })
    @IsOptional()
    @IsEnum(RoomCategory, { message: 'La categoría debe ser NORMAL o PREMIUM' })
    category?: RoomCategory;

    @ApiProperty({ description: 'ID del piso al que pertenece' })
    @IsString({ message: 'El ID del piso debe ser un texto' })
    @IsNotEmpty({ message: 'El piso es obligatorio' })
    floorId: string;
}
