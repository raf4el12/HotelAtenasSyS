import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPackageRepository, PackageItemInput } from '../../domain/repositories/package.repository.js';
import { PackageResponseDto } from '../dto/package-response.dto.js';
import { mapToPackageResponse } from './helpers/map-package-response.js';

@Injectable()
export class ManagePackageItemsUseCase {
    constructor(
        @Inject('IPackageRepository') private readonly packageRepository: IPackageRepository,
    ) { }

    async addItem(packageId: string, item: PackageItemInput): Promise<PackageResponseDto> {
        const pkg = await this.packageRepository.findById(packageId);
        if (!pkg) throw new NotFoundException('Paquete no encontrado');

        const updated = await this.packageRepository.addItem(packageId, item);
        return mapToPackageResponse(updated);
    }

    async removeItem(packageId: string, productId: string): Promise<PackageResponseDto> {
        const pkg = await this.packageRepository.findById(packageId);
        if (!pkg) throw new NotFoundException('Paquete no encontrado');

        const updated = await this.packageRepository.removeItem(packageId, productId);
        return mapToPackageResponse(updated);
    }
}
