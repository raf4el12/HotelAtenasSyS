import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IReservationRepository } from '../../domain/repositories/reservation.repository.js';
import { ReservationResponseDto } from '../dto/reservation-response.dto.js';
import { mapToReservationResponse } from './helpers/map-reservation-response.js';

@Injectable()
export class FindReservationByIdUseCase {
    constructor(
        @Inject('IReservationRepository') private readonly reservationRepository: IReservationRepository,
    ) { }

    async execute(id: string): Promise<ReservationResponseDto> {
        const reservation = await this.reservationRepository.findById(id);
        if (!reservation) throw new NotFoundException('Reserva no encontrada');
        return mapToReservationResponse(reservation);
    }
}
