import { Module } from '@nestjs/common';
import { RoomsModule } from '../../rooms/application/rooms.module.js';
import { GuestsModule } from '../../guests/application/guests.module.js';
import { PrismaReservationRepository } from '../infrastructure/persistence/prisma-reservation.repository.js';
import { CreateReservationUseCase } from './use-cases/create-reservation.use-case.js';
import { FindAllReservationsUseCase } from './use-cases/find-all-reservations.use-case.js';
import { FindReservationByIdUseCase } from './use-cases/find-reservation-by-id.use-case.js';
import { UpdateReservationStatusUseCase } from './use-cases/update-reservation-status.use-case.js';
import { ReservationsController } from '../interfaces/controllers/reservations.controller.js';

@Module({
    imports: [RoomsModule, GuestsModule],
    controllers: [ReservationsController],
    providers: [
        { provide: 'IReservationRepository', useClass: PrismaReservationRepository },
        CreateReservationUseCase,
        FindAllReservationsUseCase,
        FindReservationByIdUseCase,
        UpdateReservationStatusUseCase,
    ],
    exports: ['IReservationRepository'],
})
export class ReservationsModule { }
