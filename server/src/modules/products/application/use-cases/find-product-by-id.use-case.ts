import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IProductRepository } from '../../domain/repositories/product.repository.js';
import { ProductResponseDto } from '../dto/product-response.dto.js';
import { mapToProductResponse } from './helpers/map-product-response.js';

@Injectable()
export class FindProductByIdUseCase {
    constructor(
        @Inject('IProductRepository') private readonly productRepository: IProductRepository,
    ) { }

    async execute(id: string): Promise<ProductResponseDto> {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new NotFoundException('Producto no encontrado');
        }
        return mapToProductResponse(product);
    }
}
