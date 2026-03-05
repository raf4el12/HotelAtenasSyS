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
import { UserRole } from '../../../../shared/domain/enums/user-role.enum.js';
import { CreateFloorUseCase } from '../../application/use-cases/create-floor.use-case.js';
import { FindAllFloorsUseCase } from '../../application/use-cases/find-all-floors.use-case.js';
import { FindFloorByIdUseCase } from '../../application/use-cases/find-floor-by-id.use-case.js';
import { UpdateFloorUseCase } from '../../application/use-cases/update-floor.use-case.js';
import { DeleteFloorUseCase } from '../../application/use-cases/delete-floor.use-case.js';
import { CreateFloorDto } from '../../application/dto/create-floor.dto.js';
import { UpdateFloorDto } from '../../application/dto/update-floor.dto.js';
import { FindAllFloorsDto } from '../../application/dto/find-all-floors.dto.js';
import { FloorResponseDto } from '../../application/dto/floor-response.dto.js';

@ApiTags('Floors')
@Controller('floors')
export class FloorsController {
    constructor(
        private readonly createFloorUseCase: CreateFloorUseCase,
        private readonly findAllFloorsUseCase: FindAllFloorsUseCase,
        private readonly findFloorByIdUseCase: FindFloorByIdUseCase,
        private readonly updateFloorUseCase: UpdateFloorUseCase,
        private readonly deleteFloorUseCase: DeleteFloorUseCase,
    ) { }

    @Post()
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Crear un nuevo piso' })
    @ApiResponse({ status: 201, description: 'Piso creado', type: FloorResponseDto })
    @ApiResponse({ status: 409, description: 'Nombre o número de piso ya registrado' })
    async create(@Body() dto: CreateFloorDto) {
        return this.createFloorUseCase.execute(dto);
    }

    @Get()
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Listar pisos con paginación' })
    @ApiResponse({ status: 200, description: 'Lista de pisos paginada' })
    async findAll(@Query() query: FindAllFloorsDto) {
        return this.findAllFloorsUseCase.execute(query);
    }

    @Get(':id')
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Obtener piso por ID' })
    @ApiResponse({ status: 200, description: 'Piso encontrado', type: FloorResponseDto })
    @ApiResponse({ status: 404, description: 'Piso no encontrado' })
    async findById(@Param('id') id: string) {
        return this.findFloorByIdUseCase.execute(id);
    }

    @Patch(':id')
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Actualizar piso' })
    @ApiResponse({ status: 200, description: 'Piso actualizado', type: FloorResponseDto })
    @ApiResponse({ status: 404, description: 'Piso no encontrado' })
    @ApiResponse({ status: 409, description: 'Nombre o número de piso ya registrado' })
    async update(@Param('id') id: string, @Body() dto: UpdateFloorDto) {
        return this.updateFloorUseCase.execute(id, dto);
    }

    @Delete(':id')
    @Auth(UserRole.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar piso (soft delete)' })
    @ApiResponse({ status: 204, description: 'Piso eliminado' })
    @ApiResponse({ status: 404, description: 'Piso no encontrado' })
    async delete(@Param('id') id: string) {
        await this.deleteFloorUseCase.execute(id);
    }
}
