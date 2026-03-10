import { ApiProperty } from '@nestjs/swagger';

export class OccupancyDto {
    @ApiProperty() totalRooms: number;
    @ApiProperty() occupiedRooms: number;
    @ApiProperty() availableRooms: number;
    @ApiProperty() maintenanceRooms: number;
    @ApiProperty() cleaningRooms: number;
    @ApiProperty() occupancyRate: number;
}

export class TodayStaysDto {
    @ApiProperty() activeStays: number;
    @ApiProperty() checkInsToday: number;
    @ApiProperty() checkOutsToday: number;
}

export class ReservationsStatsDto {
    @ApiProperty() pendingReservations: number;
    @ApiProperty() confirmedReservations: number;
    @ApiProperty() next7DaysReservations: number;
}

export class RevenueStatsDto {
    @ApiProperty() todayRevenue: number;
    @ApiProperty() weekRevenue: number;
    @ApiProperty() monthRevenue: number;
}

export class RecentActivityDto {
    @ApiProperty() id: string;
    @ApiProperty() type: string;
    @ApiProperty() description: string;
    @ApiProperty() timestamp: Date;
}

export class DashboardStatsDto {
    @ApiProperty({ type: OccupancyDto }) occupancy: OccupancyDto;
    @ApiProperty({ type: TodayStaysDto }) stays: TodayStaysDto;
    @ApiProperty({ type: ReservationsStatsDto }) reservations: ReservationsStatsDto;
    @ApiProperty({ type: RevenueStatsDto }) revenue: RevenueStatsDto;
    @ApiProperty() totalGuests: number;
    @ApiProperty() lowStockProducts: number;
    @ApiProperty({ type: [RecentActivityDto] }) recentActivity: RecentActivityDto[];
}
