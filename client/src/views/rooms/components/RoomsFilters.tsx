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
import type { Floor } from '@/views/floors/types';

interface RoomsFiltersProps {
  search: string;
  status: string;
  category: string;
  floorId: string;
  floors: Floor[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onFloorChange: (value: string) => void;
}

export function RoomsFilters({
  search,
  status,
  category,
  floorId,
  floors,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onFloorChange,
}: RoomsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar habitacion..."
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
          <SelectItem value="AVAILABLE">Disponible</SelectItem>
          <SelectItem value="OCCUPIED">Ocupada</SelectItem>
          <SelectItem value="CLEANING">Limpieza</SelectItem>
          <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
        </SelectContent>
      </Select>

      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todas</SelectItem>
          <SelectItem value="NORMAL">Normal</SelectItem>
          <SelectItem value="PREMIUM">Premium</SelectItem>
        </SelectContent>
      </Select>

      <Select value={floorId} onValueChange={onFloorChange}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Piso" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos los pisos</SelectItem>
          {floors.map((f) => (
            <SelectItem key={f.id} value={f.id}>
              Piso {f.number} - {f.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
