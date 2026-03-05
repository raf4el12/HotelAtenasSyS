import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPackageRepository } from '../../domain/repositories/package.repository.js';
import { UpdatePackageDto } from '../dto/update-package.dto.js';
import { PackageResponseDto } from '../dto/package-response.dto.js';
import { mapToPackageResponse } from './helpers/map-package-response.js';

@Injectable()
export class UpdatePackageUseCase {
    constructor(
        @Inject('IPackageRepository') private readonly packageRepository: IPackageRepository,
    ) { }

    async execute(id: string, dto: UpdatePackageDto): Promise<PackageResponseDto> {
        const existing = await this.packageRepository.findById(id);
        if (!existing) {
            throw new NotFoundException('Paquete no encontrado');
        }

        const updateData: any = { ...dto };
        if (dto.validFrom !== undefined) updateData.validFrom = dto.validFrom ? new Date(dto.validFrom) : null;
        if (dto.validTo !== undefined) updateData.validTo = dto.validTo ? new Date(dto.validTo) : null;

        const updated = await this.packageRepository.update(id, updateData);
        return mapToPackageResponse(updated);
    }
}
