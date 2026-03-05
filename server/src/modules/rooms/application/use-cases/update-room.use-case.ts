import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import type { IRoomRepository } from '../../domain/repositories/room.repository.js';
import type { IFloorRepository } from '../../../floors/domain/repositories/floor.repository.js';
import { UpdateRoomDto } from '../dto/update-room.dto.js';
import { RoomResponseDto } from '../dto/room-response.dto.js';
import { mapToRoomResponse } from './helpers/map-room-response.js';

@Injectable()
export class UpdateRoomUseCase {
    constructor(
        @Inject('IRoomRepository') private readonly roomRepository: IRoomRepository,
        @Inject('IFloorRepository') private readonly floorRepository: IFloorRepository,
    ) { }

    async execute(id: string, dto: UpdateRoomDto): Promise<RoomResponseDto> {
        const existingRoom = await this.roomRepository.findById(id);
        if (!existingRoom) {
            throw new NotFoundException('Habitación no encontrada');
        }

        if (dto.number && dto.number !== existingRoom.number) {
            const numberExists = await this.roomRepository.existsByNumber(dto.number);
            if (numberExists) {
                throw new ConflictException('Ya existe una habitación con ese número');
            }
        }

        if (dto.floorId && dto.floorId !== existingRoom.floorId) {
            const floor = await this.floorRepository.findById(dto.floorId);
            if (!floor) {
                throw new NotFoundException('Piso no encontrado');
            }
        }

        const updatedRoom = await this.roomRepository.update(id, dto);
        return mapToRoomResponse(updatedRoom);
    }
}
