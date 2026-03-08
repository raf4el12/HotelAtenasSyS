import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service.js';
import type { IPaymentRepository, CreatePaymentData, VoidPaymentData, PaymentFilters } from '../../domain/repositories/payment.repository.js';
import { PaymentEntity } from '../../domain/entities/payment.entity.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';

const paymentInclude = {
    stay: {
        select: {
            id: true,
            room: { select: { number: true } },
            guest: { select: { firstName: true, lastName: true } },
        },
    },
    reservation: { select: { id: true } },
    sale: { select: { id: true } },
    registeredBy: { select: { id: true, email: true } },
    voidedBy: { select: { id: true, email: true } },
};

function mapToPaymentEntity(p: any): PaymentEntity {
    const e = new PaymentEntity();
    e.id = p.id;
    e.amount = Number(p.amount);
    e.method = p.method;
    e.type = p.type;
    e.stayId = p.stayId;
    e.reservationId = p.reservationId;
    e.saleId = p.saleId;
    e.notes = p.notes;
    e.referenceCode = p.referenceCode;
    e.voidedAt = p.voidedAt;
    e.voidedById = p.voidedById;
    e.voidReason = p.voidReason;
    e.registeredById = p.registeredById;
    e.createdAt = p.createdAt;
    e.stay = p.stay ?? null;
    e.reservation = p.reservation ?? null;
    e.sale = p.sale ?? null;
    e.registeredBy = p.registeredBy ?? null;
    e.voidedBy = p.voidedBy ?? null;
    return e;
}

@Injectable()
export class PrismaPaymentRepository implements IPaymentRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string): Promise<PaymentEntity | null> {
        const p = await this.prisma.payment.findUnique({ where: { id }, include: paymentInclude });
        return p ? mapToPaymentEntity(p) : null;
    }

    async create(data: CreatePaymentData): Promise<PaymentEntity> {
        const p = await this.prisma.payment.create({ data, include: paymentInclude });
        return mapToPaymentEntity(p);
    }

    async voidPayment(id: string, data: VoidPaymentData): Promise<PaymentEntity> {
        const p = await this.prisma.payment.update({
            where: { id },
            data,
            include: paymentInclude,
        });
        return mapToPaymentEntity(p);
    }

    async findAllPaginated(
        params: PaginationParams,
        filters?: PaymentFilters,
    ): Promise<PaginatedResult<PaymentEntity>> {
        const where: any = {
            ...(filters?.method && { method: filters.method }),
            ...(filters?.type && { type: filters.type }),
            ...(filters?.stayId && { stayId: filters.stayId }),
            ...(filters?.reservationId && { reservationId: filters.reservationId }),
            ...(filters?.voided === true && { voidedAt: { not: null } }),
            ...(filters?.voided === false && { voidedAt: null }),
            ...(params.searchValue && {
                OR: [
                    { referenceCode: { contains: params.searchValue, mode: 'insensitive' } },
                    { notes: { contains: params.searchValue, mode: 'insensitive' } },
                    { stay: { guest: { firstName: { contains: params.searchValue, mode: 'insensitive' } } } },
                    { stay: { guest: { lastName: { contains: params.searchValue, mode: 'insensitive' } } } },
                ],
            }),
        };

        const orderByField = params.orderBy ?? 'createdAt';
        const orderByMode = (params.orderByMode as 'asc' | 'desc') ?? 'desc';

        const [payments, total] = await Promise.all([
            this.prisma.payment.findMany({
                where,
                skip: params.offset,
                take: params.limit,
                orderBy: { [orderByField]: orderByMode },
                include: paymentInclude,
            }),
            this.prisma.payment.count({ where }),
        ]);

        return {
            totalRows: total,
            rows: payments.map(mapToPaymentEntity),
            totalPages: Math.ceil(total / params.limit),
            currentPage: Math.floor(params.offset / params.limit) + 1,
        };
    }

    async findByStayId(stayId: string): Promise<PaymentEntity[]> {
        const payments = await this.prisma.payment.findMany({
            where: { stayId, voidedAt: null },
            include: paymentInclude,
            orderBy: { createdAt: 'desc' },
        });
        return payments.map(mapToPaymentEntity);
    }

    async sumByStayId(stayId: string): Promise<number> {
        const result = await this.prisma.payment.aggregate({
            where: { stayId, voidedAt: null },
            _sum: { amount: true },
        });
        return Number(result._sum.amount ?? 0);
    }
}
