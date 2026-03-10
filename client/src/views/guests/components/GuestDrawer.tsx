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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGuestForm } from '../hooks/use-guest-form';
import type { Guest, CreateGuestPayload } from '../types';
import type { GuestFormData } from '../functions/guest.schema';

interface GuestDrawerProps {
  open: boolean;
  onClose: () => void;
  guest?: Guest;
  onCreate: (data: CreateGuestPayload) => void;
  onUpdate: (id: string, data: Partial<CreateGuestPayload>) => void;
  isLoading: boolean;
}

const DOCUMENT_TYPES = [
  { value: 'DNI', label: 'DNI' },
  { value: 'PASSPORT', label: 'Pasaporte' },
  { value: 'CE', label: 'Carnet de extranjeria' },
  { value: 'OTHER', label: 'Otro' },
];

const GENDERS = [
  { value: 'MALE', label: 'Masculino' },
  { value: 'FEMALE', label: 'Femenino' },
  { value: 'OTHER', label: 'Otro' },
];

export function GuestDrawer({ open, onClose, guest, onCreate, onUpdate, isLoading }: GuestDrawerProps) {
  const isEditing = !!guest;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useGuestForm(guest);

  const documentType = watch('documentType');
  const gender = watch('gender');

  useEffect(() => {
    if (guest) {
      reset({
        dni: guest.dni,
        firstName: guest.firstName,
        lastName: guest.lastName,
        phone: guest.phone ?? '',
        email: guest.email ?? '',
        documentType: guest.documentType ?? '',
        nationality: guest.nationality ?? '',
        dateOfBirth: guest.dateOfBirth ? guest.dateOfBirth.split('T')[0] : '',
        gender: guest.gender ?? '',
        address: guest.address ?? '',
        city: guest.city ?? '',
        country: guest.country ?? '',
        notes: guest.notes ?? '',
      });
    } else {
      reset({
        dni: '', firstName: '', lastName: '', phone: '', email: '',
        documentType: '', nationality: '', dateOfBirth: '', gender: '',
        address: '', city: '', country: '', notes: '',
      });
    }
  }, [guest, reset]);

  const onSubmit = (data: GuestFormData) => {
    const cleaned: CreateGuestPayload = {
      dni: data.dni,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || undefined,
      email: data.email || undefined,
      documentType: data.documentType || undefined,
      nationality: data.nationality || undefined,
      dateOfBirth: data.dateOfBirth || undefined,
      gender: data.gender || undefined,
      address: data.address || undefined,
      city: data.city || undefined,
      country: data.country || undefined,
      notes: data.notes || undefined,
    };
    if (isEditing) {
      onUpdate(guest.id, cleaned);
    } else {
      onCreate(cleaned);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar huesped' : 'Nuevo huesped'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Modifica los datos del huesped seleccionado.'
              : 'Completa los datos para registrar un nuevo huesped.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
          {/* Documento */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="guest-documentType">Tipo de documento</Label>
              <Select
                value={documentType || ''}
                onValueChange={(v) => setValue('documentType', v)}
              >
                <SelectTrigger id="guest-documentType">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((dt) => (
                    <SelectItem key={dt.value} value={dt.value}>
                      {dt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="guest-dni">N° de documento</Label>
              <Input id="guest-dni" placeholder="12345678" {...register('dni')} />
              {errors.dni && <p className="text-xs text-destructive">{errors.dni.message}</p>}
            </div>
          </div>

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-3">
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
          </div>

          {/* Contacto */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="guest-phone">Telefono</Label>
              <Input id="guest-phone" placeholder="987654321" {...register('phone')} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="guest-email">Correo electronico</Label>
              <Input
                id="guest-email"
                type="email"
                placeholder="correo@ejemplo.com"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
          </div>

          {/* Personal */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="guest-dateOfBirth">Fecha de nacimiento</Label>
              <Input
                id="guest-dateOfBirth"
                type="date"
                {...register('dateOfBirth')}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="guest-gender">Genero</Label>
              <Select
                value={gender || ''}
                onValueChange={(v) => setValue('gender', v)}
              >
                <SelectTrigger id="guest-gender">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Nacionalidad */}
          <div className="space-y-1">
            <Label htmlFor="guest-nationality">Nacionalidad</Label>
            <Input id="guest-nationality" placeholder="Peruana" {...register('nationality')} />
          </div>

          {/* Direccion */}
          <div className="space-y-1">
            <Label htmlFor="guest-address">Direccion</Label>
            <Input id="guest-address" placeholder="Av. Principal 123" {...register('address')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="guest-city">Ciudad</Label>
              <Input id="guest-city" placeholder="Lima" {...register('city')} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="guest-country">Pais</Label>
              <Input id="guest-country" placeholder="Peru" {...register('country')} />
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-1">
            <Label htmlFor="guest-notes">Notas</Label>
            <Textarea
              id="guest-notes"
              placeholder="Observaciones adicionales..."
              rows={3}
              {...register('notes')}
            />
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
