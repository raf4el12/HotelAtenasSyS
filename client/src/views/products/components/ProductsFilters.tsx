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

interface ProductsFiltersProps {
  search: string;
  category: string;
  status: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function ProductsFilters({
  search,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: ProductsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todas las categorias</SelectItem>
          <SelectItem value="BEVERAGE_WATER">Agua</SelectItem>
          <SelectItem value="BEVERAGE_ENERGY">Energizante</SelectItem>
          <SelectItem value="BEVERAGE_ALCOHOL">Alcohol</SelectItem>
          <SelectItem value="SNACK_CANDY">Dulce</SelectItem>
          <SelectItem value="SNACK_SAVORY">Salado</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          <SelectItem value="ACTIVE">Activo</SelectItem>
          <SelectItem value="DISCONTINUED">Descontinuado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
