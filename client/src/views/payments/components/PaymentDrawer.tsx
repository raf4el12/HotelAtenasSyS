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
import { usePaymentForm } from '../hooks/use-payment-form';
import type { CreatePaymentPayload, PaymentMethod, PaymentType } from '../types';
import type { PaymentFormData } from '../functions/payment.schema';
import type { Stay } from '@/views/stays/types';

interface PaymentDrawerProps {
  open: boolean;
  onClose: () => void;
  stays: Stay[];
  onCreate: (data: CreatePaymentPayload) => void;
  isLoading: boolean;
}

export function PaymentDrawer({
  open,
  onClose,
  stays,
  onCreate,
  isLoading,
}: PaymentDrawerProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = usePaymentForm();

  const method = watch('method');
  const type = watch('type');
  const stayId = watch('stayId');

  useEffect(() => {
    if (!open) {
      reset({
        amount: 0,
        method: 'CASH',
        type: 'STAY_PAYMENT',
        stayId: '',
        reservationId: '',
        notes: '',
        referenceCode: '',
      });
    }
  }, [open, reset]);

  const activeStays = stays.filter((s) => s.status === 'ACTIVE');

  const onSubmit = (data: PaymentFormData) => {
    const payload: CreatePaymentPayload = {
      amount: data.amount,
      method: data.method as PaymentMethod,
      type: data.type as PaymentType,
    };
    if (data.stayId) payload.stayId = data.stayId;
    if (data.reservationId) payload.reservationId = data.reservationId;
    if (data.notes) payload.notes = data.notes;
    if (data.referenceCode) payload.referenceCode = data.referenceCode;
    onCreate(payload);
  };

  const showReferenceCode = method !== 'CASH';

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Registrar pago</SheetTitle>
          <SheetDescription>
            Registra un nuevo pago. Para pagos con tarjeta conecta Stripe y usa el código de referencia.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
          <div className="space-y-1">
            <Label>Estadía (opcional)</Label>
            <Select value={stayId || 'none'} onValueChange={(v) => setValue('stayId', v === 'none' ? '' : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sin estadía asociada" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin estadía asociada</SelectItem>
                {activeStays.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    Hab. {s.room?.number} - {s.guest?.firstName} {s.guest?.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="amount">Monto (S/)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Método de pago</Label>
            <Select value={method} onValueChange={(v) => setValue('method', v as PaymentMethod)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Efectivo</SelectItem>
                <SelectItem value="YAPE">Yape</SelectItem>
                <SelectItem value="PLIN">Plin</SelectItem>
                <SelectItem value="TRANSFER">Transferencia</SelectItem>
                <SelectItem value="CARD">Tarjeta (Stripe)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Tipo de pago</Label>
            <Select value={type} onValueChange={(v) => setValue('type', v as PaymentType)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STAY_PAYMENT">Pago de estadía</SelectItem>
                <SelectItem value="RESERVATION_DEPOSIT">Depósito de reserva</SelectItem>
                <SelectItem value="POS_SALE">Venta POS</SelectItem>
                <SelectItem value="ROOM_CHARGE">Cargo a habitación</SelectItem>
                <SelectItem value="ROOM_CHARGE_SETTLE">Liquidación de cargo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showReferenceCode && (
            <div className="space-y-1">
              <Label htmlFor="referenceCode">
                {method === 'CARD' ? 'Stripe Payment Intent ID' : 'Nro. de operación'}
              </Label>
              <Input
                id="referenceCode"
                placeholder={method === 'CARD' ? 'pi_...' : 'Código de referencia'}
                {...register('referenceCode')}
              />
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Input id="notes" placeholder="Observaciones..." {...register('notes')} />
          </div>

          <SheetFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrar pago'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
