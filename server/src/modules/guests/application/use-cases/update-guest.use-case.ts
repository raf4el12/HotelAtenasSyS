import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import type { IGuestRepository } from '../../domain/repositories/guest.repository.js';
import { UpdateGuestDto } from '../dto/update-guest.dto.js';
import { GuestResponseDto } from '../dto/guest-response.dto.js';
import { mapToGuestResponse } from './helpers/map-guest-response.js';

@Injectable()
export class UpdateGuestUseCase {
    constructor(
        @Inject('IGuestRepository') private readonly guestRepository: IGuestRepository,
    ) { }

    async execute(id: string, dto: UpdateGuestDto): Promise<GuestResponseDto> {
        const existingGuest = await this.guestRepository.findById(id);
        if (!existingGuest) {
            throw new NotFoundException('Huésped no encontrado');
        }

        if (dto.dni && dto.dni !== existingGuest.dni) {
            const dniExists = await this.guestRepository.existsByDni(dto.dni);
            if (dniExists) {
                throw new ConflictException('Ya existe un huésped con ese DNI');
            }
        }

        const updatedGuest = await this.guestRepository.update(id, dto);
        return mapToGuestResponse(updatedGuest);
    }
}
