'use client';

import { Pencil } from 'lucide-react';
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
import type { Guest } from '../types';

interface GuestsTableProps {
  guests: Guest[];
  isLoading: boolean;
  onEdit: (guest: Guest) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const DOC_TYPE_LABELS: Record<string, string> = {
  DNI: 'DNI',
  PASSPORT: 'Pasaporte',
  CE: 'C.E.',
  OTHER: 'Otro',
};

export function GuestsTable({
  guests,
  isLoading,
  onEdit,
  page,
  totalPages,
  onPageChange,
}: GuestsTableProps) {
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
              <TableHead>Documento</TableHead>
              <TableHead>Nombre completo</TableHead>
              <TableHead>Telefono</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Nacionalidad</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No se encontraron huespedes
                </TableCell>
              </TableRow>
            ) : (
              guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium">
                    <span className="text-muted-foreground text-xs mr-1.5">
                      {DOC_TYPE_LABELS[guest.documentType ?? 'DNI'] ?? guest.documentType}
                    </span>
                    {guest.dni}
                  </TableCell>
                  <TableCell>
                    {guest.firstName} {guest.lastName}
                  </TableCell>
                  <TableCell>{guest.phone ?? '-'}</TableCell>
                  <TableCell>{guest.email ?? '-'}</TableCell>
                  <TableCell>{guest.nationality ?? '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(guest)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
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
