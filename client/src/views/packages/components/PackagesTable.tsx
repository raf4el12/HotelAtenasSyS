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
import type { Package } from '../types';

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

interface PackagesTableProps {
  packages: Package[];
  isLoading: boolean;
  onEdit: (pkg: Package) => void;
  onDelete: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PackagesTable({
  packages,
  isLoading,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPageChange,
}: PackagesTableProps) {
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
              <TableHead>Precio total</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No se encontraron paquetes
                </TableCell>
              </TableRow>
            ) : (
              packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell>
                    <Badge className={stayModeColors[pkg.stayMode]}>
                      {stayModeLabels[pkg.stayMode] ?? pkg.stayMode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={categoryColors[pkg.category]}>{pkg.category}</Badge>
                  </TableCell>
                  <TableCell>S/ {pkg.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>{pkg.items?.length ?? 0} item(s)</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        pkg.isActive
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                      }
                    >
                      {pkg.isActive ? 'Si' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(pkg)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(pkg.id)}
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
