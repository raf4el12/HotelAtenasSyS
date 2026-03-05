import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IProductRepository } from '../../domain/repositories/product.repository.js';
import { UpdateStockDto } from '../dto/update-stock.dto.js';
import { ProductResponseDto } from '../dto/product-response.dto.js';
import { mapToProductResponse } from './helpers/map-product-response.js';

@Injectable()
export class UpdateStockUseCase {
    constructor(
        @Inject('IProductRepository') private readonly productRepository: IProductRepository,
    ) { }

    async execute(id: string, dto: UpdateStockDto): Promise<ProductResponseDto> {
        const existing = await this.productRepository.findById(id);
        if (!existing) {
            throw new NotFoundException('Producto no encontrado');
        }

        const updated = await this.productRepository.updateStock(id, dto.stock);
        return mapToProductResponse(updated);
    }
}
