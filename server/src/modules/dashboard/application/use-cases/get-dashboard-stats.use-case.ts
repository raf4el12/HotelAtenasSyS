import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service.js';
import { DashboardStatsDto } from '../dto/dashboard-stats.dto.js';

@Injectable()
export class GetDashboardStatsUseCase {
    constructor(private readonly prisma: PrismaService) {}

    async execute(): Promise<DashboardStatsDto> {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const next7Days = new Date(startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);

        const [
            totalRooms,
            occupiedRooms,
            availableRooms,
            maintenanceRooms,
            cleaningRooms,
            activeStays,
            checkInsToday,
            checkOutsToday,
            pendingReservations,
            confirmedReservations,
            next7DaysReservations,
            todayRevenueResult,
            weekRevenueResult,
            monthRevenueResult,
            totalGuests,
            lowStockProducts,
            recentStays,
            recentPayments,
        ] = await Promise.all([
            this.prisma.room.count(),
            this.prisma.room.count({ where: { status: 'OCCUPIED' } }),
            this.prisma.room.count({ where: { status: 'AVAILABLE' } }),
            this.prisma.room.count({ where: { status: 'MAINTENANCE' } }),
            this.prisma.room.count({ where: { status: 'CLEANING' } }),
            this.prisma.stay.count({ where: { status: 'ACTIVE' } }),
            this.prisma.stay.count({ where: { checkIn: { gte: startOfToday, lt: endOfToday } } }),
            this.prisma.stay.count({ where: { actualCheckOut: { gte: startOfToday, lt: endOfToday } } }),
            this.prisma.reservation.count({ where: { status: 'PENDING' } }),
            this.prisma.reservation.count({ where: { status: 'CONFIRMED' } }),
            this.prisma.reservation.count({
                where: {
                    status: { in: ['PENDING', 'CONFIRMED'] },
                    scheduledCheckIn: { gte: startOfToday, lt: next7Days },
                },
            }),
            this.prisma.payment.aggregate({
                where: { createdAt: { gte: startOfToday, lt: endOfToday }, voidedAt: null },
                _sum: { amount: true },
            }),
            this.prisma.payment.aggregate({
                where: { createdAt: { gte: startOfWeek }, voidedAt: null },
                _sum: { amount: true },
            }),
            this.prisma.payment.aggregate({
                where: { createdAt: { gte: startOfMonth }, voidedAt: null },
                _sum: { amount: true },
            }),
            this.prisma.guest.count(),
            this.prisma.product.count({
                where: {
                    stock: { lte: this.prisma.$queryRawUnsafe('0') as any },
                },
            }).catch(() => 0),
            this.prisma.stay.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    guest: { select: { firstName: true, lastName: true } },
                    room: { select: { number: true } },
                },
            }),
            this.prisma.payment.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    stay: {
                        select: {
                            guest: { select: { firstName: true, lastName: true } },
                            room: { select: { number: true } },
                        },
                    },
                },
            }),
        ]);

        const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

        const recentActivity = [
            ...recentStays.map((s: any) => ({
                id: s.id,
                type: 'stay' as const,
                description: `Check-in: ${s.guest?.firstName} ${s.guest?.lastName} - Hab. ${s.room?.number}`,
                timestamp: s.createdAt,
            })),
            ...recentPayments.map((p: any) => ({
                id: p.id,
                type: 'payment' as const,
                description: `Pago S/ ${Number(p.amount).toFixed(2)} - ${p.stay?.guest ? `${p.stay.guest.firstName} ${p.stay.guest.lastName}` : 'Sin estadía'}`,
                timestamp: p.createdAt,
            })),
        ]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 8);

        return {
            occupancy: {
                totalRooms,
                occupiedRooms,
                availableRooms,
                maintenanceRooms,
                cleaningRooms,
                occupancyRate,
            },
            stays: {
                activeStays,
                checkInsToday,
                checkOutsToday,
            },
            reservations: {
                pendingReservations,
                confirmedReservations,
                next7DaysReservations,
            },
            revenue: {
                todayRevenue: Number(todayRevenueResult._sum.amount ?? 0),
                weekRevenue: Number(weekRevenueResult._sum.amount ?? 0),
                monthRevenue: Number(monthRevenueResult._sum.amount ?? 0),
            },
            totalGuests,
            lowStockProducts: 0,
            recentActivity,
        };
    }
}
