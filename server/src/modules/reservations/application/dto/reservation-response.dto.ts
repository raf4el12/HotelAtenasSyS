import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReservationGuestDto {
    @ApiProperty() id: string;
    @ApiProperty() dni: string;
    @ApiProperty() firstName: string;
    @ApiProperty() lastName: string;
}

export class ReservationRoomDto {
    @ApiProperty() id: string;
    @ApiProperty() number: string;
    @ApiProperty() category: string;
}

export class ReservationUserDto {
    @ApiProperty() id: string;
    @ApiProperty() email: string;
}

export class ReservationResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() guestId: string;
    @ApiProperty() roomId: string;
    @ApiProperty() stayMode: string;
    @ApiProperty() scheduledCheckIn: Date;
    @ApiProperty() scheduledCheckOut: Date;
    @ApiProperty() estimatedPrice: number;
    @ApiProperty() status: string;
    @ApiPropertyOptional() notes: string | null;
    @ApiProperty() createdById: string;
    @ApiPropertyOptional({ type: ReservationGuestDto }) guest: ReservationGuestDto | null;
    @ApiPropertyOptional({ type: ReservationRoomDto }) room: ReservationRoomDto | null;
    @ApiPropertyOptional({ type: ReservationUserDto }) createdBy: ReservationUserDto | null;
    @ApiProperty() createdAt: Date;
    @ApiProperty() updatedAt: Date;
}
