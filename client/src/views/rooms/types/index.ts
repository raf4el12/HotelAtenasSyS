export type RoomCategory = 'NORMAL' | 'PREMIUM';
export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE';

export interface RoomFloor {
  id: string;
  name: string;
  number: number;
}

export interface Room {
  id: string;
  number: string;
  category: RoomCategory;
  status: RoomStatus;
  maxGuests: number;
  bedType?: string;
  hasWindow: boolean;
  notes?: string;
  floorId: string;
  floor: RoomFloor;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomPayload {
  number: string;
  category?: RoomCategory;
  floorId: string;
}

export interface UpdateRoomStatusPayload {
  status: RoomStatus;
}
