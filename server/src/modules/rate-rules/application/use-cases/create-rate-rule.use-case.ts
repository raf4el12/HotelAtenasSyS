import { Inject, Injectable } from '@nestjs/common';
import type { IRateRuleRepository } from '../../domain/repositories/rate-rule.repository.js';
import { CreateRateRuleDto } from '../dto/create-rate-rule.dto.js';
import { RateRuleResponseDto } from '../dto/rate-rule-response.dto.js';
import { mapToRateRuleResponse } from './helpers/map-rate-rule-response.js';

@Injectable()
export class CreateRateRuleUseCase {
    constructor(
        @Inject('IRateRuleRepository') private readonly rateRuleRepository: IRateRuleRepository,
    ) { }

    async execute(dto: CreateRateRuleDto): Promise<RateRuleResponseDto> {
        const rule = await this.rateRuleRepository.create({
            name: dto.name,
            description: dto.description,
            stayMode: dto.stayMode,
            category: dto.category,
            price: dto.price,
            durationMin: dto.durationMin,
            validFrom: dto.validFrom ? new Date(dto.validFrom) : undefined,
            validTo: dto.validTo ? new Date(dto.validTo) : undefined,
            priority: dto.priority,
        });

        return mapToRateRuleResponse(rule);
    }
}
