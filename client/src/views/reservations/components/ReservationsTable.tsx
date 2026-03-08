'use client';

import { Pencil, Check, LogIn, X, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Reservation } from '../types';

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  CHECKED_IN: 'Check-in',
  CANCELLED: 'Cancelada',
  NO_SHOW: 'No-show',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  CONFIRMED: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  CHECKED_IN: 'bg-green-500/15 text-green-400 border-green-500/30',
  CANCELLED: 'bg-red-500/15 text-red-400 border-red-500/30',
  NO_SHOW: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

const modeLabels: Record<string, string> = {
  HOURLY: 'Por horas',
  OVERNIGHT: 'Noche',
  PACKAGE: 'Paquete',
};

interface ReservationsTableProps {
  reservations: Reservation[];
  isLoading: boolean;
  onEdit: (reservation: Reservation) => void;
  onConfirm: (id: string) => void;
  onCheckIn: (id: string) => void;
  onCancel: (id: string) => void;
  onNoShow: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ReservationsTable({
  reservations,
  isLoading,
  onEdit,
  onConfirm,
  onCheckIn,
  onCancel,
  onNoShow,
  page,
  totalPages,
  onPageChange,
}: ReservationsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Huésped</TableHead>
              <TableHead>Habitación</TableHead>
              <TableHead>Modalidad</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Precio est.</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No se encontraron reservas
                </TableCell>
              </TableRow>
            ) : (
              reservations.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">
                    {r.guest?.firstName} {r.guest?.lastName}
                  </TableCell>
                  <TableCell>{r.room?.number}</TableCell>
                  <TableCell>{modeLabels[r.stayMode] ?? r.stayMode}</TableCell>
                  <TableCell>{formatDate(r.scheduledCheckIn)}</TableCell>
                  <TableCell>{formatDate(r.scheduledCheckOut)}</TableCell>
                  <TableCell>S/ {r.estimatedPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[r.status]}>
                      {statusLabels[r.status] ?? r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {r.status === 'PENDING' && (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => onEdit(r)} title="Editar">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onConfirm(r.id)} title="Confirmar">
                            <Check className="h-4 w-4 text-blue-400" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onCancel(r.id)} title="Cancelar">
                            <X className="h-4 w-4 text-red-400" />
                          </Button>
                        </>
                      )}
                      {r.status === 'CONFIRMED' && (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => onCheckIn(r.id)} title="Check-in">
                            <LogIn className="h-4 w-4 text-green-400" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onCancel(r.id)} title="Cancelar">
                            <X className="h-4 w-4 text-red-400" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onNoShow(r.id)} title="No-show">
                            <AlertCircle className="h-4 w-4 text-slate-400" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
