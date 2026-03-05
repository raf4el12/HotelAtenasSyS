import type { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';
import type { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';

export class RateRuleEntity {
    id: string;
    name: string;
    description: string | null;
    stayMode: StayMode;
    category: RoomCategory;
    price: number;
    durationMin: number | null;
    validFrom: Date | null;
    validTo: Date | null;
    priority: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
