import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RateRuleResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiPropertyOptional()
    description: string | null;

    @ApiProperty()
    stayMode: string;

    @ApiProperty()
    category: string;

    @ApiProperty()
    price: number;

    @ApiPropertyOptional()
    durationMin: number | null;

    @ApiPropertyOptional()
    validFrom: Date | null;

    @ApiPropertyOptional()
    validTo: Date | null;

    @ApiProperty()
    priority: number;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
