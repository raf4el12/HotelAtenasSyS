import type { PaymentEntity } from '../../../domain/entities/payment.entity.js';
import { PaymentResponseDto } from '../../dto/payment-response.dto.js';

export function mapToPaymentResponse(p: PaymentEntity): PaymentResponseDto {
    const r = new PaymentResponseDto();
    r.id = p.id;
    r.amount = p.amount;
    r.method = p.method;
    r.type = p.type;
    r.stayId = p.stayId;
    r.reservationId = p.reservationId;
    r.saleId = p.saleId;
    r.notes = p.notes;
    r.referenceCode = p.referenceCode;
    r.voidedAt = p.voidedAt;
    r.voidedById = p.voidedById;
    r.voidReason = p.voidReason;
    r.registeredById = p.registeredById;
    r.stay = p.stay ?? null;
    r.registeredBy = p.registeredBy ?? null;
    r.voidedBy = p.voidedBy ?? null;
    r.createdAt = p.createdAt;
    return r;
}
