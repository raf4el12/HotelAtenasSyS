import type { StayEntity } from '../../../domain/entities/stay.entity.js';
import { StayResponseDto } from '../../dto/stay-response.dto.js';

export function mapToStayResponse(stay: StayEntity): StayResponseDto {
    const r = new StayResponseDto();
    r.id = stay.id;
    r.guestId = stay.guestId;
    r.roomId = stay.roomId;
    r.stayMode = stay.stayMode;
    r.rateRuleId = stay.rateRuleId;
    r.packageId = stay.packageId;
    r.stayPrice = stay.stayPrice;
    r.checkIn = stay.checkIn;
    r.checkOut = stay.checkOut;
    r.actualCheckOut = stay.actualCheckOut;
    r.status = stay.status;
    r.reservationId = stay.reservationId;
    r.createdById = stay.createdById;
    r.checkedOutById = stay.checkedOutById;
    r.guest = stay.guest ? { id: stay.guest.id, dni: stay.guest.dni, firstName: stay.guest.firstName, lastName: stay.guest.lastName } : null;
    r.room = stay.room ? { id: stay.room.id, number: stay.room.number, category: stay.room.category } : null;
    r.createdBy = stay.createdBy ? { id: stay.createdBy.id, email: stay.createdBy.email } : null;
    r.checkedOutBy = stay.checkedOutBy ? { id: stay.checkedOutBy.id, email: stay.checkedOutBy.email } : null;
    r.createdAt = stay.createdAt;
    r.updatedAt = stay.updatedAt;
    return r;
}
