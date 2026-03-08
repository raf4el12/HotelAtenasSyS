'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { guestsService } from '@/services/guests.service';
import { roomsService } from '@/services/rooms.service';
import { StaysTable } from './components/StaysTable';
import { StayFilters } from './components/StayFilters';
import { StayDrawer } from './components/StayDrawer';
import { useStays } from './hooks/use-stays';
import type { CreateStayPayload } from './types';

export default function StaysView() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [stayMode, setStayMode] = useState('ALL');
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: guestsData } = useQuery({
    queryKey: ['guests', { pageSize: 100 }],
    queryFn: () => guestsService.findAll({ pageSize: 100 }),
  });

  const { data: roomsData } = useQuery({
    queryKey: ['rooms', { pageSize: 100 }],
    queryFn: () => roomsService.findAll({ pageSize: 100 }),
  });

  const { data, isLoading, createMutation, checkOutMutation, cancelMutation } = useStays({
    searchValue: search,
    currentPage: page,
    pageSize: 10,
    ...(status !== 'ALL' ? { status } : {}),
    ...(stayMode !== 'ALL' ? { stayMode } : {}),
  });

  const handleClose = () => setDrawerOpen(false);

  const handleCreate = (payload: CreateStayPayload) => {
    createMutation.mutate(payload, { onSuccess: handleClose });
  };

  const resetPage = () => setPage(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recepción</h1>
        <Button onClick={() => setDrawerOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo check-in
        </Button>
      </div>

      <StayFilters
        search={search}
        status={status}
        stayMode={stayMode}
        onSearchChange={(v) => { setSearch(v); resetPage(); }}
        onStatusChange={(v) => { setStatus(v); resetPage(); }}
        onStayModeChange={(v) => { setStayMode(v); resetPage(); }}
      />

      <StaysTable
        stays={data?.rows ?? []}
        isLoading={isLoading}
        onCheckOut={(id) => checkOutMutation.mutate(id)}
        onCancel={(id) => cancelMutation.mutate(id)}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />

      <StayDrawer
        open={drawerOpen}
        onClose={handleClose}
        guests={guestsData?.rows ?? []}
        rooms={roomsData?.rows ?? []}
        onCreate={handleCreate}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
