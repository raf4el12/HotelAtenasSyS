import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IStayRepository } from '../../domain/repositories/stay.repository.js';
import type { IRoomRepository } from '../../../rooms/domain/repositories/room.repository.js';
import { StayResponseDto } from '../dto/stay-response.dto.js';
import { RoomStatus } from '../../../../shared/domain/enums/room-status.enum.js';
import { mapToStayResponse } from './helpers/map-stay-response.js';

@Injectable()
export class CancelStayUseCase {
    constructor(
        @Inject('IStayRepository') private readonly stayRepository: IStayRepository,
        @Inject('IRoomRepository') private readonly roomRepository: IRoomRepository,
    ) { }

    async execute(id: string): Promise<StayResponseDto> {
        const stay = await this.stayRepository.findById(id);
        if (!stay) throw new NotFoundException('Estadía no encontrada');

        if (!stay.canCancel()) {
            throw new BadRequestException('Solo se puede cancelar estadías activas');
        }

        const cancelled = await this.stayRepository.cancel(id);

        // Free the room
        await this.roomRepository.updateStatus(stay.roomId, RoomStatus.AVAILABLE);

        return mapToStayResponse(cancelled);
    }
}
