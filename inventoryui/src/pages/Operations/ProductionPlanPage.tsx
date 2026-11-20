/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import {
  Title, Text, Box, Alert, Loader, Paper,  Table, Checkbox, Button, Tooltip,
} from '@mantine/core';
import { IconAlertCircle, IconPackageImport } from '@tabler/icons-react';
import ProductionEntryForm from './ProductionEntryForm';
import type { ProductionEntryFormData } from './ProductionEntryForm';
import api from '../../services/api';
import MasterTable from '../../components/common/MasterTable';
import type { ProductionPlanApiData } from '../../types/production.types';
import { mapProductionPlan } from '../../types/production.types';
import ProductionPlanForm from './ProductionPlanForm';
import type { ProductionPlanFormData } from '../../types/production.types';
import type { SaveStatus } from '../common/Savestatusbanner';
import SaveStatusBanner from '../common/Savestatusbanner';
import { mapFormToPayload } from '../../types/production.types';
import { COLUMNS } from '../../types/production.types';
// ── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;


// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (val: string | null | undefined): string => {
  if (!val) return '—';
  try {
    return new Date(val).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return val; }
};

const dash = (v: string | number | null | undefined) =>
  v != null && v !== '' ? String(v) : '—';

// ── Page ──────────────────────────────────────────────────────────────────────

const ProductionPlanPage: React.FC = () => {

  const [data, setData]                   = useState<ProductionPlanApiData[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [searchInput, setSearchInput]     = useState('');
  const [keyword, setKeyword]             = useState('');
  const [selected, setSelected]           = useState<number[]>([]);
  const [page, setPage]                   = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [formOpen, setFormOpen]           = useState(false);
  const [editPlanId, setEditPlanId]       = useState<number | null>(null);
  const [formMode, setFormMode]           = useState<'create' | 'update'>('create');
  const [saveStatus, setSaveStatus]       = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage]     = useState('');
  const [entryOpen, setEntryOpen]         = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async (
    currentPage: number,
    currentKeyword: string,
  ) => {
    try {
      setLoading(true);
      setError(null);
      setSelected([]);

      const params: Record<string, any> = {
        page: currentPage - 1,
        size: PAGE_SIZE,
        ...(currentKeyword.trim() ? { keyword: currentKeyword.trim() } : {}),
      };

      const res = await api.get('/api/inventory/production-plan/summary', { params });
      const d   = res.data.data;

      if (Array.isArray(d)) {
        setData(d.map(mapProductionPlan));
        setTotalPages(1);
        setTotalElements(d.length);
      } else if (d?.content) {
        setData(d.content.map(mapProductionPlan));
        setTotalPages(d.totalPages    ?? 1);
        setTotalElements(d.totalElements ?? 0);
      } else {
        setData([]);
      }
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.message ||
        'Failed to fetch production plans.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page, keyword);
  }, [page, keyword, fetchData]);

  useEffect(() => {
    const timer = setTimeout(() => { setKeyword(searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── Selection ─────────────────────────────────────────────────────────────

  const allIds       = data.map(d => d.productionPlanId);
  const allSelected  = allIds.length > 0 && allIds.every(id => selected.includes(id));
  const someSelected = allIds.some(id => selected.includes(id)) && !allSelected;

  const toggleAll = () =>
    allSelected
      ? setSelected(prev => prev.filter(id => !allIds.includes(id)))
      : setSelected(prev => [...new Set([...prev, ...allIds])]);

  const toggleRow = (id: number) =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );

  // ── Save ──────────────────────────────────────────────────────────────────────

  const handleSave = async (formData: ProductionPlanFormData) => {
    setSaveStatus('saving');
    try {
      const payload = mapFormToPayload(formData);
      if (formMode === 'update' && formData.productionPlanId) {
        await api.put(`/api/inventory/production-plan/${formData.productionPlanId}`, payload);
      } else {
        await api.post('/api/inventory/production-plan', payload);
      }
      setSaveStatus('success');
      setSaveMessage(formMode === 'update' ? 'Production Plan updated!' : 'Production Plan created!');
      setFormOpen(false);
      setEditPlanId(null);
      setFormMode('create');
      fetchData(page, keyword);
    } catch (err: any) {
      setSaveStatus('error');
      setSaveMessage(err?.response?.data?.message || 'Failed to save Production Plan.');
    }
  };

  // ── Finished goods entry ──────────────────────────────────────────────────

  const entryPlan = selected.length === 1
    ? data.find(d => d.productionPlanId === selected[0]) ?? null
    : null;

  const handleEntrySave = async (entry: ProductionEntryFormData) => {
    setSaveStatus('saving');
    try {
      const res = await api.post('/api/inventory/production-plan/production-output', entry);
      // Endpoint returns the saved SosProductionOutput directly (no ApiResponse wrapper)
      const saved = res.data?.data ?? res.data;
      setEntryOpen(false);
      setSaveStatus('success');
      setSaveMessage(saved?.fgLotNo
        ? `Finished goods saved — FG Lot No: ${saved.fgLotNo}`
        : 'Finished goods saved.');
      fetchData(page, keyword);
    } catch (err: any) {
      setSaveStatus('error');
      setSaveMessage(err?.response?.data?.message || 'Failed to save finished goods entry.');
    }
  };

  // ── Build rows ────────────────────────────────────────────────────────────

 const rows = data.map(item => {
  const isSel = selected.includes(item.productionPlanId);
  return (
    <Table.Tr
      key={item.productionPlanId}
      bg={isSel ? 'var(--mantine-color-blue-0)' : undefined}
    >
      <Table.Td>
        <Checkbox checked={isSel} onChange={() => toggleRow(item.productionPlanId)} size="sm" />
      </Table.Td>

      <Table.Td>
        <Text size="xs" fw={500} c="blue">{item.productionPlanId}</Text>
      </Table.Td>

      <Table.Td>
        <Text size="xs" fw={500}>{dash(item.woCode)}</Text>
      </Table.Td>

      <Table.Td>
        <Text size="xs">{dash(item.vesselName)}</Text>
      </Table.Td>

      <Table.Td>
        <Text size="xs">{dash(item.productName)}</Text>
      </Table.Td>

      <Table.Td>
        <Text size="xs">{fmtDate(item.fromDate)}</Text>
      </Table.Td>

      <Table.Td>
        <Text size="xs">{fmtDate(item.toDate)}</Text>
      </Table.Td>

      <Table.Td ta="right">
        <Text size="xs" fw={500}>
          {item.qty != null ? Number(item.qty).toFixed(2) : '—'}
        </Text>
        {/* Produced so far — green once the plan qty is reached */}
        {item.producedQuantity != null && (
          <Text size="10px"
            c={item.producedQuantity <= 0 ? 'dimmed'
              : item.qty != null && item.producedQuantity >= item.qty ? 'green' : 'orange'}>
            Produced: {item.producedQuantity.toFixed(2)}
          </Text>
        )}
      </Table.Td>

      <Table.Td ta="right">
        <Text size="xs">
          {item.woQty != null ? Number(item.woQty).toFixed(2) : '—'}
        </Text>
      </Table.Td>

      <Table.Td ta="right">
        <Text size="xs" fw={500} c="teal">
          {item.perUnitRate != null ? Number(item.perUnitRate).toFixed(2) : '—'}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text size="xs">{dash(item.plant)}</Text>
      </Table.Td>

      <Table.Td>
        <Text size="xs">{dash(item.poId)}</Text>
      </Table.Td>

    </Table.Tr>
  );
});
  const colSpan = COLUMNS.length + 1;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box p="md" style={{ width: '100%', overflowX: 'auto' }}>

      <Box mb="md">
        <Title order={3}>Production Plan</Title>
        <Text c="dimmed" size="sm">View and manage production plans</Text>
      </Box>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
          {error}
        </Alert>
      )}

      {loading && !data.length ? (
        <Paper withBorder p="xl" ta="center">
          <Loader size="md" />
          <Text c="dimmed" size="sm" mt="sm">Loading production plans...</Text>
        </Paper>
      ) : (
        <MasterTable
          columns={COLUMNS}
          rows={rows}
          colSpan={colSpan}
          totalElements={totalElements}
          loading={loading}
          page={page}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          onPageChange={(val) => { setPage(val); setSelected([]); }}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          searchPlaceholder="Search by WO code, company..."
          allSelected={allSelected}
          someSelected={someSelected}
          onToggleSelectAll={toggleAll}
          selectedCount={selected.length}
          onAdd={() => {
            setEditPlanId(null);
            setFormMode('create');
            setFormOpen(true);
          }}
          onEdit={() => {
            if (selected.length === 1) {
              setEditPlanId(selected[0]);
              setFormMode('update');
              setFormOpen(true);
            }
          }}
          onDelete={undefined}
          onRefresh={() => fetchData(page, keyword)}
          onExport={() => console.log('Export', selected)}
          extraActions={
            <Tooltip label={entryPlan ? 'Enter finished goods produced for this plan' : 'Select one production plan'}>
              <Button size="xs" variant="light" color="teal"
                leftSection={<IconPackageImport size={14} />}
                disabled={!entryPlan}
                onClick={() => setEntryOpen(true)}>
                Finished Goods
              </Button>
            </Tooltip>
          }
        />
      )}

      <ProductionEntryForm
        opened={entryOpen}
        onClose={() => setEntryOpen(false)}
        onSave={handleEntrySave}
        productionPlanId={entryPlan?.productionPlanId ?? null}
        woCode={entryPlan?.woCode ?? null}
      />

      <ProductionPlanForm
        opened={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditPlanId(null);
          setFormMode('create');
        }}
        onSave={handleSave}
        productionPlanId={editPlanId}
        mode={formMode}
      />

      <SaveStatusBanner
        status={saveStatus}
        successMessage={saveMessage}
        errorMessage={saveMessage}
        onDismiss={() => setSaveStatus('idle')}
      />

    </Box>
  );
};

export default ProductionPlanPage;