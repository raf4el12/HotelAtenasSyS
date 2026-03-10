import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service.js';
import type { IGuestRepository, CreateGuestData, UpdateGuestData } from '../../domain/repositories/guest.repository.js';
import { GuestEntity } from '../../domain/entities/guest.entity.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';

function mapToGuestEntity(prismaGuest: any): GuestEntity {
    const guest = new GuestEntity();
    guest.id = prismaGuest.id;
    guest.dni = prismaGuest.dni;
    guest.firstName = prismaGuest.firstName;
    guest.lastName = prismaGuest.lastName;
    guest.phone = prismaGuest.phone;
    guest.documentType = prismaGuest.documentType;
    guest.nationality = prismaGuest.nationality;
    guest.email = prismaGuest.email;
    guest.dateOfBirth = prismaGuest.dateOfBirth;
    guest.gender = prismaGuest.gender;
    guest.address = prismaGuest.address;
    guest.city = prismaGuest.city;
    guest.country = prismaGuest.country;
    guest.notes = prismaGuest.notes;
    guest.createdAt = prismaGuest.createdAt;
    guest.updatedAt = prismaGuest.updatedAt;
    return guest;
}

@Injectable()
export class PrismaGuestRepository implements IGuestRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<GuestEntity | null> {
        const guest = await this.prisma.guest.findUnique({ where: { id } });
        return guest ? mapToGuestEntity(guest) : null;
    }

    async findByDni(dni: string): Promise<GuestEntity | null> {
        const guest = await this.prisma.guest.findUnique({ where: { dni } });
        return guest ? mapToGuestEntity(guest) : null;
    }

    async existsByDni(dni: string): Promise<boolean> {
        const guest = await this.prisma.guest.findUnique({ where: { dni } });
        return guest !== null;
    }

    async create(data: CreateGuestData): Promise<GuestEntity> {
        const guest = await this.prisma.guest.create({
            data: {
                ...data,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
            },
        });
        return mapToGuestEntity(guest);
    }

    async findAllPaginated(params: PaginationParams): Promise<PaginatedResult<GuestEntity>> {
        const where: any = {
            ...(params.searchValue && {
                OR: [
                    { dni: { contains: params.searchValue } },
                    { firstName: { contains: params.searchValue, mode: 'insensitive' } },
                    { lastName: { contains: params.searchValue, mode: 'insensitive' } },
                    { phone: { contains: params.searchValue } },
                ],
            }),
        };

        const orderByField = params.orderBy ?? 'createdAt';
        const orderByMode = (params.orderByMode as 'asc' | 'desc') ?? 'desc';

        const [guests, total] = await Promise.all([
            this.prisma.guest.findMany({
                where,
                skip: params.offset,
                take: params.limit,
                orderBy: { [orderByField]: orderByMode },
            }),
            this.prisma.guest.count({ where }),
        ]);

        return {
            totalRows: total,
            rows: guests.map(mapToGuestEntity),
            totalPages: Math.ceil(total / params.limit),
            currentPage: Math.floor(params.offset / params.limit) + 1,
        };
    }

    async update(id: string, data: UpdateGuestData): Promise<GuestEntity> {
        const guest = await this.prisma.guest.update({
            where: { id },
            data: {
                ...data,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
            },
        });
        return mapToGuestEntity(guest);
    }
}
