import { Module } from '@nestjs/common';
import { PrismaFloorRepository } from '../infrastructure/persistence/prisma-floor.repository.js';
import { CreateFloorUseCase } from './use-cases/create-floor.use-case.js';
import { FindAllFloorsUseCase } from './use-cases/find-all-floors.use-case.js';
import { FindFloorByIdUseCase } from './use-cases/find-floor-by-id.use-case.js';
import { UpdateFloorUseCase } from './use-cases/update-floor.use-case.js';
import { DeleteFloorUseCase } from './use-cases/delete-floor.use-case.js';
import { FloorsController } from '../interfaces/controllers/floors.controller.js';

@Module({
    controllers: [FloorsController],
    providers: [
        { provide: 'IFloorRepository', useClass: PrismaFloorRepository },
        CreateFloorUseCase,
        FindAllFloorsUseCase,
        FindFloorByIdUseCase,
        UpdateFloorUseCase,
        DeleteFloorUseCase,
    ],
    exports: ['IFloorRepository'],
})
export class FloorsModule { }
