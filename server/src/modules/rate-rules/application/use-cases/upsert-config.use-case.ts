import { Inject, Injectable } from '@nestjs/common';
import type { IHotelConfigRepository } from '../../domain/repositories/hotel-config.repository.js';
import type { HotelConfigResponseDto } from '../dto/hotel-config-response.dto.js';
import { UpsertConfigDto } from '../dto/upsert-config.dto.js';
import { mapToConfigResponse } from './helpers/map-rate-rule-response.js';

@Injectable()
export class UpsertConfigUseCase {
    constructor(
        @Inject('IHotelConfigRepository') private readonly hotelConfigRepository: IHotelConfigRepository,
    ) { }

    async execute(dto: UpsertConfigDto): Promise<HotelConfigResponseDto> {
        const config = await this.hotelConfigRepository.upsert(dto.key, dto.value);
        return mapToConfigResponse(config);
    }
}
