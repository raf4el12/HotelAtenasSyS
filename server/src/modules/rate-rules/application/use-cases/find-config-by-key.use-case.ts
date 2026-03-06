import { Inject, Injectable } from '@nestjs/common';
import type { IHotelConfigRepository } from '../../domain/repositories/hotel-config.repository.js';
import type { HotelConfigResponseDto } from '../dto/hotel-config-response.dto.js';
import { mapToConfigResponse } from './helpers/map-rate-rule-response.js';

@Injectable()
export class FindConfigByKeyUseCase {
    constructor(
        @Inject('IHotelConfigRepository') private readonly hotelConfigRepository: IHotelConfigRepository,
    ) { }

    async execute(key: string): Promise<HotelConfigResponseDto | null> {
        const config = await this.hotelConfigRepository.findByKey(key);
        return config ? mapToConfigResponse(config) : null;
    }
}
