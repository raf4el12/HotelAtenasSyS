import {
    Controller,
    Post,
    Get,
    Patch,
    Body,
    Param,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from '../../../../shared/decorators/auth.decorator.js';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator.js';
import { UserRole } from '../../../../shared/domain/enums/user-role.enum.js';
import { ReservationStatus } from '../../../../shared/domain/enums/reservation-status.enum.js';
import type { JwtPayload } from '../../../auth/domain/interfaces/jwt-payload.interface.js';
import { CreateReservationUseCase } from '../../application/use-cases/create-reservation.use-case.js';
import { FindAllReservationsUseCase } from '../../application/use-cases/find-all-reservations.use-case.js';
import { FindReservationByIdUseCase } from '../../application/use-cases/find-reservation-by-id.use-case.js';
import { UpdateReservationStatusUseCase } from '../../application/use-cases/update-reservation-status.use-case.js';
import { CreateReservationDto } from '../../application/dto/create-reservation.dto.js';
import { FindAllReservationsDto } from '../../application/dto/find-all-reservations.dto.js';
import { ReservationResponseDto } from '../../application/dto/reservation-response.dto.js';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
    constructor(
        private readonly createReservationUseCase: CreateReservationUseCase,
        private readonly findAllReservationsUseCase: FindAllReservationsUseCase,
        private readonly findReservationByIdUseCase: FindReservationByIdUseCase,
        private readonly updateReservationStatusUseCase: UpdateReservationStatusUseCase,
    ) { }

    @Post()
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Crear una nueva reserva' })
    @ApiResponse({ status: 201, description: 'Reserva creada', type: ReservationResponseDto })
    @ApiResponse({ status: 404, description: 'Huésped o habitación no encontrada' })
    async create(@Body() dto: CreateReservationDto, @CurrentUser() user: JwtPayload) {
        return this.createReservationUseCase.execute(dto, user.id);
    }

    @Get()
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Listar reservas con paginación y filtros' })
    @ApiResponse({ status: 200, description: 'Lista de reservas paginada' })
    async findAll(@Query() query: FindAllReservationsDto) {
        return this.findAllReservationsUseCase.execute(query);
    }

    @Get(':id')
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Obtener reserva por ID' })
    @ApiResponse({ status: 200, description: 'Reserva encontrada', type: ReservationResponseDto })
    @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
    async findById(@Param('id') id: string) {
        return this.findReservationByIdUseCase.execute(id);
    }

    @Patch(':id/confirm')
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Confirmar reserva' })
    @ApiResponse({ status: 200, description: 'Reserva confirmada', type: ReservationResponseDto })
    async confirm(@Param('id') id: string) {
        return this.updateReservationStatusUseCase.execute(id, ReservationStatus.CONFIRMED);
    }

    @Patch(':id/check-in')
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Marcar check-in de reserva' })
    @ApiResponse({ status: 200, description: 'Check-in registrado', type: ReservationResponseDto })
    async checkIn(@Param('id') id: string) {
        return this.updateReservationStatusUseCase.execute(id, ReservationStatus.CHECKED_IN);
    }

    @Patch(':id/cancel')
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Cancelar reserva' })
    @ApiResponse({ status: 200, description: 'Reserva cancelada', type: ReservationResponseDto })
    async cancel(@Param('id') id: string) {
        return this.updateReservationStatusUseCase.execute(id, ReservationStatus.CANCELLED);
    }

    @Patch(':id/no-show')
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Marcar reserva como no-show' })
    @ApiResponse({ status: 200, description: 'Reserva marcada como no-show', type: ReservationResponseDto })
    async noShow(@Param('id') id: string) {
        return this.updateReservationStatusUseCase.execute(id, ReservationStatus.NO_SHOW);
    }
}
