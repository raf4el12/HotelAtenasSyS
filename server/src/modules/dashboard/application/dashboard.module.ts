import { Module } from '@nestjs/common';
import { GetDashboardStatsUseCase } from './use-cases/get-dashboard-stats.use-case.js';
import { DashboardController } from '../interfaces/controllers/dashboard.controller.js';

@Module({
    controllers: [DashboardController],
    providers: [GetDashboardStatsUseCase],
})
export class DashboardModule {}
