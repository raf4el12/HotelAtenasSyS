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

interface RateRulesFiltersProps {
  search: string;
  stayMode: string;
  category: string;
  onSearchChange: (value: string) => void;
  onStayModeChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function RateRulesFilters({
  search,
  stayMode,
  category,
  onSearchChange,
  onStayModeChange,
  onCategoryChange,
}: RateRulesFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar tarifa..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={stayMode} onValueChange={onStayModeChange}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Modo de estancia" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos los modos</SelectItem>
          <SelectItem value="HOURLY">Por hora</SelectItem>
          <SelectItem value="OVERNIGHT">Noche</SelectItem>
          <SelectItem value="PACKAGE">Paquete</SelectItem>
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
    </div>
  );
}
