import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IGuestRepository } from '../../domain/repositories/guest.repository.js';
import { GuestResponseDto } from '../dto/guest-response.dto.js';
import { mapToGuestResponse } from './helpers/map-guest-response.js';

@Injectable()
export class FindGuestByDniUseCase {
    constructor(
        @Inject('IGuestRepository') private readonly guestRepository: IGuestRepository,
    ) { }

    async execute(dni: string): Promise<GuestResponseDto> {
        const guest = await this.guestRepository.findByDni(dni);
        if (!guest) {
            throw new NotFoundException('Huésped no encontrado con ese DNI');
        }
        return mapToGuestResponse(guest);
    }
}
