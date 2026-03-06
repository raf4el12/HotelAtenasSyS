import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IStayRepository } from '../../domain/repositories/stay.repository.js';
import { StayResponseDto } from '../dto/stay-response.dto.js';
import { RoomStatus } from '../../../../shared/domain/enums/room-status.enum.js';
import { mapToStayResponse } from './helpers/map-stay-response.js';

@Injectable()
export class CheckOutStayUseCase {
    constructor(
        @Inject('IStayRepository') private readonly stayRepository: IStayRepository,
    ) { }

    async execute(id: string, userId: string): Promise<StayResponseDto> {
        const stay = await this.stayRepository.findById(id);
        if (!stay) throw new NotFoundException('Estadía no encontrada');

        if (!stay.canCheckOut()) {
            throw new BadRequestException('Solo se puede hacer check-out de estadías activas');
        }

        stay.markAsCheckedOut(userId);

        const updated = await this.stayRepository.updateAndChangeRoomStatus(
            id,
            { status: stay.status, actualCheckOut: stay.actualCheckOut!, checkedOutById: stay.checkedOutById! },
            stay.roomId,
            RoomStatus.CLEANING,
        );

        return mapToStayResponse(updated);
    }
}
