import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble, CalendarCheck, DoorOpen, Users } from 'lucide-react';

const stats = [
  {
    title: 'Habitaciones Ocupadas',
    value: '--',
    icon: BedDouble,
    description: 'De total disponible',
  },
  {
    title: 'Estancias Activas',
    value: '--',
    icon: DoorOpen,
    description: 'Check-ins de hoy',
  },
  {
    title: 'Reservas Pendientes',
    value: '--',
    icon: CalendarCheck,
    description: 'Proximos 7 dias',
  },
  {
    title: 'Huespedes Registrados',
    value: '--',
    icon: Users,
    description: 'Total en sistema',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bienvenido</h2>
        <p className="text-muted-foreground">Resumen de operaciones del hotel</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Panel en construccion</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Los modulos de habitaciones, reservas, estancias y reportes se encuentran en desarrollo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
