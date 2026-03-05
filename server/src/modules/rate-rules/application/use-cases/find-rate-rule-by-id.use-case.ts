import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IRateRuleRepository } from '../../domain/repositories/rate-rule.repository.js';
import { RateRuleResponseDto } from '../dto/rate-rule-response.dto.js';
import { mapToRateRuleResponse } from './helpers/map-rate-rule-response.js';

@Injectable()
export class FindRateRuleByIdUseCase {
    constructor(
        @Inject('IRateRuleRepository') private readonly rateRuleRepository: IRateRuleRepository,
    ) { }

    async execute(id: string): Promise<RateRuleResponseDto> {
        const rule = await this.rateRuleRepository.findById(id);
        if (!rule) {
            throw new NotFoundException('Tarifa no encontrada');
        }
        return mapToRateRuleResponse(rule);
    }
}
