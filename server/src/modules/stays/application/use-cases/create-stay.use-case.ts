import { Inject, Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import type { IStayRepository } from '../../domain/repositories/stay.repository.js';
import type { IRoomRepository } from '../../../rooms/domain/repositories/room.repository.js';
import type { IGuestRepository } from '../../../guests/domain/repositories/guest.repository.js';
import { CreateStayDto } from '../dto/create-stay.dto.js';
import { StayResponseDto } from '../dto/stay-response.dto.js';
import { RoomStatus } from '../../../../shared/domain/enums/room-status.enum.js';
import { mapToStayResponse } from './helpers/map-stay-response.js';

@Injectable()
export class CreateStayUseCase {
    constructor(
        @Inject('IStayRepository') private readonly stayRepository: IStayRepository,
        @Inject('IRoomRepository') private readonly roomRepository: IRoomRepository,
        @Inject('IGuestRepository') private readonly guestRepository: IGuestRepository,
    ) { }

    async execute(dto: CreateStayDto, userId: string): Promise<StayResponseDto> {
        // Validate guest exists
        const guest = await this.guestRepository.findById(dto.guestId);
        if (!guest) throw new NotFoundException('Huésped no encontrado');

        // Validate room exists and is available
        const room = await this.roomRepository.findById(dto.roomId);
        if (!room) throw new NotFoundException('Habitación no encontrada');
        if (!room.isAvailable()) {
            throw new ConflictException('La habitación no está disponible');
        }

        // Check no active stay on this room
        const activeStay = await this.stayRepository.findActiveByRoom(dto.roomId);
        if (activeStay) {
            throw new ConflictException('La habitación ya tiene una estadía activa');
        }

        // Create stay
        const stay = await this.stayRepository.create({
            guestId: dto.guestId,
            roomId: dto.roomId,
            stayMode: dto.stayMode,
            rateRuleId: dto.rateRuleId,
            packageId: dto.packageId,
            stayPrice: dto.stayPrice,
            checkIn: new Date(dto.checkIn),
            checkOut: new Date(dto.checkOut),
            reservationId: dto.reservationId,
            createdById: userId,
        });

        // Update room status to OCCUPIED
        await this.roomRepository.updateStatus(dto.roomId, RoomStatus.OCCUPIED);

        return mapToStayResponse(stay);
    }
}
