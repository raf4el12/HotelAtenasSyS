import { Module } from '@nestjs/common';
import { PrismaGuestRepository } from '../infrastructure/persistence/prisma-guest.repository.js';
import { CreateGuestUseCase } from './use-cases/create-guest.use-case.js';
import { FindAllGuestsUseCase } from './use-cases/find-all-guests.use-case.js';
import { FindGuestByIdUseCase } from './use-cases/find-guest-by-id.use-case.js';
import { FindGuestByDniUseCase } from './use-cases/find-guest-by-dni.use-case.js';
import { UpdateGuestUseCase } from './use-cases/update-guest.use-case.js';
import { GuestsController } from '../interfaces/controllers/guests.controller.js';

@Module({
    controllers: [GuestsController],
    providers: [
        { provide: 'IGuestRepository', useClass: PrismaGuestRepository },
        CreateGuestUseCase,
        FindAllGuestsUseCase,
        FindGuestByIdUseCase,
        FindGuestByDniUseCase,
        UpdateGuestUseCase,
    ],
    exports: ['IGuestRepository'],
})
export class GuestsModule { }
