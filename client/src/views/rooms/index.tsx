'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { floorsService } from '@/services/floors.service';
import { RoomsTable } from './components/RoomsTable';
import { RoomsCards } from './components/RoomsCards';
import { RoomsFilters } from './components/RoomsFilters';
import { RoomDrawer } from './components/RoomDrawer';
import { useRooms } from './hooks/use-rooms';
import type { Room, CreateRoomPayload } from './types';

type ViewMode = 'table' | 'cards';

export default function RoomsView() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [floorId, setFloorId] = useState('ALL');
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | undefined>();

  const { data: floorsData } = useQuery({
    queryKey: ['floors', { pageSize: 100 }],
    queryFn: () => floorsService.findAll({ pageSize: 100 }),
  });

  const { data, isLoading, createMutation, updateMutation, deleteMutation } = useRooms({
    searchValue: search,
    currentPage: page,
    pageSize: viewMode === 'cards' ? 12 : 10,
    ...(status !== 'ALL' ? { status } : {}),
    ...(category !== 'ALL' ? { category } : {}),
    ...(floorId !== 'ALL' ? { floorId } : {}),
  });

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setEditingRoom(undefined);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setEditingRoom(undefined);
  };

  const handleCreate_ = (payload: CreateRoomPayload) => {
    createMutation.mutate(payload, { onSuccess: handleClose });
  };

  const handleUpdate = (id: string, payload: Partial<CreateRoomPayload>) => {
    updateMutation.mutate({ id, data: payload }, { onSuccess: handleClose });
  };

  const resetPage = () => setPage(1);

  const sharedProps = {
    rooms: data?.rows ?? [],
    isLoading,
    onEdit: handleEdit,
    onDelete: (id: string) => deleteMutation.mutate(id),
    page,
    totalPages: data?.totalPages ?? 1,
    onPageChange: setPage,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Habitaciones</h1>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
            <button
              onClick={() => { setViewMode('table'); resetPage(); }}
              className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="Vista de tabla"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => { setViewMode('cards'); resetPage(); }}
              className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
                viewMode === 'cards'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="Vista de tarjetas"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva habitacion
          </Button>
        </div>
      </div>

      <RoomsFilters
        search={search}
        status={status}
        category={category}
        floorId={floorId}
        floors={floorsData?.rows ?? []}
        onSearchChange={(v) => { setSearch(v); resetPage(); }}
        onStatusChange={(v) => { setStatus(v); resetPage(); }}
        onCategoryChange={(v) => { setCategory(v); resetPage(); }}
        onFloorChange={(v) => { setFloorId(v); resetPage(); }}
      />

      {viewMode === 'table' ? (
        <RoomsTable {...sharedProps} />
      ) : (
        <RoomsCards {...sharedProps} />
      )}

      <RoomDrawer
        open={drawerOpen}
        onClose={handleClose}
        room={editingRoom}
        onCreate={handleCreate_}
        onUpdate={handleUpdate}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
