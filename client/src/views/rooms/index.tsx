'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { floorsService } from '@/services/floors.service';
import { RoomsTable } from './components/RoomsTable';
import { RoomsFilters } from './components/RoomsFilters';
import { RoomDrawer } from './components/RoomDrawer';
import { useRooms } from './hooks/use-rooms';
import type { Room, CreateRoomPayload } from './types';

export default function RoomsView() {
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
    pageSize: 10,
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Habitaciones</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva habitacion
        </Button>
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

      <RoomsTable
        rooms={data?.rows ?? []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(id) => deleteMutation.mutate(id)}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />

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
