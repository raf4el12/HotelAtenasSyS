import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FloorSummaryDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    number: number;
}

export class RoomResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    number: string;

    @ApiProperty()
    category: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    floorId: string;

    @ApiPropertyOptional({ type: FloorSummaryDto })
    floor: FloorSummaryDto | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiPropertyOptional()
    deletedAt: Date | null;
}
