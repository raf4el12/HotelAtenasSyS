import { Inject, Injectable } from '@nestjs/common';
import type { IProductRepository } from '../../domain/repositories/product.repository.js';
import { CreateProductDto } from '../dto/create-product.dto.js';
import { ProductResponseDto } from '../dto/product-response.dto.js';
import { mapToProductResponse } from './helpers/map-product-response.js';

@Injectable()
export class CreateProductUseCase {
    constructor(
        @Inject('IProductRepository') private readonly productRepository: IProductRepository,
    ) { }

    async execute(dto: CreateProductDto): Promise<ProductResponseDto> {
        const product = await this.productRepository.create(dto);
        return mapToProductResponse(product);
    }
}
