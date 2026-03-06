import type { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';
import { StayStatus } from '../../../../shared/domain/enums/stay-status.enum.js';

export class StayEntity {
  id: string;
  guestId: string;
  roomId: string;
  stayMode: StayMode;
  rateRuleId: string | null;
  packageId: string | null;
  stayPrice: number;
  checkIn: Date;
  checkOut: Date;
  actualCheckOut: Date | null;
  status: StayStatus;
  reservationId: string | null;
  createdById: string;
  checkedOutById: string | null;
  createdAt: Date;
  updatedAt: Date;
  guest?: { id: string; dni: string; firstName: string; lastName: string } | null;
  room?: { id: string; number: string; category: string } | null;
  createdBy?: { id: string; email: string } | null;
  checkedOutBy?: { id: string; email: string } | null;

  canCheckOut(): boolean {
    return this.status === StayStatus.ACTIVE;
  }

  canCancel(): boolean {
    return this.status === StayStatus.ACTIVE;
  }

  isOverdue(now: Date = new Date()): boolean {
    return this.status === StayStatus.ACTIVE && now > this.checkOut;
  }
}
