import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IRoomRepository } from '../../domain/repositories/room.repository.js';
import type { RoomStatusLogResponseDto } from '../dto/room-status-log-response.dto.js';
import { mapToStatusLogResponse } from './helpers/map-room-response.js';

@Injectable()
export class FindRoomStatusLogsUseCase {
    constructor(
        @Inject('IRoomRepository') private readonly roomRepository: IRoomRepository,
    ) { }

    async execute(roomId: string): Promise<RoomStatusLogResponseDto[]> {
        const room = await this.roomRepository.findById(roomId);
        if (!room) {
            throw new NotFoundException('Habitación no encontrada');
        }

        const logs = await this.roomRepository.findStatusLogs(roomId, 50);
        return logs.map(mapToStatusLogResponse);
    }
}
