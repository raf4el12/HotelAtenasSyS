import { Inject, Injectable } from '@nestjs/common';
import type { IPackageRepository } from '../../domain/repositories/package.repository.js';
import { CreatePackageDto } from '../dto/create-package.dto.js';
import { PackageResponseDto } from '../dto/package-response.dto.js';
import { mapToPackageResponse } from './helpers/map-package-response.js';

@Injectable()
export class CreatePackageUseCase {
    constructor(
        @Inject('IPackageRepository') private readonly packageRepository: IPackageRepository,
    ) { }

    async execute(dto: CreatePackageDto): Promise<PackageResponseDto> {
        const pkg = await this.packageRepository.create({
            name: dto.name,
            description: dto.description,
            category: dto.category,
            stayMode: dto.stayMode,
            totalPrice: dto.totalPrice,
            validFrom: dto.validFrom ? new Date(dto.validFrom) : undefined,
            validTo: dto.validTo ? new Date(dto.validTo) : undefined,
            items: dto.items,
        });
        return mapToPackageResponse(pkg);
    }
}
