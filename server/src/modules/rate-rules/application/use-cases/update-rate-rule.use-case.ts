import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IRateRuleRepository } from '../../domain/repositories/rate-rule.repository.js';
import { UpdateRateRuleDto } from '../dto/update-rate-rule.dto.js';
import { RateRuleResponseDto } from '../dto/rate-rule-response.dto.js';
import { mapToRateRuleResponse } from './helpers/map-rate-rule-response.js';

@Injectable()
export class UpdateRateRuleUseCase {
    constructor(
        @Inject('IRateRuleRepository') private readonly rateRuleRepository: IRateRuleRepository,
    ) { }

    async execute(id: string, dto: UpdateRateRuleDto): Promise<RateRuleResponseDto> {
        const existingRule = await this.rateRuleRepository.findById(id);
        if (!existingRule) {
            throw new NotFoundException('Tarifa no encontrada');
        }

        const updateData: any = { ...dto };
        if (dto.validFrom !== undefined) {
            updateData.validFrom = dto.validFrom ? new Date(dto.validFrom) : null;
        }
        if (dto.validTo !== undefined) {
            updateData.validTo = dto.validTo ? new Date(dto.validTo) : null;
        }

        const updatedRule = await this.rateRuleRepository.update(id, updateData);
        return mapToRateRuleResponse(updatedRule);
    }
}
