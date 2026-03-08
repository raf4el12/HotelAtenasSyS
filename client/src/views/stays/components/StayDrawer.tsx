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
import { useStayForm } from '../hooks/use-stay-form';
import type { CreateStayPayload, StayMode } from '../types';
import type { StayFormData } from '../functions/stay.schema';
import type { Guest } from '@/views/guests/types';
import type { Room } from '@/views/rooms/types';

interface StayDrawerProps {
  open: boolean;
  onClose: () => void;
  guests: Guest[];
  rooms: Room[];
  onCreate: (data: CreateStayPayload) => void;
  isLoading: boolean;
}

export function StayDrawer({
  open,
  onClose,
  guests,
  rooms,
  onCreate,
  isLoading,
}: StayDrawerProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useStayForm();

  const stayMode = watch('stayMode');
  const guestId = watch('guestId');
  const roomId = watch('roomId');

  useEffect(() => {
    if (!open) {
      reset({
        guestId: '',
        roomId: '',
        stayMode: 'OVERNIGHT',
        rateRuleId: '',
        packageId: '',
        checkIn: '',
        checkOut: '',
        reservationId: '',
      });
    }
  }, [open, reset]);

  const availableRooms = rooms.filter((r) => r.status === 'AVAILABLE');

  const onSubmit = (data: StayFormData) => {
    const payload: CreateStayPayload = {
      guestId: data.guestId,
      roomId: data.roomId,
      stayMode: data.stayMode,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
    };
    if (data.rateRuleId) payload.rateRuleId = data.rateRuleId;
    if (data.packageId) payload.packageId = data.packageId;
    if (data.reservationId) payload.reservationId = data.reservationId;
    onCreate(payload);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Nuevo check-in</SheetTitle>
          <SheetDescription>
            Registra una nueva estadía para un huésped.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
          <div className="space-y-1">
            <Label>Huésped</Label>
            <Select value={guestId} onValueChange={(v) => setValue('guestId', v)}>
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
            <Label>Habitación disponible</Label>
            <Select value={roomId} onValueChange={(v) => setValue('roomId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar habitación" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.map((r) => (
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
            <Select value={stayMode} onValueChange={(v) => setValue('stayMode', v as StayMode)}>
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
            <Label htmlFor="stay-check-in">Check-in</Label>
            <Input id="stay-check-in" type="datetime-local" {...register('checkIn')} />
            {errors.checkIn && (
              <p className="text-xs text-destructive">{errors.checkIn.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="stay-check-out">Check-out estimado</Label>
            <Input id="stay-check-out" type="datetime-local" {...register('checkOut')} />
            {errors.checkOut && (
              <p className="text-xs text-destructive">{errors.checkOut.message}</p>
            )}
          </div>

          <SheetFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrar check-in'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
