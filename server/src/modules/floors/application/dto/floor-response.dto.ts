import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FloorResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    number: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiPropertyOptional()
    deletedAt: Date | null;
}
