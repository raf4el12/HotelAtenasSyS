import type { GuestEntity } from '../entities/guest.entity.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';

export interface CreateGuestData {
    dni: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

export interface UpdateGuestData {
    dni?: string;
    firstName?: string;
    lastName?: string;
    phone?: string | null;
}

export interface IGuestRepository {
    findById(id: string): Promise<GuestEntity | null>;
    findByDni(dni: string): Promise<GuestEntity | null>;
    existsByDni(dni: string): Promise<boolean>;
    create(data: CreateGuestData): Promise<GuestEntity>;
    findAllPaginated(params: PaginationParams): Promise<PaginatedResult<GuestEntity>>;
    update(id: string, data: UpdateGuestData): Promise<GuestEntity>;
}
