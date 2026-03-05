import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';

export class UpdateRoomDto {
    @ApiPropertyOptional({ example: '102', description: 'Número de habitación' })
    @IsOptional()
    @IsString({ message: 'El número de habitación debe ser un texto' })
    number?: string;

    @ApiPropertyOptional({ enum: RoomCategory, description: 'Categoría de habitación' })
    @IsOptional()
    @IsEnum(RoomCategory, { message: 'La categoría debe ser NORMAL o PREMIUM' })
    category?: RoomCategory;

    @ApiPropertyOptional({ description: 'ID del piso al que pertenece' })
    @IsOptional()
    @IsString({ message: 'El ID del piso debe ser un texto' })
    floorId?: string;
}
