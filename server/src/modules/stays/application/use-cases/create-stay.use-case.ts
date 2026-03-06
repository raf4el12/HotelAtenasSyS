import { Inject, Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import type { IStayRepository } from '../../domain/repositories/stay.repository.js';
import type { IRoomRepository } from '../../../rooms/domain/repositories/room.repository.js';
import type { IGuestRepository } from '../../../guests/domain/repositories/guest.repository.js';
import type { IPricingService } from '../../domain/services/pricing.service.js';
import { CreateStayDto } from '../dto/create-stay.dto.js';
import { StayResponseDto } from '../dto/stay-response.dto.js';
import { mapToStayResponse } from './helpers/map-stay-response.js';

@Injectable()
export class CreateStayUseCase {
    constructor(
        @Inject('IStayRepository') private readonly stayRepository: IStayRepository,
        @Inject('IRoomRepository') private readonly roomRepository: IRoomRepository,
        @Inject('IGuestRepository') private readonly guestRepository: IGuestRepository,
        @Inject('IPricingService') private readonly pricingService: IPricingService,
    ) { }

    async execute(dto: CreateStayDto, userId: string): Promise<StayResponseDto> {
        const guest = await this.guestRepository.findById(dto.guestId);
        if (!guest) throw new NotFoundException('Huésped no encontrado');

        const room = await this.roomRepository.findById(dto.roomId);
        if (!room) throw new NotFoundException('Habitación no encontrada');
        if (!room.isAvailable()) {
            throw new ConflictException('La habitación no está disponible');
        }

        const activeStay = await this.stayRepository.findActiveByRoom(dto.roomId);
        if (activeStay) {
            throw new ConflictException('La habitación ya tiene una estadía activa');
        }

        const calculatedPrice = await this.pricingService.calculateStayPrice({
            stayMode: dto.stayMode,
            roomCategory: room.category,
            checkIn: new Date(dto.checkIn),
            checkOut: new Date(dto.checkOut),
            rateRuleId: dto.rateRuleId,
            packageId: dto.packageId,
        });

        const stay = await this.stayRepository.createAndOccupyRoom({
            guestId: dto.guestId,
            roomId: dto.roomId,
            stayMode: dto.stayMode,
            rateRuleId: dto.rateRuleId,
            packageId: dto.packageId,
            stayPrice: calculatedPrice,
            checkIn: new Date(dto.checkIn),
            checkOut: new Date(dto.checkOut),
            reservationId: dto.reservationId,
            createdById: userId,
        }, dto.roomId);

        return mapToStayResponse(stay);
    }
}
