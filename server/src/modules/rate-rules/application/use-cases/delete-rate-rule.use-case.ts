import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IRateRuleRepository } from '../../domain/repositories/rate-rule.repository.js';

@Injectable()
export class DeleteRateRuleUseCase {
    constructor(
        @Inject('IRateRuleRepository') private readonly rateRuleRepository: IRateRuleRepository,
    ) { }

    async execute(id: string): Promise<void> {
        const rule = await this.rateRuleRepository.findById(id);
        if (!rule) {
            throw new NotFoundException('Tarifa no encontrada');
        }
        await this.rateRuleRepository.delete(id);
    }
}
