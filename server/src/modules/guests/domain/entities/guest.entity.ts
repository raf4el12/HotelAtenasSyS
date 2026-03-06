import type { DocumentType } from '../../../../shared/domain/enums/document-type.enum.js';
import type { Gender } from '../../../../shared/domain/enums/gender.enum.js';

export class GuestEntity {
    id: string;
    dni: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    documentType: DocumentType;
    nationality: string | null;
    email: string | null;
    dateOfBirth: Date | null;
    gender: Gender | null;
    address: string | null;
    city: string | null;
    country: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}
