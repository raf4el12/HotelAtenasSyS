import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    category: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    stock: number;

    @ApiProperty()
    minStock: number;

    @ApiProperty()
    status: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
