import type { FloorEntity } from '../entities/floor.entity.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';

export interface IFloorRepository {
    findById(id: string): Promise<FloorEntity | null>;
    findByName(name: string): Promise<FloorEntity | null>;
    findByNumber(number: number): Promise<FloorEntity | null>;
    existsByName(name: string): Promise<boolean>;
    existsByNumber(number: number): Promise<boolean>;
    create(data: { name: string; number: number }): Promise<FloorEntity>;
    findAllPaginated(params: PaginationParams): Promise<PaginatedResult<FloorEntity>>;
    update(id: string, data: Partial<{ name: string; number: number }>): Promise<FloorEntity>;
    softDelete(id: string): Promise<void>;
    restore(id: string): Promise<FloorEntity>;
}
