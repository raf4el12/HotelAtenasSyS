import { Module } from '@nestjs/common';
import { FloorsModule } from '../../floors/application/floors.module.js';
import { PrismaRoomRepository } from '../infrastructure/persistence/prisma-room.repository.js';
import { CreateRoomUseCase } from './use-cases/create-room.use-case.js';
import { FindAllRoomsUseCase } from './use-cases/find-all-rooms.use-case.js';
import { FindRoomByIdUseCase } from './use-cases/find-room-by-id.use-case.js';
import { UpdateRoomUseCase } from './use-cases/update-room.use-case.js';
import { ChangeRoomStatusUseCase } from './use-cases/change-room-status.use-case.js';
import { DeleteRoomUseCase } from './use-cases/delete-room.use-case.js';
import { FindRoomStatusLogsUseCase } from './use-cases/find-room-status-logs.use-case.js';
import { RoomsController } from '../interfaces/controllers/rooms.controller.js';

@Module({
    imports: [FloorsModule],
    controllers: [RoomsController],
    providers: [
        { provide: 'IRoomRepository', useClass: PrismaRoomRepository },
        CreateRoomUseCase,
        FindAllRoomsUseCase,
        FindRoomByIdUseCase,
        UpdateRoomUseCase,
        ChangeRoomStatusUseCase,
        DeleteRoomUseCase,
        FindRoomStatusLogsUseCase,
    ],
    exports: ['IRoomRepository'],
})
export class RoomsModule { }
