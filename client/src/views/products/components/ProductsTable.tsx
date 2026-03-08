'use client';

import { Pencil, AlertTriangle } from 'lucide-react';
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
import type { Product } from '../types';

const categoryLabels: Record<string, string> = {
  BEVERAGE_WATER: 'Agua',
  BEVERAGE_ENERGY: 'Energizante',
  BEVERAGE_ALCOHOL: 'Alcohol',
  SNACK_CANDY: 'Dulce',
  SNACK_SAVORY: 'Salado',
};

const categoryColors: Record<string, string> = {
  BEVERAGE_WATER: 'bg-sky-100 text-sky-800 border-sky-200',
  BEVERAGE_ENERGY: 'bg-orange-100 text-orange-800 border-orange-200',
  BEVERAGE_ALCOHOL: 'bg-purple-100 text-purple-800 border-purple-200',
  SNACK_CANDY: 'bg-pink-100 text-pink-800 border-pink-200',
  SNACK_SAVORY: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ProductsTable({
  products,
  isLoading,
  onEdit,
  page,
  totalPages,
  onPageChange,
}: ProductsTableProps) {
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
              <TableHead>Categoria</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No se encontraron productos
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const isLowStock = product.stock <= product.minStock;
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge className={categoryColors[product.category]}>
                        {categoryLabels[product.category] ?? product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>S/ {product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`flex items-center gap-1 ${isLowStock ? 'text-red-600 font-semibold' : ''}`}
                      >
                        {isLowStock && <AlertTriangle className="h-3.5 w-3.5" />}
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          product.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                        }
                      >
                        {product.status === 'ACTIVE' ? 'Activo' : 'Descontinuado'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
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
