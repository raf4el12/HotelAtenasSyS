import type { ReservationEntity } from '../../../domain/entities/reservation.entity.js';
import { ReservationResponseDto } from '../../dto/reservation-response.dto.js';

export function mapToReservationResponse(res: ReservationEntity): ReservationResponseDto {
    const r = new ReservationResponseDto();
    r.id = res.id;
    r.guestId = res.guestId;
    r.roomId = res.roomId;
    r.stayMode = res.stayMode;
    r.scheduledCheckIn = res.scheduledCheckIn;
    r.scheduledCheckOut = res.scheduledCheckOut;
    r.estimatedPrice = res.estimatedPrice;
    r.status = res.status;
    r.notes = res.notes;
    r.createdById = res.createdById;
    r.guest = res.guest ? { id: res.guest.id, dni: res.guest.dni, firstName: res.guest.firstName, lastName: res.guest.lastName } : null;
    r.room = res.room ? { id: res.room.id, number: res.room.number, category: res.room.category } : null;
    r.createdBy = res.createdBy ? { id: res.createdBy.id, email: res.createdBy.email } : null;
    r.createdAt = res.createdAt;
    r.updatedAt = res.updatedAt;
    return r;
}
