import { Inject, Injectable, ConflictException } from '@nestjs/common';
import type { IFloorRepository } from '../../domain/repositories/floor.repository.js';
import { CreateFloorDto } from '../dto/create-floor.dto.js';
import { FloorResponseDto } from '../dto/floor-response.dto.js';
import { mapToFloorResponse } from './helpers/map-floor-response.js';

@Injectable()
export class CreateFloorUseCase {
    constructor(
        @Inject('IFloorRepository') private readonly floorRepository: IFloorRepository,
    ) { }

    async execute(dto: CreateFloorDto): Promise<FloorResponseDto> {
        const nameExists = await this.floorRepository.existsByName(dto.name);
        if (nameExists) {
            throw new ConflictException('Ya existe un piso con ese nombre');
        }

        const numberExists = await this.floorRepository.existsByNumber(dto.number);
        if (numberExists) {
            throw new ConflictException('Ya existe un piso con ese número');
        }

        const floor = await this.floorRepository.create({
            name: dto.name,
            number: dto.number,
        });

        return mapToFloorResponse(floor);
    }
}
