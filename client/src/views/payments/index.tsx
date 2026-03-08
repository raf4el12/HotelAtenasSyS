'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { staysService } from '@/services/stays.service';
import { PaymentsTable } from './components/PaymentsTable';
import { PaymentFilters } from './components/PaymentFilters';
import { PaymentDrawer } from './components/PaymentDrawer';
import { VoidDialog } from './components/VoidDialog';
import { usePayments } from './hooks/use-payments';
import type { CreatePaymentPayload } from './types';

export default function PaymentsView() {
  const [search, setSearch] = useState('');
  const [method, setMethod] = useState('ALL');
  const [type, setType] = useState('ALL');
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [voidId, setVoidId] = useState<string | null>(null);

  const { data: staysData } = useQuery({
    queryKey: ['stays', { pageSize: 100, status: 'ACTIVE' }],
    queryFn: () => staysService.findAll({ pageSize: 100, status: 'ACTIVE' }),
  });

  const { data, isLoading, registerMutation, voidMutation } = usePayments({
    searchValue: search,
    currentPage: page,
    pageSize: 10,
    ...(method !== 'ALL' ? { method } : {}),
    ...(type !== 'ALL' ? { type } : {}),
  });

  const handleClose = () => setDrawerOpen(false);

  const handleRegister = (payload: CreatePaymentPayload) => {
    registerMutation.mutate(payload, { onSuccess: handleClose });
  };

  const handleVoid = (reason: string) => {
    if (voidId) {
      voidMutation.mutate({ id: voidId, reason }, { onSuccess: () => setVoidId(null) });
    }
  };

  const resetPage = () => setPage(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pagos</h1>
        <Button onClick={() => setDrawerOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Registrar pago
        </Button>
      </div>

      <PaymentFilters
        search={search}
        method={method}
        type={type}
        onSearchChange={(v) => { setSearch(v); resetPage(); }}
        onMethodChange={(v) => { setMethod(v); resetPage(); }}
        onTypeChange={(v) => { setType(v); resetPage(); }}
      />

      <PaymentsTable
        payments={data?.rows ?? []}
        isLoading={isLoading}
        onVoid={(id) => setVoidId(id)}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />

      <PaymentDrawer
        open={drawerOpen}
        onClose={handleClose}
        stays={staysData?.rows ?? []}
        onCreate={handleRegister}
        isLoading={registerMutation.isPending}
      />

      <VoidDialog
        open={!!voidId}
        onClose={() => setVoidId(null)}
        onConfirm={handleVoid}
        isLoading={voidMutation.isPending}
      />
    </div>
  );
}
