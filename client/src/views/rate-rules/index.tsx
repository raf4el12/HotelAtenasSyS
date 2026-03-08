'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RateRulesTable } from './components/RateRulesTable';
import { RateRulesFilters } from './components/RateRulesFilters';
import { RateRuleDrawer } from './components/RateRuleDrawer';
import { useRateRules } from './hooks/use-rate-rules';
import type { RateRule, CreateRateRulePayload } from './types';

export default function RateRulesView() {
  const [search, setSearch] = useState('');
  const [stayMode, setStayMode] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RateRule | undefined>();

  const { data, isLoading, createMutation, updateMutation, deleteMutation } = useRateRules({
    searchValue: search,
    currentPage: page,
    pageSize: 10,
    ...(stayMode !== 'ALL' ? { stayMode } : {}),
    ...(category !== 'ALL' ? { category } : {}),
  });

  const handleEdit = (rule: RateRule) => {
    setEditingRule(rule);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setEditingRule(undefined);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setEditingRule(undefined);
  };

  const handleCreate_ = (payload: CreateRateRulePayload) => {
    createMutation.mutate(payload, { onSuccess: handleClose });
  };

  const handleUpdate = (id: string, payload: Partial<CreateRateRulePayload>) => {
    updateMutation.mutate({ id, data: payload }, { onSuccess: handleClose });
  };

  const resetPage = () => setPage(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tarifas</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva tarifa
        </Button>
      </div>

      <RateRulesFilters
        search={search}
        stayMode={stayMode}
        category={category}
        onSearchChange={(v) => { setSearch(v); resetPage(); }}
        onStayModeChange={(v) => { setStayMode(v); resetPage(); }}
        onCategoryChange={(v) => { setCategory(v); resetPage(); }}
      />

      <RateRulesTable
        rateRules={data?.rows ?? []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(id) => deleteMutation.mutate(id)}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />

      <RateRuleDrawer
        open={drawerOpen}
        onClose={handleClose}
        rateRule={editingRule}
        onCreate={handleCreate_}
        onUpdate={handleUpdate}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
