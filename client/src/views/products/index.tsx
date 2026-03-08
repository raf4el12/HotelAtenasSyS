'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductsTable } from './components/ProductsTable';
import { ProductsFilters } from './components/ProductsFilters';
import { ProductDrawer } from './components/ProductDrawer';
import { useProducts } from './hooks/use-products';
import type { Product, CreateProductPayload } from './types';

export default function ProductsView() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const { data, isLoading, createMutation, updateMutation } = useProducts({
    searchValue: search,
    currentPage: page,
    pageSize: 10,
    ...(category !== 'ALL' ? { category } : {}),
    ...(status !== 'ALL' ? { status } : {}),
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(undefined);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setEditingProduct(undefined);
  };

  const handleCreate_ = (payload: CreateProductPayload) => {
    createMutation.mutate(payload, { onSuccess: handleClose });
  };

  const handleUpdate = (id: string, payload: Partial<CreateProductPayload>) => {
    updateMutation.mutate({ id, data: payload }, { onSuccess: handleClose });
  };

  const resetPage = () => setPage(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo producto
        </Button>
      </div>

      <ProductsFilters
        search={search}
        category={category}
        status={status}
        onSearchChange={(v) => { setSearch(v); resetPage(); }}
        onCategoryChange={(v) => { setCategory(v); resetPage(); }}
        onStatusChange={(v) => { setStatus(v); resetPage(); }}
      />

      <ProductsTable
        products={data?.rows ?? []}
        isLoading={isLoading}
        onEdit={handleEdit}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />

      <ProductDrawer
        open={drawerOpen}
        onClose={handleClose}
        product={editingProduct}
        onCreate={handleCreate_}
        onUpdate={handleUpdate}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
