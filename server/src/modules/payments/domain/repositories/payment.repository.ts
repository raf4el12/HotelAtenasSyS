import type { PaymentEntity } from '../entities/payment.entity.js';
import type { PaymentMethod } from '../../../../shared/domain/enums/payment-method.enum.js';
import type { PaymentType } from '../../../../shared/domain/enums/payment-type.enum.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';

export interface CreatePaymentData {
    amount: number;
    method: PaymentMethod;
    type: PaymentType;
    stayId?: string;
    reservationId?: string;
    saleId?: string;
    notes?: string;
    referenceCode?: string;
    registeredById: string;
}

export interface VoidPaymentData {
    voidedAt: Date;
    voidedById: string;
    voidReason: string;
}

export interface PaymentFilters {
    method?: PaymentMethod;
    type?: PaymentType;
    stayId?: string;
    reservationId?: string;
    voided?: boolean;
}

export interface IPaymentRepository {
    findById(id: string): Promise<PaymentEntity | null>;
    create(data: CreatePaymentData): Promise<PaymentEntity>;
    voidPayment(id: string, data: VoidPaymentData): Promise<PaymentEntity>;
    findAllPaginated(params: PaginationParams, filters?: PaymentFilters): Promise<PaginatedResult<PaymentEntity>>;
    findByStayId(stayId: string): Promise<PaymentEntity[]>;
    sumByStayId(stayId: string): Promise<number>;
}
