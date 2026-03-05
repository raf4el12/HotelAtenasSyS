import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPackageRepository } from '../../domain/repositories/package.repository.js';
import { PackageResponseDto } from '../dto/package-response.dto.js';
import { mapToPackageResponse } from './helpers/map-package-response.js';

@Injectable()
export class FindPackageByIdUseCase {
    constructor(
        @Inject('IPackageRepository') private readonly packageRepository: IPackageRepository,
    ) { }

    async execute(id: string): Promise<PackageResponseDto> {
        const pkg = await this.packageRepository.findById(id);
        if (!pkg) {
            throw new NotFoundException('Paquete no encontrado');
        }
        return mapToPackageResponse(pkg);
    }
}
