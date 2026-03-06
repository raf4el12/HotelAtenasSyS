import type { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';
import type { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';

export interface IPricingService {
    calculateStayPrice(params: {
        stayMode: StayMode;
        roomCategory: RoomCategory;
        checkIn: Date;
        checkOut: Date;
        rateRuleId?: string;
        packageId?: string;
    }): Promise<number>;
}
