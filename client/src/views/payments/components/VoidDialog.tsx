'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VoidDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
}

export function VoidDialog({ open, onClose, onConfirm, isLoading }: VoidDialogProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim());
      setReason('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anular pago</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Ingresa el motivo de la anulación.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1">
          <Label htmlFor="void-reason">Motivo</Label>
          <Input
            id="void-reason"
            placeholder="Ej: Pago duplicado, error de monto..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isLoading}
          >
            {isLoading ? 'Anulando...' : 'Anular pago'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
