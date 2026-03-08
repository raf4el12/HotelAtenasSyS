export type StayStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type StayMode = 'HOURLY' | 'OVERNIGHT' | 'PACKAGE';

export interface StayGuest {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
}

export interface StayRoom {
  id: string;
  number: string;
  category: string;
}

export interface StayUser {
  id: string;
  email: string;
}

export interface Stay {
  id: string;
  guestId: string;
  roomId: string;
  stayMode: StayMode;
  rateRuleId?: string | null;
  packageId?: string | null;
  stayPrice: number;
  checkIn: string;
  checkOut: string;
  actualCheckOut?: string | null;
  status: StayStatus;
  reservationId?: string | null;
  createdById: string;
  checkedOutById?: string | null;
  guest?: StayGuest | null;
  room?: StayRoom | null;
  createdBy?: StayUser | null;
  checkedOutBy?: StayUser | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStayPayload {
  guestId: string;
  roomId: string;
  stayMode: StayMode;
  rateRuleId?: string;
  packageId?: string;
  checkIn: string;
  checkOut: string;
  reservationId?: string;
}
