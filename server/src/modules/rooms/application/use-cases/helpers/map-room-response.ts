import type { RoomEntity } from '../../../domain/entities/room.entity.js';
import type { RoomStatusLogEntity } from '../../../domain/entities/room-status-log.entity.js';
import { RoomResponseDto } from '../../dto/room-response.dto.js';
import { RoomStatusLogResponseDto } from '../../dto/room-status-log-response.dto.js';

export function mapToRoomResponse(room: RoomEntity): RoomResponseDto {
    const response = new RoomResponseDto();
    response.id = room.id;
    response.number = room.number;
    response.category = room.category;
    response.status = room.status;
    response.floorId = room.floorId;
    response.floor = room.floor
        ? { id: room.floor.id, name: room.floor.name, number: room.floor.number }
        : null;
    response.createdAt = room.createdAt;
    response.updatedAt = room.updatedAt;
    response.deletedAt = room.deletedAt;
    return response;
}

export function mapToStatusLogResponse(log: RoomStatusLogEntity): RoomStatusLogResponseDto {
    const response = new RoomStatusLogResponseDto();
    response.id = log.id;
    response.roomId = log.roomId;
    response.previousStatus = log.previousStatus;
    response.newStatus = log.newStatus;
    response.changedById = log.changedById;
    response.changedBy = log.changedBy
        ? { id: log.changedBy.id, email: log.changedBy.email }
        : null;
    response.createdAt = log.createdAt;
    return response;
}
