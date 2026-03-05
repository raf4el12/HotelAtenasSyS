import { Inject, Injectable } from '@nestjs/common';
import type { IProductRepository } from '../../domain/repositories/product.repository.js';
import { PaginationImproved } from '../../../../shared/utils/value-objects/pagination-improved.value-object.js';
import { FindAllProductsDto } from '../dto/find-all-products.dto.js';
import type { ProductResponseDto } from '../dto/product-response.dto.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import { mapToProductResponse } from './helpers/map-product-response.js';

@Injectable()
export class FindAllProductsUseCase {
    constructor(
        @Inject('IProductRepository') private readonly productRepository: IProductRepository,
    ) { }

    async execute(dto: FindAllProductsDto): Promise<PaginatedResult<ProductResponseDto>> {
        const pagination = new PaginationImproved(
            dto.searchValue, dto.currentPage, dto.pageSize, dto.orderBy, dto.orderByMode,
        );
        const { offset, limit } = pagination.getOffsetLimit();

        const result = await this.productRepository.findAllPaginated(
            { offset, limit, searchValue: dto.searchValue, orderBy: dto.orderBy, orderByMode: dto.orderByMode },
            { category: dto.category, status: dto.status },
        );

        return { ...result, rows: result.rows.map(mapToProductResponse) };
    }
}
