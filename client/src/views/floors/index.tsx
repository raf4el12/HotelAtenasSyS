'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloorsTable } from './components/FloorsTable';
import { FloorsFilters } from './components/FloorsFilters';
import { FloorDrawer } from './components/FloorDrawer';
import { useFloors } from './hooks/use-floors';
import type { Floor, CreateFloorPayload } from './types';

export default function FloorsView() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState<Floor | undefined>();

  const { data, isLoading, createMutation, updateMutation, deleteMutation } = useFloors({
    searchValue: search,
    currentPage: page,
    pageSize: 10,
  });

  const handleEdit = (floor: Floor) => {
    setEditingFloor(floor);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setEditingFloor(undefined);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setEditingFloor(undefined);
  };

  const handleCreate_ = (payload: CreateFloorPayload) => {
    createMutation.mutate(payload, { onSuccess: handleClose });
  };

  const handleUpdate = (id: string, payload: Partial<CreateFloorPayload>) => {
    updateMutation.mutate({ id, data: payload }, { onSuccess: handleClose });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pisos</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo piso
        </Button>
      </div>

      <FloorsFilters
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
      />

      <FloorsTable
        floors={data?.rows ?? []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(id) => deleteMutation.mutate(id)}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />

      <FloorDrawer
        open={drawerOpen}
        onClose={handleClose}
        floor={editingFloor}
        onCreate={handleCreate_}
        onUpdate={handleUpdate}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
