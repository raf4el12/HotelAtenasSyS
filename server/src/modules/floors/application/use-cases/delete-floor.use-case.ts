import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IFloorRepository } from '../../domain/repositories/floor.repository.js';

@Injectable()
export class DeleteFloorUseCase {
    constructor(
        @Inject('IFloorRepository') private readonly floorRepository: IFloorRepository,
    ) { }

    async execute(id: string): Promise<void> {
        const floor = await this.floorRepository.findById(id);
        if (!floor) {
            throw new NotFoundException('Piso no encontrado');
        }

        await this.floorRepository.softDelete(id);
    }
}
