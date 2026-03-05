import type { PackageEntity } from '../entities/package.entity.js';
import type { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';
import type { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';

export interface PackageItemInput {
    productId: string;
    quantity: number;
}

export interface CreatePackageData {
    name: string;
    description?: string;
    category: RoomCategory;
    stayMode: StayMode;
    totalPrice: number;
    validFrom?: Date;
    validTo?: Date;
    items: PackageItemInput[];
}

export interface UpdatePackageData {
    name?: string;
    description?: string | null;
    category?: RoomCategory;
    stayMode?: StayMode;
    totalPrice?: number;
    isActive?: boolean;
    validFrom?: Date | null;
    validTo?: Date | null;
}

export interface IPackageRepository {
    findById(id: string): Promise<PackageEntity | null>;
    create(data: CreatePackageData): Promise<PackageEntity>;
    findAllPaginated(
        params: PaginationParams,
        filters?: { category?: RoomCategory; stayMode?: StayMode; isActive?: boolean },
    ): Promise<PaginatedResult<PackageEntity>>;
    update(id: string, data: UpdatePackageData): Promise<PackageEntity>;
    delete(id: string): Promise<void>;
    addItem(packageId: string, item: PackageItemInput): Promise<PackageEntity>;
    removeItem(packageId: string, productId: string): Promise<PackageEntity>;
}
