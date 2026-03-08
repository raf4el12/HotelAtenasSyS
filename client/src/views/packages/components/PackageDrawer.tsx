'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
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
import { productsService } from '@/services/products.service';
import { usePackageForm } from '../hooks/use-package-form';
import type { Package, CreatePackagePayload, PackageCategory, PackageStayMode } from '../types';

interface PackageDrawerProps {
  open: boolean;
  onClose: () => void;
  pkg?: Package;
  onCreate: (data: CreatePackagePayload) => void;
  onUpdate: (id: string, data: Partial<CreatePackagePayload>) => void;
  isLoading: boolean;
}

export function PackageDrawer({
  open,
  onClose,
  pkg,
  onCreate,
  onUpdate,
  isLoading,
}: PackageDrawerProps) {
  const isEditing = !!pkg;

  const { data: productsData } = useQuery({
    queryKey: ['products', { pageSize: 100, status: 'ACTIVE' }],
    queryFn: () => productsService.findAll({ pageSize: 100, status: 'ACTIVE' }),
  });

  const products = productsData?.rows ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = usePackageForm(pkg);

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const category = watch('category');
  const stayMode = watch('stayMode');

  useEffect(() => {
    if (pkg) {
      reset({
        name: pkg.name,
        description: pkg.description ?? '',
        category: pkg.category,
        stayMode: pkg.stayMode,
        totalPrice: pkg.totalPrice,
        validFrom: pkg.validFrom ?? '',
        validTo: pkg.validTo ?? '',
        items:
          pkg.items?.map((item) => ({ productId: item.productId, quantity: item.quantity })) ?? [],
      });
    } else {
      reset({
        name: '',
        description: '',
        category: 'NORMAL',
        stayMode: 'OVERNIGHT',
        totalPrice: 0,
        validFrom: '',
        validTo: '',
        items: [],
      });
    }
  }, [pkg, reset]);

  const onSubmit = (data: CreatePackagePayload) => {
    const clean: CreatePackagePayload = {
      ...data,
      description: data.description || undefined,
      validFrom: data.validFrom || undefined,
      validTo: data.validTo || undefined,
    };
    if (isEditing) {
      onUpdate(pkg.id, clean);
    } else {
      onCreate(clean);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar paquete' : 'Nuevo paquete'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Modifica los datos del paquete seleccionado.'
              : 'Completa los datos para crear un nuevo paquete.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
          <div className="space-y-1">
            <Label htmlFor="pkg-name">Nombre</Label>
            <Input id="pkg-name" placeholder="Paquete romantico" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="pkg-description">Descripcion (opcional)</Label>
            <Input id="pkg-description" placeholder="Descripcion..." {...register('description')} />
          </div>

          <div className="space-y-1">
            <Label>Categoria</Label>
            <Select
              value={category}
              onValueChange={(v) => setValue('category', v as PackageCategory)}
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

          <div className="space-y-1">
            <Label>Modo de estancia</Label>
            <Select
              value={stayMode}
              onValueChange={(v) => setValue('stayMode', v as PackageStayMode)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar modo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOURLY">Por hora</SelectItem>
                <SelectItem value="OVERNIGHT">Noche</SelectItem>
                <SelectItem value="PACKAGE">Paquete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="pkg-price">Precio total (S/)</Label>
            <Input
              id="pkg-price"
              type="number"
              step="0.01"
              placeholder="100.00"
              {...register('totalPrice', { valueAsNumber: true })}
            />
            {errors.totalPrice && (
              <p className="text-xs text-destructive">{errors.totalPrice.message}</p>
            )}
          </div>

          {/* Dynamic items section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Productos incluidos</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ productId: '', quantity: 1 })}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Agregar
              </Button>
            </div>

            {fields.length === 0 && (
              <p className="text-xs text-muted-foreground">Sin productos agregados.</p>
            )}

            {fields.map((field, index) => {
              const itemProductId = watch(`items.${index}.productId`);
              return (
                <div key={field.id} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-1">
                    <Select
                      value={itemProductId}
                      onValueChange={(v) => setValue(`items.${index}.productId`, v)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} — S/ {p.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.items?.[index]?.productId && (
                      <p className="text-xs text-destructive">
                        {errors.items[index]?.productId?.message}
                      </p>
                    )}
                  </div>
                  <div className="w-20">
                    <Input
                      type="number"
                      placeholder="Cant."
                      className="h-9"
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive hover:text-destructive shrink-0"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
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
                  : 'Crear paquete'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
