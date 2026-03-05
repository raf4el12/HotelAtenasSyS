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
import { UserRole } from '../../../../shared/domain/enums/user-role.enum.js';
import { CreateGuestUseCase } from '../../application/use-cases/create-guest.use-case.js';
import { FindAllGuestsUseCase } from '../../application/use-cases/find-all-guests.use-case.js';
import { FindGuestByIdUseCase } from '../../application/use-cases/find-guest-by-id.use-case.js';
import { FindGuestByDniUseCase } from '../../application/use-cases/find-guest-by-dni.use-case.js';
import { UpdateGuestUseCase } from '../../application/use-cases/update-guest.use-case.js';
import { CreateGuestDto } from '../../application/dto/create-guest.dto.js';
import { UpdateGuestDto } from '../../application/dto/update-guest.dto.js';
import { FindAllGuestsDto } from '../../application/dto/find-all-guests.dto.js';
import { GuestResponseDto } from '../../application/dto/guest-response.dto.js';

@ApiTags('Guests')
@Controller('guests')
export class GuestsController {
    constructor(
        private readonly createGuestUseCase: CreateGuestUseCase,
        private readonly findAllGuestsUseCase: FindAllGuestsUseCase,
        private readonly findGuestByIdUseCase: FindGuestByIdUseCase,
        private readonly findGuestByDniUseCase: FindGuestByDniUseCase,
        private readonly updateGuestUseCase: UpdateGuestUseCase,
    ) { }

    @Post()
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Registrar un nuevo huésped' })
    @ApiResponse({ status: 201, description: 'Huésped registrado', type: GuestResponseDto })
    @ApiResponse({ status: 409, description: 'DNI ya registrado' })
    async create(@Body() dto: CreateGuestDto) {
        return this.createGuestUseCase.execute(dto);
    }

    @Get()
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Listar huéspedes con paginación' })
    @ApiResponse({ status: 200, description: 'Lista de huéspedes paginada' })
    async findAll(@Query() query: FindAllGuestsDto) {
        return this.findAllGuestsUseCase.execute(query);
    }

    @Get('dni/:dni')
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Buscar huésped por DNI' })
    @ApiResponse({ status: 200, description: 'Huésped encontrado', type: GuestResponseDto })
    @ApiResponse({ status: 404, description: 'Huésped no encontrado' })
    async findByDni(@Param('dni') dni: string) {
        return this.findGuestByDniUseCase.execute(dni);
    }

    @Get(':id')
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Obtener huésped por ID' })
    @ApiResponse({ status: 200, description: 'Huésped encontrado', type: GuestResponseDto })
    @ApiResponse({ status: 404, description: 'Huésped no encontrado' })
    async findById(@Param('id') id: string) {
        return this.findGuestByIdUseCase.execute(id);
    }

    @Patch(':id')
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Actualizar huésped' })
    @ApiResponse({ status: 200, description: 'Huésped actualizado', type: GuestResponseDto })
    @ApiResponse({ status: 404, description: 'Huésped no encontrado' })
    @ApiResponse({ status: 409, description: 'DNI ya registrado' })
    async update(@Param('id') id: string, @Body() dto: UpdateGuestDto) {
        return this.updateGuestUseCase.execute(id, dto);
    }
}
