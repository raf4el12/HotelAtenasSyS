import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IRoomRepository } from '../../domain/repositories/room.repository.js';
import { ChangeRoomStatusDto } from '../dto/change-room-status.dto.js';
import { RoomResponseDto } from '../dto/room-response.dto.js';
import { mapToRoomResponse } from './helpers/map-room-response.js';

@Injectable()
export class ChangeRoomStatusUseCase {
    constructor(
        @Inject('IRoomRepository') private readonly roomRepository: IRoomRepository,
    ) { }

    async execute(id: string, dto: ChangeRoomStatusDto, userId: string): Promise<RoomResponseDto> {
        const room = await this.roomRepository.findById(id);
        if (!room) {
            throw new NotFoundException('Habitación no encontrada');
        }

        if (room.status === dto.status) {
            throw new BadRequestException(`La habitación ya está en estado ${dto.status}`);
        }

        // Log the status change
        await this.roomRepository.createStatusLog({
            roomId: id,
            previousStatus: room.status,
            newStatus: dto.status,
            changedById: userId,
        });

        // Update the room status
        const updatedRoom = await this.roomRepository.updateStatus(id, dto.status);
        return mapToRoomResponse(updatedRoom);
    }
}
