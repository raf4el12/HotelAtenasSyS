import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IReservationRepository } from '../../domain/repositories/reservation.repository.js';
import type { IGuestRepository } from '../../../guests/domain/repositories/guest.repository.js';
import type { IRoomRepository } from '../../../rooms/domain/repositories/room.repository.js';
import { CreateReservationDto } from '../dto/create-reservation.dto.js';
import { ReservationResponseDto } from '../dto/reservation-response.dto.js';
import { mapToReservationResponse } from './helpers/map-reservation-response.js';

@Injectable()
export class CreateReservationUseCase {
    constructor(
        @Inject('IReservationRepository') private readonly reservationRepository: IReservationRepository,
        @Inject('IGuestRepository') private readonly guestRepository: IGuestRepository,
        @Inject('IRoomRepository') private readonly roomRepository: IRoomRepository,
    ) { }

    async execute(dto: CreateReservationDto, userId: string): Promise<ReservationResponseDto> {
        const guest = await this.guestRepository.findById(dto.guestId);
        if (!guest) throw new NotFoundException('Huésped no encontrado');

        const room = await this.roomRepository.findById(dto.roomId);
        if (!room) throw new NotFoundException('Habitación no encontrada');

        const overlapping = await this.reservationRepository.findOverlapping(
            dto.roomId,
            new Date(dto.scheduledCheckIn),
            new Date(dto.scheduledCheckOut),
        );
        if (overlapping.length > 0) {
            throw new ConflictException('Ya existe una reserva para esta habitación en las fechas indicadas');
        }

        const reservation = await this.reservationRepository.create({
            guestId: dto.guestId,
            roomId: dto.roomId,
            stayMode: dto.stayMode,
            scheduledCheckIn: new Date(dto.scheduledCheckIn),
            scheduledCheckOut: new Date(dto.scheduledCheckOut),
            estimatedPrice: dto.estimatedPrice,
            notes: dto.notes,
            createdById: userId,
        });

        return mapToReservationResponse(reservation);
    }
}
