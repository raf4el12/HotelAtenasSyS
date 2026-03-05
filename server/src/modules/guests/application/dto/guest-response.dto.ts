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

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
