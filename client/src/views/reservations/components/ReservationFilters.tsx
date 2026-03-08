'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ReservationFiltersProps {
  search: string;
  status: string;
  stayMode: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onStayModeChange: (value: string) => void;
}

export function ReservationFilters({
  search,
  status,
  stayMode,
  onSearchChange,
  onStatusChange,
  onStayModeChange,
}: ReservationFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por huésped o habitación..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos los estados</SelectItem>
          <SelectItem value="PENDING">Pendiente</SelectItem>
          <SelectItem value="CONFIRMED">Confirmada</SelectItem>
          <SelectItem value="CHECKED_IN">Check-in</SelectItem>
          <SelectItem value="CANCELLED">Cancelada</SelectItem>
          <SelectItem value="NO_SHOW">No-show</SelectItem>
        </SelectContent>
      </Select>

      <Select value={stayMode} onValueChange={onStayModeChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Modalidad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todas</SelectItem>
          <SelectItem value="HOURLY">Por horas</SelectItem>
          <SelectItem value="OVERNIGHT">Noche</SelectItem>
          <SelectItem value="PACKAGE">Paquete</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
