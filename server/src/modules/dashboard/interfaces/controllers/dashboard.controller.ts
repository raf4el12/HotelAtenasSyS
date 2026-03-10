import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from '../../../../shared/decorators/auth.decorator.js';
import { UserRole } from '../../../../shared/domain/enums/user-role.enum.js';
import { GetDashboardStatsUseCase } from '../../application/use-cases/get-dashboard-stats.use-case.js';
import { DashboardStatsDto } from '../../application/dto/dashboard-stats.dto.js';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly getDashboardStatsUseCase: GetDashboardStatsUseCase) {}

    @Get('stats')
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Obtener estadísticas del dashboard' })
    @ApiResponse({ status: 200, description: 'Estadísticas del dashboard', type: DashboardStatsDto })
    async getStats() {
        return this.getDashboardStatsUseCase.execute();
    }
}
