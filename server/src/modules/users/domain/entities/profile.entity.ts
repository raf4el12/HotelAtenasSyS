import type { ShiftType } from '../../../../shared/domain/enums/shift-type.enum.js';

export class ProfileEntity {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string | null;
  avatarUrl: string | null;
  birthDate: Date | null;
  address: string | null;
  district: string | null;
  city: string | null;
  province: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelation: string | null;
  shift: ShiftType | null;
  shiftNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
