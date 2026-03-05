import { Inject, Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import type { IRoomRepository } from '../../domain/repositories/room.repository.js';
import type { IFloorRepository } from '../../../floors/domain/repositories/floor.repository.js';
import { CreateRoomDto } from '../dto/create-room.dto.js';
import { RoomResponseDto } from '../dto/room-response.dto.js';
import { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';
import { mapToRoomResponse } from './helpers/map-room-response.js';

@Injectable()
export class CreateRoomUseCase {
    constructor(
        @Inject('IRoomRepository') private readonly roomRepository: IRoomRepository,
        @Inject('IFloorRepository') private readonly floorRepository: IFloorRepository,
    ) { }

    async execute(dto: CreateRoomDto): Promise<RoomResponseDto> {
        const floor = await this.floorRepository.findById(dto.floorId);
        if (!floor) {
            throw new NotFoundException('Piso no encontrado');
        }

        const numberExists = await this.roomRepository.existsByNumber(dto.number);
        if (numberExists) {
            throw new ConflictException('Ya existe una habitación con ese número');
        }

        const room = await this.roomRepository.create({
            number: dto.number,
            category: dto.category ?? RoomCategory.NORMAL,
            floorId: dto.floorId,
        });

        return mapToRoomResponse(room);
    }
}
