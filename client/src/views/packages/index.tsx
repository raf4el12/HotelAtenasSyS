'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PackagesTable } from './components/PackagesTable';
import { PackagesFilters } from './components/PackagesFilters';
import { PackageDrawer } from './components/PackageDrawer';
import { usePackages } from './hooks/use-packages';
import type { Package, CreatePackagePayload } from './types';

export default function PackagesView() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [stayMode, setStayMode] = useState('ALL');
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<Package | undefined>();

  const { data, isLoading, createMutation, updateMutation, deleteMutation } = usePackages({
    searchValue: search,
    currentPage: page,
    pageSize: 10,
    ...(category !== 'ALL' ? { category } : {}),
    ...(stayMode !== 'ALL' ? { stayMode } : {}),
  });

  const handleEdit = (pkg: Package) => {
    setEditingPkg(pkg);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setEditingPkg(undefined);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setEditingPkg(undefined);
  };

  const handleCreate_ = (payload: CreatePackagePayload) => {
    createMutation.mutate(payload, { onSuccess: handleClose });
  };

  const handleUpdate = (id: string, payload: Partial<CreatePackagePayload>) => {
    updateMutation.mutate({ id, data: payload }, { onSuccess: handleClose });
  };

  const resetPage = () => setPage(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Paquetes</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo paquete
        </Button>
      </div>

      <PackagesFilters
        search={search}
        category={category}
        stayMode={stayMode}
        onSearchChange={(v) => { setSearch(v); resetPage(); }}
        onCategoryChange={(v) => { setCategory(v); resetPage(); }}
        onStayModeChange={(v) => { setStayMode(v); resetPage(); }}
      />

      <PackagesTable
        packages={data?.rows ?? []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(id) => deleteMutation.mutate(id)}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />

      <PackageDrawer
        open={drawerOpen}
        onClose={handleClose}
        pkg={editingPkg}
        onCreate={handleCreate_}
        onUpdate={handleUpdate}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
