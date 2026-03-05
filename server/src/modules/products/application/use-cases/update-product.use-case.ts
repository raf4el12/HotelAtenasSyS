import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IProductRepository } from '../../domain/repositories/product.repository.js';
import { UpdateProductDto } from '../dto/update-product.dto.js';
import { ProductResponseDto } from '../dto/product-response.dto.js';
import { mapToProductResponse } from './helpers/map-product-response.js';

@Injectable()
export class UpdateProductUseCase {
    constructor(
        @Inject('IProductRepository') private readonly productRepository: IProductRepository,
    ) { }

    async execute(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
        const existing = await this.productRepository.findById(id);
        if (!existing) {
            throw new NotFoundException('Producto no encontrado');
        }

        const updated = await this.productRepository.update(id, dto);
        return mapToProductResponse(updated);
    }
}
