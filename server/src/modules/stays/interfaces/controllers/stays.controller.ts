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
import type { JwtPayload } from '../../../auth/domain/interfaces/jwt-payload.interface.js';
import { CreateStayUseCase } from '../../application/use-cases/create-stay.use-case.js';
import { FindAllStaysUseCase } from '../../application/use-cases/find-all-stays.use-case.js';
import { FindStayByIdUseCase } from '../../application/use-cases/find-stay-by-id.use-case.js';
import { CheckOutStayUseCase } from '../../application/use-cases/check-out-stay.use-case.js';
import { CancelStayUseCase } from '../../application/use-cases/cancel-stay.use-case.js';
import { CreateStayDto } from '../../application/dto/create-stay.dto.js';
import { FindAllStaysDto } from '../../application/dto/find-all-stays.dto.js';
import { StayResponseDto } from '../../application/dto/stay-response.dto.js';

@ApiTags('Stays')
@Controller('stays')
export class StaysController {
    constructor(
        private readonly createStayUseCase: CreateStayUseCase,
        private readonly findAllStaysUseCase: FindAllStaysUseCase,
        private readonly findStayByIdUseCase: FindStayByIdUseCase,
        private readonly checkOutStayUseCase: CheckOutStayUseCase,
        private readonly cancelStayUseCase: CancelStayUseCase,
    ) { }

    @Post()
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Registrar check-in (nueva estadía)' })
    @ApiResponse({ status: 201, description: 'Estadía creada', type: StayResponseDto })
    @ApiResponse({ status: 404, description: 'Huésped o habitación no encontrada' })
    @ApiResponse({ status: 409, description: 'Habitación no disponible o ya ocupada' })
    async create(@Body() dto: CreateStayDto, @CurrentUser() user: JwtPayload) {
        return this.createStayUseCase.execute(dto, user.id);
    }

    @Get()
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Listar estadías con paginación y filtros' })
    @ApiResponse({ status: 200, description: 'Lista de estadías paginada' })
    async findAll(@Query() query: FindAllStaysDto) {
        return this.findAllStaysUseCase.execute(query);
    }

    @Get(':id')
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Obtener estadía por ID' })
    @ApiResponse({ status: 200, description: 'Estadía encontrada', type: StayResponseDto })
    @ApiResponse({ status: 404, description: 'Estadía no encontrada' })
    async findById(@Param('id') id: string) {
        return this.findStayByIdUseCase.execute(id);
    }

    @Patch(':id/check-out')
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Realizar check-out' })
    @ApiResponse({ status: 200, description: 'Check-out realizado', type: StayResponseDto })
    @ApiResponse({ status: 400, description: 'La estadía no está activa' })
    @ApiResponse({ status: 404, description: 'Estadía no encontrada' })
    async checkOut(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
        return this.checkOutStayUseCase.execute(id, user.id);
    }

    @Patch(':id/cancel')
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Cancelar estadía' })
    @ApiResponse({ status: 200, description: 'Estadía cancelada', type: StayResponseDto })
    @ApiResponse({ status: 400, description: 'La estadía no está activa' })
    @ApiResponse({ status: 404, description: 'Estadía no encontrada' })
    async cancel(@Param('id') id: string) {
        return this.cancelStayUseCase.execute(id);
    }
}
