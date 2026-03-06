import { Module } from '@nestjs/common';
import { PrismaPackageRepository } from '../infrastructure/persistence/prisma-package.repository.js';
import { CreatePackageUseCase } from './use-cases/create-package.use-case.js';
import { FindAllPackagesUseCase } from './use-cases/find-all-packages.use-case.js';
import { FindPackageByIdUseCase } from './use-cases/find-package-by-id.use-case.js';
import { UpdatePackageUseCase } from './use-cases/update-package.use-case.js';
import { DeletePackageUseCase } from './use-cases/delete-package.use-case.js';
import { AddPackageItemUseCase } from './use-cases/add-package-item.use-case.js';
import { RemovePackageItemUseCase } from './use-cases/remove-package-item.use-case.js';
import { PackagesController } from '../interfaces/controllers/packages.controller.js';

@Module({
    controllers: [PackagesController],
    providers: [
        { provide: 'IPackageRepository', useClass: PrismaPackageRepository },
        CreatePackageUseCase,
        FindAllPackagesUseCase,
        FindPackageByIdUseCase,
        UpdatePackageUseCase,
        DeletePackageUseCase,
        AddPackageItemUseCase,
        RemovePackageItemUseCase,
    ],
    exports: ['IPackageRepository'],
})
export class PackagesModule { }
