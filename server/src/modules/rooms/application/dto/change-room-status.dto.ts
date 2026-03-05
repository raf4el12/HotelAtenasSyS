import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoomStatus } from '../../../../shared/domain/enums/room-status.enum.js';

export class ChangeRoomStatusDto {
    @ApiProperty({ enum: RoomStatus, description: 'Nuevo estado de la habitación' })
    @IsEnum(RoomStatus, { message: 'El estado debe ser AVAILABLE, OCCUPIED, CLEANING o MAINTENANCE' })
    @IsNotEmpty({ message: 'El estado es obligatorio' })
    status: RoomStatus;
}
