import { Inject, Injectable } from '@nestjs/common';
import type { IRateRuleRepository } from '../../domain/repositories/rate-rule.repository.js';
import type { HotelConfigResponseDto } from '../dto/hotel-config-response.dto.js';
import { UpsertConfigDto } from '../dto/upsert-config.dto.js';
import { mapToConfigResponse } from './helpers/map-rate-rule-response.js';

@Injectable()
export class ManageConfigUseCase {
    constructor(
        @Inject('IRateRuleRepository') private readonly rateRuleRepository: IRateRuleRepository,
    ) { }

    async findAll(): Promise<HotelConfigResponseDto[]> {
        const configs = await this.rateRuleRepository.findAllConfig();
        return configs.map(mapToConfigResponse);
    }

    async findByKey(key: string): Promise<HotelConfigResponseDto | null> {
        const config = await this.rateRuleRepository.findConfigByKey(key);
        return config ? mapToConfigResponse(config) : null;
    }

    async upsert(dto: UpsertConfigDto): Promise<HotelConfigResponseDto> {
        const config = await this.rateRuleRepository.upsertConfig(dto.key, dto.value);
        return mapToConfigResponse(config);
    }
}
