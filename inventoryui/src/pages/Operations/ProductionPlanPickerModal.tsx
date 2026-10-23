import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button, Table, Radio,
} from '@mantine/core';
import { IconCalendarStats } from '@tabler/icons-react';
import api from '../../services/api';
import MasterTable from '../../components/common/MasterTable';
import type { ColumnDef } from '../../components/common/MasterTable';
import FormHeader from '../common/Formheader';
import type { ProductionPlanApiData } from '../../types/production.types';
import { mapProductionPlan } from '../../types/production.types';

// ── Compact picker for production plans ──────────────────────────────────────
// Same data as the Production Plan page (/production-plan/summary), fewer columns
// (no WO Id, Per Unit Rate, PO Id, Vessel). Click a row to pick it; double-click
// or "Select" to confirm.

const PAGE_SIZE = 8;

const PICKER_COLUMNS: ColumnDef[] = [
  { key: 'productionPlanId', label: 'Plan ID',   width: 80  },
  { key: 'woCode',           label: 'WO Code',   width: 150 },
  { key: 'productName',      label: 'Product',   width: 200 },
  { key: 'fromDate',         label: 'From Date', width: 110 },
  { key: 'toDate',           label: 'To Date',   width: 110 },
  { key: 'qty',              label: 'Qty',       width: 90, align: 'right' },
  { key: 'woQty',            label: 'WO Qty',    width: 90, align: 'right' },
  { key: 'plant',            label: 'Plant',     width: 100 },
];

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

export interface ProductionPlanPickerModalProps {
  opened: boolean;
  onClose: () => void;
  onSelect: (plan: ProductionPlanApiData) => void;
  selectedPlanId?: number | null;   // pre-highlights the current plan
}

const ProductionPlanPickerModal: React.FC<ProductionPlanPickerModalProps> = ({
  opened,
  onClose,
  onSelect,
  selectedPlanId = null,
}) => {

  const [data, setData]                   = useState<ProductionPlanApiData[]>([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [searchInput, setSearchInput]     = useState('');
  const [keyword, setKeyword]             = useState('');
  const [page, setPage]                   = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [picked, setPicked]               = useState<ProductionPlanApiData | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async (currentPage: number, currentKeyword: string) => {
    setLoading(true);
    setError(null);
    try {
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
        setTotalPages(d.totalPages ?? 1);
        setTotalElements(d.totalElements ?? 0);
      } else {
        setData([]);
        setTotalPages(1);
        setTotalElements(0);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch production plans.');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset when opened
  useEffect(() => {
    if (!opened) return;
    setSearchInput('');
    setKeyword('');
    setPage(1);
    setPicked(null);
  }, [opened]);

  useEffect(() => {
    if (opened) fetchData(page, keyword);
  }, [opened, page, keyword, fetchData]);

  // Search debounce
  useEffect(() => {
    if (!opened) return;
    const timer = setTimeout(() => { setKeyword(searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, opened]);

  // ── Selection ─────────────────────────────────────────────────────────────

  const pickedId = picked?.productionPlanId ?? selectedPlanId;

  const confirm = (plan: ProductionPlanApiData | null) => {
    if (!plan) return;
    onSelect(plan);
    onClose();
  };

  // ── Rows ──────────────────────────────────────────────────────────────────

  const rows = data.map(item => {
    const isSel = pickedId === item.productionPlanId;
    return (
      <Table.Tr
        key={item.productionPlanId}
        bg={isSel ? 'var(--mantine-color-blue-0)' : undefined}
        style={{ cursor: 'pointer' }}
        onClick={() => setPicked(item)}
        onDoubleClick={() => confirm(item)}
      >
        <Table.Td>
          <Radio
            size="xs"
            checked={isSel}
            onChange={() => setPicked(item)}
            onClick={e => e.stopPropagation()}
            aria-label={`Select plan ${item.productionPlanId}`}
          />
        </Table.Td>
        <Table.Td><Text size="xs" fw={500} c="blue">{item.productionPlanId}</Text></Table.Td>
        <Table.Td><Text size="xs" fw={500}>{dash(item.woCode)}</Text></Table.Td>
        <Table.Td><Text size="xs">{dash(item.productName)}</Text></Table.Td>
        <Table.Td><Text size="xs">{fmtDate(item.fromDate)}</Text></Table.Td>
        <Table.Td><Text size="xs">{fmtDate(item.toDate)}</Text></Table.Td>
        <Table.Td ta="right">
          <Text size="xs" fw={500}>{item.qty != null ? Number(item.qty).toFixed(2) : '—'}</Text>
        </Table.Td>
        <Table.Td ta="right">
          <Text size="xs">{item.woQty != null ? Number(item.woQty).toFixed(2) : '—'}</Text>
        </Table.Td>
        <Table.Td><Text size="xs">{dash(item.plant)}</Text></Table.Td>
      </Table.Tr>
    );
  });

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={null}
      size="75%"
      padding={0}
      radius="md"
      withCloseButton={false}
      zIndex={300}   // above the Material Request form (200)
      styles={{
        body: {
          padding: 0, display: 'flex', flexDirection: 'column',
          maxHeight: '90vh', overflow: 'hidden',
        },
      }}
    >
      <Paper withBorder radius="md"
        style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

        <FormHeader
          title="Select Production Plan"
          icon={<IconCalendarStats size={18} color="white" />}
          color="#4a6fa5"
          onClose={onClose}
        />

        <Box style={{ flex: 1, overflowY: 'auto' }} p="md">
          {error && <Text size="xs" c="red" mb="sm">{error}</Text>}

          <MasterTable
            columns={PICKER_COLUMNS}
            rows={rows}
            colSpan={PICKER_COLUMNS.length + 1}
            totalElements={totalElements}
            loading={loading}
            page={page}
            totalPages={totalPages}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            searchValue={searchInput}
            onSearchChange={setSearchInput}
            searchPlaceholder="Search by WO code, product..."
            allSelected={false}
            someSelected={false}
            onToggleSelectAll={() => { }}
            selectedCount={picked ? 1 : 0}
            onRefresh={() => fetchData(page, keyword)}
            showCrudActions={false}
          />

          {!loading && data.length === 0 && (
            <Text size="sm" c="dimmed" ta="center" py="md">No production plans found.</Text>
          )}
        </Box>

        <Box px="lg" py="sm"
          style={{
            borderTop: '1px solid var(--mantine-color-gray-3)',
            backgroundColor: 'var(--mantine-color-body)',
            flexShrink: 0,
          }}>
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              {picked
                ? `Selected: Plan #${picked.productionPlanId}${picked.woCode ? ` — ${picked.woCode}` : ''}`
                : 'Click a row to select (double-click to pick directly)'}
            </Text>
            <Group gap="sm">
              <Button variant="default" size="sm" onClick={onClose}>Cancel</Button>
              <Button size="sm" disabled={!picked} onClick={() => confirm(picked)}>
                Select
              </Button>
            </Group>
          </Group>
        </Box>

      </Paper>
    </Modal>
  );
};

export default ProductionPlanPickerModal;
