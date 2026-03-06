import { Module } from '@nestjs/common';
import { RoomsModule } from '../../rooms/application/rooms.module.js';
import { GuestsModule } from '../../guests/application/guests.module.js';
import { PrismaStayRepository } from '../infrastructure/persistence/prisma-stay.repository.js';
import { PricingServiceImpl } from '../infrastructure/services/pricing.service.js';
import { CreateStayUseCase } from './use-cases/create-stay.use-case.js';
import { FindAllStaysUseCase } from './use-cases/find-all-stays.use-case.js';
import { FindStayByIdUseCase } from './use-cases/find-stay-by-id.use-case.js';
import { CheckOutStayUseCase } from './use-cases/check-out-stay.use-case.js';
import { CancelStayUseCase } from './use-cases/cancel-stay.use-case.js';
import { StaysController } from '../interfaces/controllers/stays.controller.js';

@Module({
    imports: [RoomsModule, GuestsModule],
    controllers: [StaysController],
    providers: [
        { provide: 'IStayRepository', useClass: PrismaStayRepository },
        { provide: 'IPricingService', useClass: PricingServiceImpl },
        CreateStayUseCase,
        FindAllStaysUseCase,
        FindStayByIdUseCase,
        CheckOutStayUseCase,
        CancelStayUseCase,
    ],
    exports: ['IStayRepository'],
})
export class StaysModule { }
