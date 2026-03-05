import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IRoomRepository } from '../../domain/repositories/room.repository.js';

@Injectable()
export class DeleteRoomUseCase {
    constructor(
        @Inject('IRoomRepository') private readonly roomRepository: IRoomRepository,
    ) { }

    async execute(id: string): Promise<void> {
        const room = await this.roomRepository.findById(id);
        if (!room) {
            throw new NotFoundException('Habitación no encontrada');
        }

        await this.roomRepository.softDelete(id);
    }
}
