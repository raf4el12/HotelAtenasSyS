export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED' | 'NO_SHOW';
export type StayMode = 'HOURLY' | 'OVERNIGHT' | 'PACKAGE';

export interface ReservationGuest {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
}

export interface ReservationRoom {
  id: string;
  number: string;
  category: string;
}

export interface ReservationUser {
  id: string;
  email: string;
}

export interface Reservation {
  id: string;
  guestId: string;
  roomId: string;
  stayMode: StayMode;
  scheduledCheckIn: string;
  scheduledCheckOut: string;
  estimatedPrice: number;
  status: ReservationStatus;
  notes?: string | null;
  createdById: string;
  guest?: ReservationGuest | null;
  room?: ReservationRoom | null;
  createdBy?: ReservationUser | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationPayload {
  guestId: string;
  roomId: string;
  stayMode: StayMode;
  scheduledCheckIn: string;
  scheduledCheckOut: string;
  estimatedPrice: number;
  notes?: string;
}
