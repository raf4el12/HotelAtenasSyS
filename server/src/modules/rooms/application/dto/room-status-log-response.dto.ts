import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StatusLogUserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;
}

export class RoomStatusLogResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    roomId: string;

    @ApiProperty()
    previousStatus: string;

    @ApiProperty()
    newStatus: string;

    @ApiProperty()
    changedById: string;

    @ApiPropertyOptional({ type: StatusLogUserDto })
    changedBy: StatusLogUserDto | null;

    @ApiProperty()
    createdAt: Date;
}
