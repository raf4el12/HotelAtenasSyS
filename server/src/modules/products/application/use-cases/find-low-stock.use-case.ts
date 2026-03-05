import { Inject, Injectable } from '@nestjs/common';
import type { IProductRepository } from '../../domain/repositories/product.repository.js';
import type { ProductResponseDto } from '../dto/product-response.dto.js';
import { mapToProductResponse } from './helpers/map-product-response.js';

@Injectable()
export class FindLowStockUseCase {
    constructor(
        @Inject('IProductRepository') private readonly productRepository: IProductRepository,
    ) { }

    async execute(): Promise<ProductResponseDto[]> {
        const products = await this.productRepository.findLowStock();
        return products.map(mapToProductResponse);
    }
}
