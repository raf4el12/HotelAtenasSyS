'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { floorsService } from '@/services/floors.service';
import { useRoomForm } from '../hooks/use-room-form';
import type { Room, CreateRoomPayload, RoomCategory } from '../types';
import type { RoomFormData } from '../functions/room.schema';

interface RoomDrawerProps {
  open: boolean;
  onClose: () => void;
  room?: Room;
  onCreate: (data: CreateRoomPayload) => void;
  onUpdate: (id: string, data: Partial<CreateRoomPayload>) => void;
  isLoading: boolean;
}

export function RoomDrawer({ open, onClose, room, onCreate, onUpdate, isLoading }: RoomDrawerProps) {
  const isEditing = !!room;

  const { data: floorsData } = useQuery({
    queryKey: ['floors', { pageSize: 100 }],
    queryFn: () => floorsService.findAll({ pageSize: 100 }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useRoomForm(room);

  const category = watch('category');
  const floorId = watch('floorId');

  useEffect(() => {
    if (room) {
      reset({ number: room.number, category: room.category, floorId: room.floorId });
    } else {
      reset({ number: '', category: 'NORMAL', floorId: '' });
    }
  }, [room, reset]);

  const onSubmit = (data: RoomFormData) => {
    if (isEditing) {
      onUpdate(room.id, data);
    } else {
      onCreate(data as CreateRoomPayload);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar habitacion' : 'Nueva habitacion'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Modifica los datos de la habitacion seleccionada.'
              : 'Completa los datos para crear una nueva habitacion.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
          <div className="space-y-1">
            <Label htmlFor="room-number">Numero de habitacion</Label>
            <Input id="room-number" placeholder="101" {...register('number')} />
            {errors.number && <p className="text-xs text-destructive">{errors.number.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Piso</Label>
            <Select value={floorId} onValueChange={(v) => setValue('floorId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar piso" />
              </SelectTrigger>
              <SelectContent>
                {(floorsData?.rows ?? []).map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    Piso {f.number} - {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.floorId && <p className="text-xs text-destructive">{errors.floorId.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Categoria</Label>
            <Select
              value={category}
              onValueChange={(v) => setValue('category', v as RoomCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="PREMIUM">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SheetFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Guardando...'
                : isEditing
                  ? 'Guardar cambios'
                  : 'Crear habitacion'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
