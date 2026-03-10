import type { GuestEntity } from '../../../domain/entities/guest.entity.js';
import { GuestResponseDto } from '../../dto/guest-response.dto.js';

export function mapToGuestResponse(guest: GuestEntity): GuestResponseDto {
    const response = new GuestResponseDto();
    response.id = guest.id;
    response.dni = guest.dni;
    response.firstName = guest.firstName;
    response.lastName = guest.lastName;
    response.phone = guest.phone;
    response.documentType = guest.documentType;
    response.nationality = guest.nationality;
    response.email = guest.email;
    response.dateOfBirth = guest.dateOfBirth;
    response.gender = guest.gender;
    response.address = guest.address;
    response.city = guest.city;
    response.country = guest.country;
    response.notes = guest.notes;
    response.createdAt = guest.createdAt;
    response.updatedAt = guest.updatedAt;
    return response;
}
