import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPackageRepository } from '../../domain/repositories/package.repository.js';
import { PackageResponseDto } from '../dto/package-response.dto.js';
import { mapToPackageResponse } from './helpers/map-package-response.js';

@Injectable()
export class RemovePackageItemUseCase {
    constructor(
        @Inject('IPackageRepository') private readonly packageRepository: IPackageRepository,
    ) { }

    async execute(packageId: string, productId: string): Promise<PackageResponseDto> {
        const pkg = await this.packageRepository.findById(packageId);
        if (!pkg) throw new NotFoundException('Paquete no encontrado');

        const updated = await this.packageRepository.removeItem(packageId, productId);
        return mapToPackageResponse(updated);
    }
}
