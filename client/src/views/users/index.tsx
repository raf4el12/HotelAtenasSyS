'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UsersTable } from './components/UsersTable';
import { UsersFilters } from './components/UsersFilters';
import { UserDrawer } from './components/UserDrawer';
import { useUsers } from './hooks/use-users';
import type { User, CreateUserPayload, UpdateUserPayload } from './types';

export default function UsersView() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('ALL');
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();

  const { data, isLoading, createMutation, updateMutation, deleteMutation } = useUsers({
    searchValue: search,
    currentPage: page,
    pageSize: 10,
    ...(role !== 'ALL' ? { role } : {}),
  });

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setEditingUser(undefined);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setEditingUser(undefined);
  };

  const handleCreate_ = (payload: CreateUserPayload) => {
    createMutation.mutate(payload, { onSuccess: handleClose });
  };

  const handleUpdate = (id: string, payload: UpdateUserPayload) => {
    updateMutation.mutate({ id, data: payload }, { onSuccess: handleClose });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo usuario
        </Button>
      </div>

      <UsersFilters
        search={search}
        role={role}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        onRoleChange={(v) => { setRole(v); setPage(1); }}
      />

      <UsersTable
        users={data?.rows ?? []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />

      <UserDrawer
        open={drawerOpen}
        onClose={handleClose}
        user={editingUser}
        onCreate={handleCreate_}
        onUpdate={handleUpdate}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
