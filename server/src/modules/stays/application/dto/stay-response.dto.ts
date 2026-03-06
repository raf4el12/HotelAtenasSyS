import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StayGuestDto {
    @ApiProperty() id: string;
    @ApiProperty() dni: string;
    @ApiProperty() firstName: string;
    @ApiProperty() lastName: string;
}

export class StayRoomDto {
    @ApiProperty() id: string;
    @ApiProperty() number: string;
    @ApiProperty() category: string;
}

export class StayUserDto {
    @ApiProperty() id: string;
    @ApiProperty() email: string;
}

export class StayResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() guestId: string;
    @ApiProperty() roomId: string;
    @ApiProperty() stayMode: string;
    @ApiPropertyOptional() rateRuleId: string | null;
    @ApiPropertyOptional() packageId: string | null;
    @ApiProperty() stayPrice: number;
    @ApiProperty() checkIn: Date;
    @ApiProperty() checkOut: Date;
    @ApiPropertyOptional() actualCheckOut: Date | null;
    @ApiProperty() status: string;
    @ApiPropertyOptional() reservationId: string | null;
    @ApiProperty() createdById: string;
    @ApiPropertyOptional() checkedOutById: string | null;
    @ApiPropertyOptional({ type: StayGuestDto }) guest: StayGuestDto | null;
    @ApiPropertyOptional({ type: StayRoomDto }) room: StayRoomDto | null;
    @ApiPropertyOptional({ type: StayUserDto }) createdBy: StayUserDto | null;
    @ApiPropertyOptional({ type: StayUserDto }) checkedOutBy: StayUserDto | null;
    @ApiProperty() createdAt: Date;
    @ApiProperty() updatedAt: Date;
}
