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
import { useUserCreateForm, useUserEditForm } from '../hooks/use-user-form';
import type { User, CreateUserPayload, UpdateUserPayload } from '../types';

interface UserDrawerProps {
  open: boolean;
  onClose: () => void;
  user?: User;
  onCreate: (data: CreateUserPayload) => void;
  onUpdate: (id: string, data: UpdateUserPayload) => void;
  isLoading: boolean;
}

function CreateForm({
  onClose,
  onCreate,
  isLoading,
}: {
  onClose: () => void;
  onCreate: (data: CreateUserPayload) => void;
  isLoading: boolean;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useUserCreateForm();

  const role = watch('role');

  const onSubmit = (data: Parameters<typeof onCreate>[0]) => {
    onCreate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
      <div className="space-y-1">
        <Label htmlFor="email">Correo electronico</Label>
        <Input id="email" type="email" placeholder="correo@hotel.com" {...register('email')} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Contrasena</Label>
        <Input id="password" type="password" placeholder="••••••" {...register('password')} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>Rol</Label>
        <Select value={role} onValueChange={(v) => setValue('role', v as 'ADMIN' | 'RECEPTIONIST' | 'HOUSEKEEPING')}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Administrador</SelectItem>
            <SelectItem value="RECEPTIONIST">Recepcionista</SelectItem>
            <SelectItem value="HOUSEKEEPING">Limpieza</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="firstName">Nombre</Label>
        <Input id="firstName" placeholder="Juan" {...register('profile.firstName')} />
        {errors.profile?.firstName && (
          <p className="text-xs text-destructive">{errors.profile.firstName.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="lastName">Apellido</Label>
        <Input id="lastName" placeholder="Perez" {...register('profile.lastName')} />
        {errors.profile?.lastName && (
          <p className="text-xs text-destructive">{errors.profile.lastName.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="dni">DNI</Label>
        <Input id="dni" placeholder="12345678" {...register('profile.dni')} />
        {errors.profile?.dni && (
          <p className="text-xs text-destructive">{errors.profile.dni.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="phone">Telefono (opcional)</Label>
        <Input id="phone" placeholder="987654321" {...register('profile.phone')} />
      </div>

      <SheetFooter className="pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear usuario'}
        </Button>
      </SheetFooter>
    </form>
  );
}

function EditForm({
  user,
  onClose,
  onUpdate,
  isLoading,
}: {
  user: User;
  onClose: () => void;
  onUpdate: (id: string, data: UpdateUserPayload) => void;
  isLoading: boolean;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useUserEditForm(user);

  useEffect(() => {
    reset({
      email: user.email,
      role: user.role,
      profile: {
        firstName: user.profile?.firstName ?? '',
        lastName: user.profile?.lastName ?? '',
        phone: user.profile?.phone ?? '',
      },
    });
  }, [user, reset]);

  const role = watch('role');

  const onSubmit = (data: UpdateUserPayload) => {
    onUpdate(user.id, data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
      <div className="space-y-1">
        <Label htmlFor="edit-email">Correo electronico</Label>
        <Input id="edit-email" type="email" {...register('email')} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>Rol</Label>
        <Select
          value={role}
          onValueChange={(v) =>
            setValue('role', v as 'ADMIN' | 'RECEPTIONIST' | 'HOUSEKEEPING')
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Administrador</SelectItem>
            <SelectItem value="RECEPTIONIST">Recepcionista</SelectItem>
            <SelectItem value="HOUSEKEEPING">Limpieza</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="edit-firstName">Nombre</Label>
        <Input id="edit-firstName" {...register('profile.firstName')} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="edit-lastName">Apellido</Label>
        <Input id="edit-lastName" {...register('profile.lastName')} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="edit-phone">Telefono</Label>
        <Input id="edit-phone" {...register('profile.phone')} />
      </div>

      <SheetFooter className="pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </SheetFooter>
    </form>
  );
}

export function UserDrawer({ open, onClose, user, onCreate, onUpdate, isLoading }: UserDrawerProps) {
  const isEditing = !!user;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar usuario' : 'Nuevo usuario'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Modifica los datos del usuario seleccionado.'
              : 'Completa los datos para crear un nuevo usuario.'}
          </SheetDescription>
        </SheetHeader>

        {isEditing ? (
          <EditForm user={user} onClose={onClose} onUpdate={onUpdate} isLoading={isLoading} />
        ) : (
          <CreateForm onClose={onClose} onCreate={onCreate} isLoading={isLoading} />
        )}
      </SheetContent>
    </Sheet>
  );
}
