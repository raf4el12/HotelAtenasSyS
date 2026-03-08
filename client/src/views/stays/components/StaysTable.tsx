'use client';

import { LogOut, Ban } from 'lucide-react';
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
import type { Stay } from '../types';

const statusLabels: Record<string, string> = {
  ACTIVE: 'Activa',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-500/15 text-green-400 border-green-500/30',
  COMPLETED: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  CANCELLED: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const modeLabels: Record<string, string> = {
  HOURLY: 'Por horas',
  OVERNIGHT: 'Noche',
  PACKAGE: 'Paquete',
};

interface StaysTableProps {
  stays: Stay[];
  isLoading: boolean;
  onCheckOut: (id: string) => void;
  onCancel: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function StaysTable({
  stays,
  isLoading,
  onCheckOut,
  onCancel,
  page,
  totalPages,
  onPageChange,
}: StaysTableProps) {
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
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stays.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No se encontraron estadías
                </TableCell>
              </TableRow>
            ) : (
              stays.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">
                    {s.guest?.firstName} {s.guest?.lastName}
                  </TableCell>
                  <TableCell>{s.room?.number}</TableCell>
                  <TableCell>{modeLabels[s.stayMode] ?? s.stayMode}</TableCell>
                  <TableCell>{formatDate(s.checkIn)}</TableCell>
                  <TableCell>
                    {s.actualCheckOut ? formatDate(s.actualCheckOut) : formatDate(s.checkOut)}
                  </TableCell>
                  <TableCell>S/ {s.stayPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[s.status]}>
                      {statusLabels[s.status] ?? s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {s.status === 'ACTIVE' && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onCheckOut(s.id)}
                            title="Check-out"
                          >
                            <LogOut className="h-4 w-4 text-blue-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onCancel(s.id)}
                            title="Cancelar"
                          >
                            <Ban className="h-4 w-4 text-red-400" />
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
