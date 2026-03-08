'use client';

import { useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFloorForm } from '../hooks/use-floor-form';
import type { Floor, CreateFloorPayload } from '../types';

interface FloorDrawerProps {
  open: boolean;
  onClose: () => void;
  floor?: Floor;
  onCreate: (data: CreateFloorPayload) => void;
  onUpdate: (id: string, data: Partial<CreateFloorPayload>) => void;
  isLoading: boolean;
}

export function FloorDrawer({ open, onClose, floor, onCreate, onUpdate, isLoading }: FloorDrawerProps) {
  const isEditing = !!floor;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useFloorForm(floor);

  useEffect(() => {
    if (floor) {
      reset({ name: floor.name, number: floor.number });
    } else {
      reset({ name: '', number: 0 });
    }
  }, [floor, reset]);

  const onSubmit = (data: CreateFloorPayload) => {
    if (isEditing) {
      onUpdate(floor.id, data);
    } else {
      onCreate(data);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar piso' : 'Nuevo piso'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Modifica los datos del piso seleccionado.'
              : 'Completa los datos para crear un nuevo piso.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
          <div className="space-y-1">
            <Label htmlFor="floor-number">Numero de piso</Label>
            <Input
              id="floor-number"
              type="number"
              placeholder="1"
              {...register('number', { valueAsNumber: true })}
            />
            {errors.number && <p className="text-xs text-destructive">{errors.number.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="floor-name">Nombre</Label>
            <Input id="floor-name" placeholder="Piso principal" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <SheetFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear piso'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
