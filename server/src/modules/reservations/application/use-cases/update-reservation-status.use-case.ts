import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IReservationRepository } from '../../domain/repositories/reservation.repository.js';
import { ReservationResponseDto } from '../dto/reservation-response.dto.js';
import { ReservationStatus } from '../../../../shared/domain/enums/reservation-status.enum.js';
import { mapToReservationResponse } from './helpers/map-reservation-response.js';

@Injectable()
export class UpdateReservationStatusUseCase {
    constructor(
        @Inject('IReservationRepository') private readonly reservationRepository: IReservationRepository,
    ) { }

    async execute(id: string, status: ReservationStatus): Promise<ReservationResponseDto> {
        const reservation = await this.reservationRepository.findById(id);
        if (!reservation) throw new NotFoundException('Reserva no encontrada');

        if (!reservation.canTransitionTo(status)) {
            throw new BadRequestException(`No se puede cambiar de ${reservation.status} a ${status}`);
        }

        const updated = await this.reservationRepository.updateStatus(id, status);
        return mapToReservationResponse(updated);
    }
}
