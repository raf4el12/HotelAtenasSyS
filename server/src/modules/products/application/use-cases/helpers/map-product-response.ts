import type { ProductEntity } from '../../../domain/entities/product.entity.js';
import { ProductResponseDto } from '../../dto/product-response.dto.js';

export function mapToProductResponse(product: ProductEntity): ProductResponseDto {
    const response = new ProductResponseDto();
    response.id = product.id;
    response.name = product.name;
    response.category = product.category;
    response.price = product.price;
    response.stock = product.stock;
    response.minStock = product.minStock;
    response.status = product.status;
    response.createdAt = product.createdAt;
    response.updatedAt = product.updatedAt;
    return response;
}
