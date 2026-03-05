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
import { CreateRateRuleUseCase } from '../../application/use-cases/create-rate-rule.use-case.js';
import { FindAllRateRulesUseCase } from '../../application/use-cases/find-all-rate-rules.use-case.js';
import { FindRateRuleByIdUseCase } from '../../application/use-cases/find-rate-rule-by-id.use-case.js';
import { UpdateRateRuleUseCase } from '../../application/use-cases/update-rate-rule.use-case.js';
import { DeleteRateRuleUseCase } from '../../application/use-cases/delete-rate-rule.use-case.js';
import { ManageConfigUseCase } from '../../application/use-cases/manage-config.use-case.js';
import { CreateRateRuleDto } from '../../application/dto/create-rate-rule.dto.js';
import { UpdateRateRuleDto } from '../../application/dto/update-rate-rule.dto.js';
import { FindAllRateRulesDto } from '../../application/dto/find-all-rate-rules.dto.js';
import { UpsertConfigDto } from '../../application/dto/upsert-config.dto.js';
import { RateRuleResponseDto } from '../../application/dto/rate-rule-response.dto.js';
import { HotelConfigResponseDto } from '../../application/dto/hotel-config-response.dto.js';

@ApiTags('Rate Rules')
@Controller('rate-rules')
export class RateRulesController {
    constructor(
        private readonly createRateRuleUseCase: CreateRateRuleUseCase,
        private readonly findAllRateRulesUseCase: FindAllRateRulesUseCase,
        private readonly findRateRuleByIdUseCase: FindRateRuleByIdUseCase,
        private readonly updateRateRuleUseCase: UpdateRateRuleUseCase,
        private readonly deleteRateRuleUseCase: DeleteRateRuleUseCase,
        private readonly manageConfigUseCase: ManageConfigUseCase,
    ) { }

    @Post()
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Crear una nueva tarifa' })
    @ApiResponse({ status: 201, description: 'Tarifa creada', type: RateRuleResponseDto })
    async create(@Body() dto: CreateRateRuleDto) {
        return this.createRateRuleUseCase.execute(dto);
    }

    @Get()
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Listar tarifas con paginación y filtros' })
    @ApiResponse({ status: 200, description: 'Lista de tarifas paginada' })
    async findAll(@Query() query: FindAllRateRulesDto) {
        return this.findAllRateRulesUseCase.execute(query);
    }

    @Get('config')
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Obtener todas las configuraciones del hotel' })
    @ApiResponse({ status: 200, description: 'Lista de configuraciones', type: [HotelConfigResponseDto] })
    async findAllConfig() {
        return this.manageConfigUseCase.findAll();
    }

    @Get('config/:key')
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Obtener configuración por clave' })
    @ApiResponse({ status: 200, description: 'Configuración encontrada', type: HotelConfigResponseDto })
    async findConfigByKey(@Param('key') key: string) {
        return this.manageConfigUseCase.findByKey(key);
    }

    @Post('config')
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Crear o actualizar configuración del hotel' })
    @ApiResponse({ status: 201, description: 'Configuración guardada', type: HotelConfigResponseDto })
    async upsertConfig(@Body() dto: UpsertConfigDto) {
        return this.manageConfigUseCase.upsert(dto);
    }

    @Get(':id')
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Obtener tarifa por ID' })
    @ApiResponse({ status: 200, description: 'Tarifa encontrada', type: RateRuleResponseDto })
    @ApiResponse({ status: 404, description: 'Tarifa no encontrada' })
    async findById(@Param('id') id: string) {
        return this.findRateRuleByIdUseCase.execute(id);
    }

    @Patch(':id')
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Actualizar tarifa' })
    @ApiResponse({ status: 200, description: 'Tarifa actualizada', type: RateRuleResponseDto })
    @ApiResponse({ status: 404, description: 'Tarifa no encontrada' })
    async update(@Param('id') id: string, @Body() dto: UpdateRateRuleDto) {
        return this.updateRateRuleUseCase.execute(id, dto);
    }

    @Delete(':id')
    @Auth(UserRole.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar tarifa' })
    @ApiResponse({ status: 204, description: 'Tarifa eliminada' })
    @ApiResponse({ status: 404, description: 'Tarifa no encontrada' })
    async delete(@Param('id') id: string) {
        await this.deleteRateRuleUseCase.execute(id);
    }
}
