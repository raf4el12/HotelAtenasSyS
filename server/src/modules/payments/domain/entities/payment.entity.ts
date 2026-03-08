import type { PaymentMethod } from '../../../../shared/domain/enums/payment-method.enum.js';
import type { PaymentType } from '../../../../shared/domain/enums/payment-type.enum.js';

export class PaymentEntity {
    id: string;
    amount: number;
    method: PaymentMethod;
    type: PaymentType;
    stayId: string | null;
    reservationId: string | null;
    saleId: string | null;
    notes: string | null;
    referenceCode: string | null;
    voidedAt: Date | null;
    voidedById: string | null;
    voidReason: string | null;
    registeredById: string;
    createdAt: Date;

    stay?: { id: string; room?: { number: string } | null; guest?: { firstName: string; lastName: string } | null } | null;
    reservation?: { id: string } | null;
    sale?: { id: string } | null;
    registeredBy?: { id: string; email: string } | null;
    voidedBy?: { id: string; email: string } | null;

    isVoided(): boolean {
        return this.voidedAt !== null;
    }

    canVoid(): boolean {
        return !this.isVoided();
    }

    markAsVoided(userId: string, reason: string): void {
        this.voidedAt = new Date();
        this.voidedById = userId;
        this.voidReason = reason;
    }
}
