'use client';

import { Ban } from 'lucide-react';
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
import type { Payment } from '../types';

const methodLabels: Record<string, string> = {
  CASH: 'Efectivo',
  YAPE: 'Yape',
  PLIN: 'Plin',
  TRANSFER: 'Transferencia',
  CARD: 'Tarjeta',
};

const typeLabels: Record<string, string> = {
  STAY_PAYMENT: 'Estadía',
  RESERVATION_DEPOSIT: 'Depósito',
  POS_SALE: 'Venta POS',
  ROOM_CHARGE: 'Cargo hab.',
  ROOM_CHARGE_SETTLE: 'Liquidación',
};

const methodColors: Record<string, string> = {
  CASH: 'bg-green-500/15 text-green-400 border-green-500/30',
  YAPE: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  PLIN: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  TRANSFER: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  CARD: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
};

interface PaymentsTableProps {
  payments: Payment[];
  isLoading: boolean;
  onVoid: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaymentsTable({
  payments,
  isLoading,
  onVoid,
  page,
  totalPages,
  onPageChange,
}: PaymentsTableProps) {
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
              <TableHead>Fecha</TableHead>
              <TableHead>Huésped / Ref.</TableHead>
              <TableHead>Habitación</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No se encontraron pagos
                </TableCell>
              </TableRow>
            ) : (
              payments.map((p) => (
                <TableRow key={p.id} className={p.voidedAt ? 'opacity-50' : ''}>
                  <TableCell>{formatDate(p.createdAt)}</TableCell>
                  <TableCell className="font-medium">
                    {p.stay?.guest
                      ? `${p.stay.guest.firstName} ${p.stay.guest.lastName}`
                      : p.referenceCode ?? '-'}
                  </TableCell>
                  <TableCell>{p.stay?.room?.number ?? '-'}</TableCell>
                  <TableCell>{typeLabels[p.type] ?? p.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={methodColors[p.method]}>
                      {methodLabels[p.method] ?? p.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">S/ {p.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    {p.voidedAt ? (
                      <Badge variant="outline" className="bg-red-500/15 text-red-400 border-red-500/30">
                        Anulado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-500/15 text-green-400 border-green-500/30">
                        Vigente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!p.voidedAt && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onVoid(p.id)}
                        title="Anular pago"
                      >
                        <Ban className="h-4 w-4 text-red-400" />
                      </Button>
                    )}
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
