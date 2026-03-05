import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import type { IFloorRepository } from '../../domain/repositories/floor.repository.js';
import { UpdateFloorDto } from '../dto/update-floor.dto.js';
import { FloorResponseDto } from '../dto/floor-response.dto.js';
import { mapToFloorResponse } from './helpers/map-floor-response.js';

@Injectable()
export class UpdateFloorUseCase {
    constructor(
        @Inject('IFloorRepository') private readonly floorRepository: IFloorRepository,
    ) { }

    async execute(id: string, dto: UpdateFloorDto): Promise<FloorResponseDto> {
        const existingFloor = await this.floorRepository.findById(id);
        if (!existingFloor) {
            throw new NotFoundException('Piso no encontrado');
        }

        if (dto.name && dto.name !== existingFloor.name) {
            const nameExists = await this.floorRepository.existsByName(dto.name);
            if (nameExists) {
                throw new ConflictException('Ya existe un piso con ese nombre');
            }
        }

        if (dto.number !== undefined && dto.number !== existingFloor.number) {
            const numberExists = await this.floorRepository.existsByNumber(dto.number);
            if (numberExists) {
                throw new ConflictException('Ya existe un piso con ese número');
            }
        }

        const updatedFloor = await this.floorRepository.update(id, dto);
        return mapToFloorResponse(updatedFloor);
    }
}
