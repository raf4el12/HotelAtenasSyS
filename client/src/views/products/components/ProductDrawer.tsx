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
import { useProductForm } from '../hooks/use-product-form';
import type { Product, CreateProductPayload, ProductCategory } from '../types';

interface ProductDrawerProps {
  open: boolean;
  onClose: () => void;
  product?: Product;
  onCreate: (data: CreateProductPayload) => void;
  onUpdate: (id: string, data: Partial<CreateProductPayload>) => void;
  isLoading: boolean;
}

export function ProductDrawer({
  open,
  onClose,
  product,
  onCreate,
  onUpdate,
  isLoading,
}: ProductDrawerProps) {
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useProductForm(product);

  const category = watch('category');

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        minStock: product.minStock,
      });
    } else {
      reset({ name: '', category: 'BEVERAGE_WATER', price: 0, stock: 0, minStock: 0 });
    }
  }, [product, reset]);

  const onSubmit = (data: CreateProductPayload) => {
    if (isEditing) {
      onUpdate(product.id, data);
    } else {
      onCreate(data);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar producto' : 'Nuevo producto'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Modifica los datos del producto seleccionado.'
              : 'Completa los datos para crear un nuevo producto.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
          <div className="space-y-1">
            <Label htmlFor="product-name">Nombre</Label>
            <Input id="product-name" placeholder="Agua mineral" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Categoria</Label>
            <Select
              value={category}
              onValueChange={(v) => setValue('category', v as ProductCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEVERAGE_WATER">Agua</SelectItem>
                <SelectItem value="BEVERAGE_ENERGY">Energizante</SelectItem>
                <SelectItem value="BEVERAGE_ALCOHOL">Alcohol</SelectItem>
                <SelectItem value="SNACK_CANDY">Dulce</SelectItem>
                <SelectItem value="SNACK_SAVORY">Salado</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="product-price">Precio (S/)</Label>
            <Input
              id="product-price"
              type="number"
              step="0.01"
              placeholder="5.00"
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="product-stock">Stock inicial</Label>
            <Input
              id="product-stock"
              type="number"
              placeholder="0"
              {...register('stock', { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="product-minStock">Stock minimo</Label>
            <Input
              id="product-minStock"
              type="number"
              placeholder="5"
              {...register('minStock', { valueAsNumber: true })}
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
                  : 'Crear producto'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
