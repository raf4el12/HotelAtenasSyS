import { Inject, Injectable, ConflictException } from '@nestjs/common';
import type { IGuestRepository } from '../../domain/repositories/guest.repository.js';
import { CreateGuestDto } from '../dto/create-guest.dto.js';
import { GuestResponseDto } from '../dto/guest-response.dto.js';
import { mapToGuestResponse } from './helpers/map-guest-response.js';

@Injectable()
export class CreateGuestUseCase {
    constructor(
        @Inject('IGuestRepository') private readonly guestRepository: IGuestRepository,
    ) { }

    async execute(dto: CreateGuestDto): Promise<GuestResponseDto> {
        const dniExists = await this.guestRepository.existsByDni(dto.dni);
        if (dniExists) {
            throw new ConflictException('Ya existe un huésped con ese DNI');
        }

        const guest = await this.guestRepository.create(dto);
        return mapToGuestResponse(guest);
    }
}
