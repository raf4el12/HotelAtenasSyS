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
import { useRateRuleForm } from '../hooks/use-rate-rule-form';
import type { RateRule, CreateRateRulePayload, StayMode, RateRuleCategory } from '../types';

interface RateRuleDrawerProps {
  open: boolean;
  onClose: () => void;
  rateRule?: RateRule;
  onCreate: (data: CreateRateRulePayload) => void;
  onUpdate: (id: string, data: Partial<CreateRateRulePayload>) => void;
  isLoading: boolean;
}

export function RateRuleDrawer({
  open,
  onClose,
  rateRule,
  onCreate,
  onUpdate,
  isLoading,
}: RateRuleDrawerProps) {
  const isEditing = !!rateRule;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useRateRuleForm(rateRule);

  const stayMode = watch('stayMode');
  const category = watch('category');

  useEffect(() => {
    if (rateRule) {
      reset({
        name: rateRule.name,
        description: rateRule.description ?? '',
        stayMode: rateRule.stayMode,
        category: rateRule.category,
        price: rateRule.price,
        durationMin: rateRule.durationMin,
        priority: rateRule.priority,
        validFrom: rateRule.validFrom ?? '',
        validTo: rateRule.validTo ?? '',
      });
    } else {
      reset({
        name: '',
        description: '',
        stayMode: 'HOURLY',
        category: 'NORMAL',
        price: 0,
        durationMin: undefined,
        priority: 0,
        validFrom: '',
        validTo: '',
      });
    }
  }, [rateRule, reset]);

  const onSubmit = (data: CreateRateRulePayload) => {
    const clean = {
      ...data,
      validFrom: data.validFrom || undefined,
      validTo: data.validTo || undefined,
      description: data.description || undefined,
    };
    if (isEditing) {
      onUpdate(rateRule.id, clean);
    } else {
      onCreate(clean);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar tarifa' : 'Nueva tarifa'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Modifica los datos de la tarifa seleccionada.'
              : 'Completa los datos para crear una nueva tarifa.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
          <div className="space-y-1">
            <Label htmlFor="rate-name">Nombre</Label>
            <Input id="rate-name" placeholder="Tarifa estandar" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="rate-description">Descripcion (opcional)</Label>
            <Input id="rate-description" placeholder="Descripcion..." {...register('description')} />
          </div>

          <div className="space-y-1">
            <Label>Modo de estancia</Label>
            <Select
              value={stayMode}
              onValueChange={(v) => setValue('stayMode', v as StayMode)}
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
            {errors.stayMode && (
              <p className="text-xs text-destructive">{errors.stayMode.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Categoria</Label>
            <Select
              value={category}
              onValueChange={(v) => setValue('category', v as RateRuleCategory)}
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
            <Label htmlFor="rate-price">Precio (S/)</Label>
            <Input
              id="rate-price"
              type="number"
              step="0.01"
              placeholder="50.00"
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="rate-durationMin">Duracion minima (minutos)</Label>
            <Input
              id="rate-durationMin"
              type="number"
              placeholder="60"
              {...register('durationMin', { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="rate-priority">Prioridad</Label>
            <Input
              id="rate-priority"
              type="number"
              placeholder="0"
              {...register('priority', { valueAsNumber: true })}
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
                  : 'Crear tarifa'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
