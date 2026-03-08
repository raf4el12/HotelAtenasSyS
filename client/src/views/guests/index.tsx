'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GuestsTable } from './components/GuestsTable';
import { GuestsFilters } from './components/GuestsFilters';
import { GuestDrawer } from './components/GuestDrawer';
import { useGuests } from './hooks/use-guests';
import type { Guest, CreateGuestPayload } from './types';

export default function GuestsView() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | undefined>();

  const { data, isLoading, createMutation, updateMutation } = useGuests({
    searchValue: search,
    currentPage: page,
    pageSize: 10,
  });

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setEditingGuest(undefined);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setEditingGuest(undefined);
  };

  const handleCreate_ = (payload: CreateGuestPayload) => {
    createMutation.mutate(payload, { onSuccess: handleClose });
  };

  const handleUpdate = (id: string, payload: Partial<CreateGuestPayload>) => {
    updateMutation.mutate({ id, data: payload }, { onSuccess: handleClose });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Huespedes</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo huesped
        </Button>
      </div>

      <GuestsFilters
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
      />

      <GuestsTable
        guests={data?.rows ?? []}
        isLoading={isLoading}
        onEdit={handleEdit}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />

      <GuestDrawer
        open={drawerOpen}
        onClose={handleClose}
        guest={editingGuest}
        onCreate={handleCreate_}
        onUpdate={handleUpdate}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
