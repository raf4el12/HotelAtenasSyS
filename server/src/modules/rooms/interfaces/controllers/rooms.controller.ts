import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from '../../../../shared/decorators/auth.decorator.js';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator.js';
import { UserRole } from '../../../../shared/domain/enums/user-role.enum.js';
import type { JwtPayload } from '../../../auth/domain/interfaces/jwt-payload.interface.js';
import { CreateRoomUseCase } from '../../application/use-cases/create-room.use-case.js';
import { FindAllRoomsUseCase } from '../../application/use-cases/find-all-rooms.use-case.js';
import { FindRoomByIdUseCase } from '../../application/use-cases/find-room-by-id.use-case.js';
import { UpdateRoomUseCase } from '../../application/use-cases/update-room.use-case.js';
import { ChangeRoomStatusUseCase } from '../../application/use-cases/change-room-status.use-case.js';
import { DeleteRoomUseCase } from '../../application/use-cases/delete-room.use-case.js';
import { FindRoomStatusLogsUseCase } from '../../application/use-cases/find-room-status-logs.use-case.js';
import { CreateRoomDto } from '../../application/dto/create-room.dto.js';
import { UpdateRoomDto } from '../../application/dto/update-room.dto.js';
import { ChangeRoomStatusDto } from '../../application/dto/change-room-status.dto.js';
import { FindAllRoomsDto } from '../../application/dto/find-all-rooms.dto.js';
import { RoomResponseDto } from '../../application/dto/room-response.dto.js';
import { RoomStatusLogResponseDto } from '../../application/dto/room-status-log-response.dto.js';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
    constructor(
        private readonly createRoomUseCase: CreateRoomUseCase,
        private readonly findAllRoomsUseCase: FindAllRoomsUseCase,
        private readonly findRoomByIdUseCase: FindRoomByIdUseCase,
        private readonly updateRoomUseCase: UpdateRoomUseCase,
        private readonly changeRoomStatusUseCase: ChangeRoomStatusUseCase,
        private readonly deleteRoomUseCase: DeleteRoomUseCase,
        private readonly findRoomStatusLogsUseCase: FindRoomStatusLogsUseCase,
    ) { }

    @Post()
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Crear una nueva habitación' })
    @ApiResponse({ status: 201, description: 'Habitación creada', type: RoomResponseDto })
    @ApiResponse({ status: 404, description: 'Piso no encontrado' })
    @ApiResponse({ status: 409, description: 'Número de habitación ya registrado' })
    async create(@Body() dto: CreateRoomDto) {
        return this.createRoomUseCase.execute(dto);
    }

    @Get()
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Listar habitaciones con paginación y filtros' })
    @ApiResponse({ status: 200, description: 'Lista de habitaciones paginada' })
    async findAll(@Query() query: FindAllRoomsDto) {
        return this.findAllRoomsUseCase.execute(query);
    }

    @Get(':id')
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Obtener habitación por ID' })
    @ApiResponse({ status: 200, description: 'Habitación encontrada', type: RoomResponseDto })
    @ApiResponse({ status: 404, description: 'Habitación no encontrada' })
    async findById(@Param('id') id: string) {
        return this.findRoomByIdUseCase.execute(id);
    }

    @Patch(':id')
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Actualizar habitación' })
    @ApiResponse({ status: 200, description: 'Habitación actualizada', type: RoomResponseDto })
    @ApiResponse({ status: 404, description: 'Habitación no encontrada' })
    @ApiResponse({ status: 409, description: 'Número de habitación ya registrado' })
    async update(@Param('id') id: string, @Body() dto: UpdateRoomDto) {
        return this.updateRoomUseCase.execute(id, dto);
    }

    @Patch(':id/status')
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.HOUSEKEEPING)
    @ApiOperation({ summary: 'Cambiar estado de habitación' })
    @ApiResponse({ status: 200, description: 'Estado actualizado', type: RoomResponseDto })
    @ApiResponse({ status: 400, description: 'La habitación ya está en ese estado' })
    @ApiResponse({ status: 404, description: 'Habitación no encontrada' })
    async changeStatus(
        @Param('id') id: string,
        @Body() dto: ChangeRoomStatusDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.changeRoomStatusUseCase.execute(id, dto, user.id);
    }

    @Get(':id/status-logs')
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Historial de cambios de estado de una habitación' })
    @ApiResponse({ status: 200, description: 'Historial de cambios', type: [RoomStatusLogResponseDto] })
    @ApiResponse({ status: 404, description: 'Habitación no encontrada' })
    async findStatusLogs(@Param('id') id: string) {
        return this.findRoomStatusLogsUseCase.execute(id);
    }

    @Delete(':id')
    @Auth(UserRole.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar habitación (soft delete)' })
    @ApiResponse({ status: 204, description: 'Habitación eliminada' })
    @ApiResponse({ status: 404, description: 'Habitación no encontrada' })
    async delete(@Param('id') id: string) {
        await this.deleteRoomUseCase.execute(id);
    }
}
