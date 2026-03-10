'use client';

import { useQuery } from '@tanstack/react-query';
import {
  BedDouble,
  CalendarCheck,
  DoorOpen,
  Users,
  Banknote,
  LogIn,
  LogOut,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboardService } from '@/services/dashboard.service';

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
            Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Cargando estadisticas...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[140px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const formatCurrency = (n: number) =>
    `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

  const formatDate = (ts: string) =>
    new Date(ts).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
          Bienvenido
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Resumen de operaciones del hotel</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Occupancy */}
        <Card className="glass-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-8 translate-x-8" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ocupacion
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <BedDouble className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.occupancy.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.occupancy.occupiedRooms} de {stats.occupancy.totalRooms} habitaciones
            </p>
            <div className="w-full bg-secondary rounded-full h-1.5 mt-3">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${stats.occupancy.occupancyRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Active Stays */}
        <Card className="glass-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-8 translate-x-8" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estadias activas
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <DoorOpen className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.stays.activeStays}</div>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <LogIn className="h-3 w-3 text-emerald-400" />
                {stats.stays.checkInsToday} check-in
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <LogOut className="h-3 w-3 text-blue-400" />
                {stats.stays.checkOutsToday} check-out
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Reservations */}
        <Card className="glass-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -translate-y-8 translate-x-8" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reservas
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <CalendarCheck className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.reservations.next7DaysReservations}</div>
            <p className="text-xs text-muted-foreground mt-1">Proximos 7 dias</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Clock className="h-3 w-3 text-yellow-400" />
              <span className="text-xs text-yellow-400">
                {stats.reservations.pendingReservations} pendientes
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="glass-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-8 translate-x-8" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos hoy
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <Banknote className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-emerald-400">
              {formatCurrency(stats.revenue.todayRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Semana: {formatCurrency(stats.revenue.weekRevenue)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Room Status */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Estado de habitaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2.5 text-sm">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
                  Disponibles
                </span>
                <span className="font-semibold tabular-nums">{stats.occupancy.availableRooms}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2.5 text-sm">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-red-500/20" />
                  Ocupadas
                </span>
                <span className="font-semibold tabular-nums">{stats.occupancy.occupiedRooms}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2.5 text-sm">
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 ring-2 ring-yellow-500/20" />
                  Limpieza
                </span>
                <span className="font-semibold tabular-nums">{stats.occupancy.cleaningRooms}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2.5 text-sm">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-500 ring-2 ring-slate-500/20" />
                  Mantenimiento
                </span>
                <span className="font-semibold tabular-nums">{stats.occupancy.maintenanceRooms}</span>
              </div>

              {/* Stacked bar */}
              <div className="flex h-3 w-full rounded-full overflow-hidden bg-secondary mt-1">
                {stats.occupancy.occupiedRooms > 0 && (
                  <div
                    className="bg-red-500 transition-all duration-700"
                    style={{ width: `${(stats.occupancy.occupiedRooms / stats.occupancy.totalRooms) * 100}%` }}
                  />
                )}
                {stats.occupancy.cleaningRooms > 0 && (
                  <div
                    className="bg-yellow-500 transition-all duration-700"
                    style={{ width: `${(stats.occupancy.cleaningRooms / stats.occupancy.totalRooms) * 100}%` }}
                  />
                )}
                {stats.occupancy.maintenanceRooms > 0 && (
                  <div
                    className="bg-slate-500 transition-all duration-700"
                    style={{ width: `${(stats.occupancy.maintenanceRooms / stats.occupancy.totalRooms) * 100}%` }}
                  />
                )}
                {stats.occupancy.availableRooms > 0 && (
                  <div
                    className="bg-emerald-500 transition-all duration-700"
                    style={{ width: `${(stats.occupancy.availableRooms / stats.occupancy.totalRooms) * 100}%` }}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Summary */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Resumen de ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Hoy</span>
                <span className="font-semibold text-emerald-400 tabular-nums">
                  {formatCurrency(stats.revenue.todayRevenue)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Esta semana</span>
                <span className="font-semibold tabular-nums">{formatCurrency(stats.revenue.weekRevenue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Este mes</span>
                <span className="font-semibold tabular-nums">{formatCurrency(stats.revenue.monthRevenue)}</span>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Huespedes registrados</span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Users className="h-4 w-4 text-primary" />
                    {stats.totalGuests}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Actividad reciente</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Sin actividad reciente
              </p>
            ) : (
              <div className="space-y-3">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      activity.type === 'stay'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {activity.type === 'stay' ? (
                        <DoorOpen className="h-3.5 w-3.5" />
                      ) : (
                        <Banknote className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{activity.description}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {formatDate(activity.timestamp)} - {formatTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
