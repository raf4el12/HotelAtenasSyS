import type { RateRuleEntity } from '../../../domain/entities/rate-rule.entity.js';
import type { HotelConfigEntity } from '../../../domain/entities/hotel-config.entity.js';
import { RateRuleResponseDto } from '../../dto/rate-rule-response.dto.js';
import { HotelConfigResponseDto } from '../../dto/hotel-config-response.dto.js';

export function mapToRateRuleResponse(rule: RateRuleEntity): RateRuleResponseDto {
    const response = new RateRuleResponseDto();
    response.id = rule.id;
    response.name = rule.name;
    response.description = rule.description;
    response.stayMode = rule.stayMode;
    response.category = rule.category;
    response.price = rule.price;
    response.durationMin = rule.durationMin;
    response.validFrom = rule.validFrom;
    response.validTo = rule.validTo;
    response.priority = rule.priority;
    response.isActive = rule.isActive;
    response.createdAt = rule.createdAt;
    response.updatedAt = rule.updatedAt;
    return response;
}

export function mapToConfigResponse(config: HotelConfigEntity): HotelConfigResponseDto {
    const response = new HotelConfigResponseDto();
    response.id = config.id;
    response.key = config.key;
    response.value = config.value;
    response.updatedAt = config.updatedAt;
    return response;
}
