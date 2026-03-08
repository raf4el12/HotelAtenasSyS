import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentStayDto {
    @ApiProperty() id: string;
    @ApiPropertyOptional() room?: { number: string } | null;
    @ApiPropertyOptional() guest?: { firstName: string; lastName: string } | null;
}

export class PaymentUserDto {
    @ApiProperty() id: string;
    @ApiProperty() email: string;
}

export class PaymentResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() amount: number;
    @ApiProperty() method: string;
    @ApiProperty() type: string;
    @ApiPropertyOptional() stayId: string | null;
    @ApiPropertyOptional() reservationId: string | null;
    @ApiPropertyOptional() saleId: string | null;
    @ApiPropertyOptional() notes: string | null;
    @ApiPropertyOptional() referenceCode: string | null;
    @ApiPropertyOptional() voidedAt: Date | null;
    @ApiPropertyOptional() voidedById: string | null;
    @ApiPropertyOptional() voidReason: string | null;
    @ApiProperty() registeredById: string;
    @ApiPropertyOptional({ type: PaymentStayDto }) stay: PaymentStayDto | null;
    @ApiPropertyOptional({ type: PaymentUserDto }) registeredBy: PaymentUserDto | null;
    @ApiPropertyOptional({ type: PaymentUserDto }) voidedBy: PaymentUserDto | null;
    @ApiProperty() createdAt: Date;
}
