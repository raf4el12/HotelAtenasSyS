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

interface PaymentFiltersProps {
  search: string;
  method: string;
  type: string;
  onSearchChange: (value: string) => void;
  onMethodChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export function PaymentFilters({
  search,
  method,
  type,
  onSearchChange,
  onMethodChange,
  onTypeChange,
}: PaymentFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por referencia o huésped..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={method} onValueChange={onMethodChange}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Método" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos los métodos</SelectItem>
          <SelectItem value="CASH">Efectivo</SelectItem>
          <SelectItem value="YAPE">Yape</SelectItem>
          <SelectItem value="PLIN">Plin</SelectItem>
          <SelectItem value="TRANSFER">Transferencia</SelectItem>
          <SelectItem value="CARD">Tarjeta</SelectItem>
        </SelectContent>
      </Select>

      <Select value={type} onValueChange={onTypeChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos los tipos</SelectItem>
          <SelectItem value="STAY_PAYMENT">Pago de estadía</SelectItem>
          <SelectItem value="RESERVATION_DEPOSIT">Depósito reserva</SelectItem>
          <SelectItem value="POS_SALE">Venta POS</SelectItem>
          <SelectItem value="ROOM_CHARGE">Cargo habitación</SelectItem>
          <SelectItem value="ROOM_CHARGE_SETTLE">Liquidación cargo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
