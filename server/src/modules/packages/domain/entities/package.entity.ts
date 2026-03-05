import type { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';
import type { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';

export class PackageItemEntity {
    id: string;
    packageId: string;
    productId: string;
    quantity: number;
    product?: { id: string; name: string; price: number } | null;
}

export class PackageEntity {
    id: string;
    name: string;
    description: string | null;
    category: RoomCategory;
    stayMode: StayMode;
    totalPrice: number;
    isActive: boolean;
    validFrom: Date | null;
    validTo: Date | null;
    createdAt: Date;
    updatedAt: Date;
    items?: PackageItemEntity[];
}
