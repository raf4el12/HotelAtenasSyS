import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IStayRepository } from '../../domain/repositories/stay.repository.js';
import { StayResponseDto } from '../dto/stay-response.dto.js';
import { RoomStatus } from '../../../../shared/domain/enums/room-status.enum.js';
import { mapToStayResponse } from './helpers/map-stay-response.js';

@Injectable()
export class CancelStayUseCase {
    constructor(
        @Inject('IStayRepository') private readonly stayRepository: IStayRepository,
    ) { }

    async execute(id: string): Promise<StayResponseDto> {
        const stay = await this.stayRepository.findById(id);
        if (!stay) throw new NotFoundException('Estadía no encontrada');

        if (!stay.canCancel()) {
            throw new BadRequestException('Solo se puede cancelar estadías activas');
        }

        stay.markAsCancelled();

        const cancelled = await this.stayRepository.updateAndChangeRoomStatus(
            id,
            { status: stay.status },
            stay.roomId,
            RoomStatus.AVAILABLE,
        );

        return mapToStayResponse(cancelled);
    }
}
