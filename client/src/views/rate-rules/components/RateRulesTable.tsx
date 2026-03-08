'use client';

import { Pencil, Trash2 } from 'lucide-react';
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
import type { RateRule } from '../types';

const stayModeLabels: Record<string, string> = {
  HOURLY: 'Por hora',
  OVERNIGHT: 'Noche',
  PACKAGE: 'Paquete',
};

const stayModeColors: Record<string, string> = {
  HOURLY: 'bg-blue-100 text-blue-800 border-blue-200',
  OVERNIGHT: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  PACKAGE: 'bg-purple-100 text-purple-800 border-purple-200',
};

const categoryColors: Record<string, string> = {
  NORMAL: 'bg-gray-100 text-gray-800 border-gray-200',
  PREMIUM: 'bg-amber-100 text-amber-800 border-amber-200',
};

interface RateRulesTableProps {
  rateRules: RateRule[];
  isLoading: boolean;
  onEdit: (rateRule: RateRule) => void;
  onDelete: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function RateRulesTable({
  rateRules,
  isLoading,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPageChange,
}: RateRulesTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Modo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rateRules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No se encontraron tarifas
                </TableCell>
              </TableRow>
            ) : (
              rateRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>
                    <Badge className={stayModeColors[rule.stayMode]}>
                      {stayModeLabels[rule.stayMode] ?? rule.stayMode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={categoryColors[rule.category]}>{rule.category}</Badge>
                  </TableCell>
                  <TableCell>S/ {rule.price.toFixed(2)}</TableCell>
                  <TableCell>{rule.priority}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        rule.isActive
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                      }
                    >
                      {rule.isActive ? 'Si' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(rule)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
