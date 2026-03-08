export type PaymentMethod = 'CASH' | 'YAPE' | 'PLIN' | 'TRANSFER' | 'CARD';
export type PaymentType = 'STAY_PAYMENT' | 'RESERVATION_DEPOSIT' | 'POS_SALE' | 'ROOM_CHARGE' | 'ROOM_CHARGE_SETTLE';

export interface PaymentStay {
  id: string;
  room?: { number: string } | null;
  guest?: { firstName: string; lastName: string } | null;
}

export interface PaymentUser {
  id: string;
  email: string;
}

export interface Payment {
  id: string;
  amount: number;
  method: PaymentMethod;
  type: PaymentType;
  stayId: string | null;
  reservationId: string | null;
  saleId: string | null;
  notes: string | null;
  referenceCode: string | null;
  voidedAt: string | null;
  voidedById: string | null;
  voidReason: string | null;
  registeredById: string;
  stay: PaymentStay | null;
  registeredBy: PaymentUser | null;
  voidedBy: PaymentUser | null;
  createdAt: string;
}

export interface CreatePaymentPayload {
  amount: number;
  method: PaymentMethod;
  type: PaymentType;
  stayId?: string;
  reservationId?: string;
  saleId?: string;
  notes?: string;
  referenceCode?: string;
}

export interface VoidPaymentPayload {
  reason: string;
}
