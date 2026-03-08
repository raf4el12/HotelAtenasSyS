export interface Guest {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
  phone?: string;
  documentType?: string;
  nationality?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuestPayload {
  dni: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
}
