import type { GuestEntity } from '../entities/guest.entity.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';
import type { DocumentType, Gender } from '../../../../generated/prisma/client/enums.js';

export interface CreateGuestData {
    dni: string;
    firstName: string;
    lastName: string;
    phone?: string;
    documentType?: DocumentType;
    nationality?: string;
    email?: string;
    dateOfBirth?: string | Date;
    gender?: Gender;
    address?: string;
    city?: string;
    country?: string;
    notes?: string;
}

export interface UpdateGuestData {
    dni?: string;
    firstName?: string;
    lastName?: string;
    phone?: string | null;
    documentType?: DocumentType | null;
    nationality?: string | null;
    email?: string | null;
    dateOfBirth?: string | Date | null;
    gender?: Gender | null;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    notes?: string | null;
}

export interface IGuestRepository {
    findById(id: string): Promise<GuestEntity | null>;
    findByDni(dni: string): Promise<GuestEntity | null>;
    existsByDni(dni: string): Promise<boolean>;
    create(data: CreateGuestData): Promise<GuestEntity>;
    findAllPaginated(params: PaginationParams): Promise<PaginatedResult<GuestEntity>>;
    update(id: string, data: UpdateGuestData): Promise<GuestEntity>;
}
