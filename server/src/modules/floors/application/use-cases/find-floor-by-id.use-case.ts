import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IFloorRepository } from '../../domain/repositories/floor.repository.js';
import { FloorResponseDto } from '../dto/floor-response.dto.js';
import { mapToFloorResponse } from './helpers/map-floor-response.js';

@Injectable()
export class FindFloorByIdUseCase {
    constructor(
        @Inject('IFloorRepository') private readonly floorRepository: IFloorRepository,
    ) { }

    async execute(id: string): Promise<FloorResponseDto> {
        const floor = await this.floorRepository.findById(id);
        if (!floor) {
            throw new NotFoundException('Piso no encontrado');
        }
        return mapToFloorResponse(floor);
    }
}
