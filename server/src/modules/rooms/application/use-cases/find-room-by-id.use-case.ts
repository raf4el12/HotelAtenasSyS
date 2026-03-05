import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IRoomRepository } from '../../domain/repositories/room.repository.js';
import { RoomResponseDto } from '../dto/room-response.dto.js';
import { mapToRoomResponse } from './helpers/map-room-response.js';

@Injectable()
export class FindRoomByIdUseCase {
    constructor(
        @Inject('IRoomRepository') private readonly roomRepository: IRoomRepository,
    ) { }

    async execute(id: string): Promise<RoomResponseDto> {
        const room = await this.roomRepository.findById(id);
        if (!room) {
            throw new NotFoundException('Habitación no encontrada');
        }
        return mapToRoomResponse(room);
    }
}
