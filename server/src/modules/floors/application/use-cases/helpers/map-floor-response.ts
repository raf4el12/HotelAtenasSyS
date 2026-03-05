import type { FloorEntity } from '../../../domain/entities/floor.entity.js';
import { FloorResponseDto } from '../../dto/floor-response.dto.js';

export function mapToFloorResponse(floor: FloorEntity): FloorResponseDto {
    const response = new FloorResponseDto();
    response.id = floor.id;
    response.name = floor.name;
    response.number = floor.number;
    response.createdAt = floor.createdAt;
    response.updatedAt = floor.updatedAt;
    response.deletedAt = floor.deletedAt;
    return response;
}
