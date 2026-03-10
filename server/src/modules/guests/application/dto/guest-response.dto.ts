import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GuestResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    dni: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiPropertyOptional()
    phone: string | null;

    @ApiProperty({ example: 'DNI' })
    documentType: string;

    @ApiPropertyOptional()
    nationality: string | null;

    @ApiPropertyOptional()
    email: string | null;

    @ApiPropertyOptional()
    dateOfBirth: Date | null;

    @ApiPropertyOptional()
    gender: string | null;

    @ApiPropertyOptional()
    address: string | null;

    @ApiPropertyOptional()
    city: string | null;

    @ApiPropertyOptional()
    country: string | null;

    @ApiPropertyOptional()
    notes: string | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
