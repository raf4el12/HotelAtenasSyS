import { Inject, Injectable } from '@nestjs/common';
import type { IRateRuleRepository } from '../../domain/repositories/rate-rule.repository.js';
import { PaginationImproved } from '../../../../shared/utils/value-objects/pagination-improved.value-object.js';
import { FindAllRateRulesDto } from '../dto/find-all-rate-rules.dto.js';
import type { RateRuleResponseDto } from '../dto/rate-rule-response.dto.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import { mapToRateRuleResponse } from './helpers/map-rate-rule-response.js';

@Injectable()
export class FindAllRateRulesUseCase {
    constructor(
        @Inject('IRateRuleRepository') private readonly rateRuleRepository: IRateRuleRepository,
    ) { }

    async execute(dto: FindAllRateRulesDto): Promise<PaginatedResult<RateRuleResponseDto>> {
        const pagination = new PaginationImproved(
            dto.searchValue,
            dto.currentPage,
            dto.pageSize,
            dto.orderBy,
            dto.orderByMode,
        );

        const { offset, limit } = pagination.getOffsetLimit();

        const result = await this.rateRuleRepository.findAllPaginated(
            { offset, limit, searchValue: dto.searchValue, orderBy: dto.orderBy, orderByMode: dto.orderByMode },
            { stayMode: dto.stayMode, category: dto.category, isActive: dto.isActive },
        );

        return {
            ...result,
            rows: result.rows.map(mapToRateRuleResponse),
        };
    }
}
