import { Inject, Injectable } from '@nestjs/common';
import type { IPackageRepository } from '../../domain/repositories/package.repository.js';
import { PaginationImproved } from '../../../../shared/utils/value-objects/pagination-improved.value-object.js';
import { FindAllPackagesDto } from '../dto/find-all-packages.dto.js';
import type { PackageResponseDto } from '../dto/package-response.dto.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import { mapToPackageResponse } from './helpers/map-package-response.js';

@Injectable()
export class FindAllPackagesUseCase {
    constructor(
        @Inject('IPackageRepository') private readonly packageRepository: IPackageRepository,
    ) { }

    async execute(dto: FindAllPackagesDto): Promise<PaginatedResult<PackageResponseDto>> {
        const pagination = new PaginationImproved(
            dto.searchValue, dto.currentPage, dto.pageSize, dto.orderBy, dto.orderByMode,
        );
        const { offset, limit } = pagination.getOffsetLimit();

        const result = await this.packageRepository.findAllPaginated(
            { offset, limit, searchValue: dto.searchValue, orderBy: dto.orderBy, orderByMode: dto.orderByMode },
            { category: dto.category, stayMode: dto.stayMode, isActive: dto.isActive },
        );

        return { ...result, rows: result.rows.map(mapToPackageResponse) };
    }
}
