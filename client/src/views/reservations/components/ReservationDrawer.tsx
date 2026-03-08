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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReservationForm } from '../hooks/use-reservation-form';
import type { Reservation, CreateReservationPayload, StayMode } from '../types';
import type { ReservationFormData } from '../functions/reservation.schema';
import type { Guest } from '@/views/guests/types';
import type { Room } from '@/views/rooms/types';

interface ReservationDrawerProps {
  open: boolean;
  onClose: () => void;
  reservation?: Reservation;
  guests: Guest[];
  rooms: Room[];
  onCreate: (data: CreateReservationPayload) => void;
  isLoading: boolean;
}

export function ReservationDrawer({
  open,
  onClose,
  reservation,
  guests,
  rooms,
  onCreate,
  isLoading,
}: ReservationDrawerProps) {
  const isEditing = !!reservation;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useReservationForm(reservation);

  const stayMode = watch('stayMode');
  const guestId = watch('guestId');
  const roomId = watch('roomId');

  useEffect(() => {
    if (reservation) {
      reset({
        guestId: reservation.guestId,
        roomId: reservation.roomId,
        stayMode: reservation.stayMode,
        scheduledCheckIn: new Date(reservation.scheduledCheckIn).toISOString().slice(0, 16),
        scheduledCheckOut: new Date(reservation.scheduledCheckOut).toISOString().slice(0, 16),
        estimatedPrice: reservation.estimatedPrice,
        notes: reservation.notes ?? '',
      });
    } else {
      reset({
        guestId: '',
        roomId: '',
        stayMode: 'OVERNIGHT',
        scheduledCheckIn: '',
        scheduledCheckOut: '',
        estimatedPrice: 0,
        notes: '',
      });
    }
  }, [reservation, reset]);

  const onSubmit = (data: ReservationFormData) => {
    onCreate(data as CreateReservationPayload);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Detalle de reserva' : 'Nueva reserva'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Información de la reserva seleccionada.'
              : 'Completa los datos para crear una nueva reserva.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
          <div className="space-y-1">
            <Label>Huésped</Label>
            <Select value={guestId} onValueChange={(v) => setValue('guestId', v)} disabled={isEditing}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar huésped" />
              </SelectTrigger>
              <SelectContent>
                {guests.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.firstName} {g.lastName} - {g.dni}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.guestId && <p className="text-xs text-destructive">{errors.guestId.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Habitación</Label>
            <Select value={roomId} onValueChange={(v) => setValue('roomId', v)} disabled={isEditing}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar habitación" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.number} - {r.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.roomId && <p className="text-xs text-destructive">{errors.roomId.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Modalidad</Label>
            <Select value={stayMode} onValueChange={(v) => setValue('stayMode', v as StayMode)} disabled={isEditing}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar modalidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOURLY">Por horas</SelectItem>
                <SelectItem value="OVERNIGHT">Noche</SelectItem>
                <SelectItem value="PACKAGE">Paquete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="check-in">Check-in programado</Label>
            <Input id="check-in" type="datetime-local" {...register('scheduledCheckIn')} disabled={isEditing} />
            {errors.scheduledCheckIn && (
              <p className="text-xs text-destructive">{errors.scheduledCheckIn.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="check-out">Check-out programado</Label>
            <Input id="check-out" type="datetime-local" {...register('scheduledCheckOut')} disabled={isEditing} />
            {errors.scheduledCheckOut && (
              <p className="text-xs text-destructive">{errors.scheduledCheckOut.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="price">Precio estimado (S/)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register('estimatedPrice', { valueAsNumber: true })}
              disabled={isEditing}
            />
            {errors.estimatedPrice && (
              <p className="text-xs text-destructive">{errors.estimatedPrice.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Input id="notes" placeholder="Notas adicionales..." {...register('notes')} disabled={isEditing} />
          </div>

          <SheetFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {isEditing ? 'Cerrar' : 'Cancelar'}
            </Button>
            {!isEditing && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creando...' : 'Crear reserva'}
              </Button>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
