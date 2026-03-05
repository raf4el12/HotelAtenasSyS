import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PackageItemResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    productId: string;

    @ApiPropertyOptional()
    productName: string | null;

    @ApiPropertyOptional()
    productPrice: number | null;

    @ApiProperty()
    quantity: number;
}

export class PackageResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiPropertyOptional()
    description: string | null;

    @ApiProperty()
    category: string;

    @ApiProperty()
    stayMode: string;

    @ApiProperty()
    totalPrice: number;

    @ApiProperty()
    isActive: boolean;

    @ApiPropertyOptional()
    validFrom: Date | null;

    @ApiPropertyOptional()
    validTo: Date | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ type: [PackageItemResponseDto] })
    items: PackageItemResponseDto[];
}
