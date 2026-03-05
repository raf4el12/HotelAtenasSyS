import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPackageRepository } from '../../domain/repositories/package.repository.js';

@Injectable()
export class DeletePackageUseCase {
    constructor(
        @Inject('IPackageRepository') private readonly packageRepository: IPackageRepository,
    ) { }

    async execute(id: string): Promise<void> {
        const pkg = await this.packageRepository.findById(id);
        if (!pkg) {
            throw new NotFoundException('Paquete no encontrado');
        }
        await this.packageRepository.delete(id);
    }
}
