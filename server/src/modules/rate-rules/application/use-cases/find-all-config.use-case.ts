import { Inject, Injectable } from '@nestjs/common';
import type { IHotelConfigRepository } from '../../domain/repositories/hotel-config.repository.js';
import type { HotelConfigResponseDto } from '../dto/hotel-config-response.dto.js';
import { mapToConfigResponse } from './helpers/map-rate-rule-response.js';

@Injectable()
export class FindAllConfigUseCase {
    constructor(
        @Inject('IHotelConfigRepository') private readonly hotelConfigRepository: IHotelConfigRepository,
    ) { }

    async execute(): Promise<HotelConfigResponseDto[]> {
        const configs = await this.hotelConfigRepository.findAll();
        return configs.map(mapToConfigResponse);
    }
}
