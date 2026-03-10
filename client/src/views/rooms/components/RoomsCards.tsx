'use client';

import { BedDouble, Pencil, Trash2, Users, Wind } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Room } from '../types';

const defaultStatus = { label: 'Disponible', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-500' };

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  AVAILABLE: {
    label: 'Disponible',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  OCCUPIED: {
    label: 'Ocupada',
    color: 'bg-red-500/10 text-red-400 border-red-500/20',
    dot: 'bg-red-500',
  },
  CLEANING: {
    label: 'Limpieza',
    color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    dot: 'bg-yellow-500',
  },
  MAINTENANCE: {
    label: 'Mantenimiento',
    color: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    dot: 'bg-slate-500',
  },
};

const statusBorderAccent: Record<string, string> = {
  AVAILABLE: 'border-t-emerald-500/60',
  OCCUPIED: 'border-t-red-500/60',
  CLEANING: 'border-t-yellow-500/60',
  MAINTENANCE: 'border-t-slate-500/60',
};

interface RoomsCardsProps {
  rooms: Room[];
  isLoading: boolean;
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function RoomsCards({
  rooms,
  isLoading,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPageChange,
}: RoomsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        No se encontraron habitaciones
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rooms.map((room) => {
          const st = statusConfig[room.status] || defaultStatus;
          const borderAccent = statusBorderAccent[room.status] || '';

          return (
            <div
              key={room.id}
              className={`glass-card relative rounded-xl border border-border/50 border-t-2 ${borderAccent} p-4 flex flex-col gap-3 transition-all duration-200 hover:border-border`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <BedDouble className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold leading-tight tracking-tight">{room.number}</p>
                    <p className="text-xs text-muted-foreground">
                      {room.floor ? `Piso ${room.floor.number}` : '-'}
                    </p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[11px] font-medium ${st.color}`}
                >
                  <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${st.dot} inline-block`} />
                  {st.label}
                </Badge>
              </div>

              {/* Details */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {room.maxGuests} {room.maxGuests === 1 ? 'huesped' : 'huespedes'}
                </span>
                {room.bedType && (
                  <span className="flex items-center gap-1.5">
                    <BedDouble className="h-3.5 w-3.5" />
                    {room.bedType}
                  </span>
                )}
                {room.hasWindow && (
                  <span className="flex items-center gap-1.5">
                    <Wind className="h-3.5 w-3.5" />
                    Ventana
                  </span>
                )}
              </div>

              {/* Category + Actions */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/30">
                <Badge
                  variant="outline"
                  className={`text-[11px] ${
                    room.category === 'PREMIUM'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}
                >
                  {room.category}
                </Badge>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(room)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => onDelete(room.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Pagina {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
