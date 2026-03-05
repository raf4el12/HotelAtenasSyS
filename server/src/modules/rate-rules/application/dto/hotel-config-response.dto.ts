import { ApiProperty } from '@nestjs/swagger';

export class HotelConfigResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    key: string;

    @ApiProperty()
    value: string;

    @ApiProperty()
    updatedAt: Date;
}
