'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { guestsService } from '@/services/guests.service';
import { roomsService } from '@/services/rooms.service';
import { ReservationsTable } from './components/ReservationsTable';
import { ReservationFilters } from './components/ReservationFilters';
import { ReservationDrawer } from './components/ReservationDrawer';
import { useReservations } from './hooks/use-reservations';
import type { Reservation, CreateReservationPayload } from './types';

export default function ReservationsView() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [stayMode, setStayMode] = useState('ALL');
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | undefined>();

  const { data: guestsData } = useQuery({
    queryKey: ['guests', { pageSize: 100 }],
    queryFn: () => guestsService.findAll({ pageSize: 100 }),
  });

  const { data: roomsData } = useQuery({
    queryKey: ['rooms', { pageSize: 100 }],
    queryFn: () => roomsService.findAll({ pageSize: 100 }),
  });

  const {
    data,
    isLoading,
    createMutation,
    confirmMutation,
    checkInMutation,
    cancelMutation,
    noShowMutation,
  } = useReservations({
    searchValue: search,
    currentPage: page,
    pageSize: 10,
    ...(status !== 'ALL' ? { status } : {}),
    ...(stayMode !== 'ALL' ? { stayMode } : {}),
  });

  const handleView = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedReservation(undefined);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedReservation(undefined);
  };

  const handleSubmit = (payload: CreateReservationPayload) => {
    createMutation.mutate(payload, { onSuccess: handleClose });
  };

  const resetPage = () => setPage(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reservas</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva reserva
        </Button>
      </div>

      <ReservationFilters
        search={search}
        status={status}
        stayMode={stayMode}
        onSearchChange={(v) => { setSearch(v); resetPage(); }}
        onStatusChange={(v) => { setStatus(v); resetPage(); }}
        onStayModeChange={(v) => { setStayMode(v); resetPage(); }}
      />

      <ReservationsTable
        reservations={data?.rows ?? []}
        isLoading={isLoading}
        onEdit={handleView}
        onConfirm={(id) => confirmMutation.mutate(id)}
        onCheckIn={(id) => checkInMutation.mutate(id)}
        onCancel={(id) => cancelMutation.mutate(id)}
        onNoShow={(id) => noShowMutation.mutate(id)}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />

      <ReservationDrawer
        open={drawerOpen}
        onClose={handleClose}
        reservation={selectedReservation}
        guests={guestsData?.rows ?? []}
        rooms={roomsData?.rows ?? []}
        onCreate={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
