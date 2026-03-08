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
import { useGuestForm } from '../hooks/use-guest-form';
import type { Guest, CreateGuestPayload } from '../types';

interface GuestDrawerProps {
  open: boolean;
  onClose: () => void;
  guest?: Guest;
  onCreate: (data: CreateGuestPayload) => void;
  onUpdate: (id: string, data: Partial<CreateGuestPayload>) => void;
  isLoading: boolean;
}

export function GuestDrawer({ open, onClose, guest, onCreate, onUpdate, isLoading }: GuestDrawerProps) {
  const isEditing = !!guest;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useGuestForm(guest);

  useEffect(() => {
    if (guest) {
      reset({
        dni: guest.dni,
        firstName: guest.firstName,
        lastName: guest.lastName,
        phone: guest.phone ?? '',
        email: guest.email ?? '',
      });
    } else {
      reset({ dni: '', firstName: '', lastName: '', phone: '', email: '' });
    }
  }, [guest, reset]);

  const onSubmit = (data: CreateGuestPayload) => {
    if (isEditing) {
      onUpdate(guest.id, data);
    } else {
      onCreate(data);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar huesped' : 'Nuevo huesped'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Modifica los datos del huesped seleccionado.'
              : 'Completa los datos para registrar un nuevo huesped.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
          <div className="space-y-1">
            <Label htmlFor="guest-dni">DNI</Label>
            <Input id="guest-dni" placeholder="12345678" {...register('dni')} />
            {errors.dni && <p className="text-xs text-destructive">{errors.dni.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="guest-firstName">Nombre</Label>
            <Input id="guest-firstName" placeholder="Juan" {...register('firstName')} />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="guest-lastName">Apellido</Label>
            <Input id="guest-lastName" placeholder="Perez" {...register('lastName')} />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="guest-phone">Telefono (opcional)</Label>
            <Input id="guest-phone" placeholder="987654321" {...register('phone')} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="guest-email">Correo electronico (opcional)</Label>
            <Input
              id="guest-email"
              type="email"
              placeholder="correo@ejemplo.com"
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
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
                  : 'Registrar huesped'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
