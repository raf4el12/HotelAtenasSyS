import type { RateRuleEntity } from '../entities/rate-rule.entity.js';
import type { HotelConfigEntity } from '../entities/hotel-config.entity.js';
import type { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';
import type { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';

export interface CreateRateRuleData {
    name: string;
    description?: string;
    stayMode: StayMode;
    category: RoomCategory;
    price: number;
    durationMin?: number;
    validFrom?: Date;
    validTo?: Date;
    priority?: number;
}

export interface UpdateRateRuleData {
    name?: string;
    description?: string | null;
    stayMode?: StayMode;
    category?: RoomCategory;
    price?: number;
    durationMin?: number | null;
    validFrom?: Date | null;
    validTo?: Date | null;
    priority?: number;
    isActive?: boolean;
}

export interface IRateRuleRepository {
    findById(id: string): Promise<RateRuleEntity | null>;
    create(data: CreateRateRuleData): Promise<RateRuleEntity>;
    findAllPaginated(
        params: PaginationParams,
        filters?: { stayMode?: StayMode; category?: RoomCategory; isActive?: boolean },
    ): Promise<PaginatedResult<RateRuleEntity>>;
    update(id: string, data: UpdateRateRuleData): Promise<RateRuleEntity>;
    delete(id: string): Promise<void>;

    // HotelConfig
    findAllConfig(): Promise<HotelConfigEntity[]>;
    findConfigByKey(key: string): Promise<HotelConfigEntity | null>;
    upsertConfig(key: string, value: string): Promise<HotelConfigEntity>;
}
