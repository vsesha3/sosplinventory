/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import {
  Title, Text, Box, Alert, Loader, Paper, Badge, Table, Checkbox,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import api from '../../services/api';
import MasterTable from '../../components/common/MasterTable';
import type { ColumnDef } from '../../components/common/MasterTable';
import MaterialRequestForm from './MaterialRequestForm';
import type { MaterialRequestFormData } from '../../types/MaterialRequest.types';
import type { RmRequestApiData } from '../../types/MaterialRequest.types';
import { mapRmRequest } from '../../types/MaterialRequest.types';


// ── Types ─────────────────────────────────────────────────────────────────────


// ── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 15;

// ── Columns — matches legacy screen ──────────────────────────────────────────

const COLUMNS: ColumnDef[] = [
  { key: 'rmReqDate',     label: 'Request Date',           width: 120 },
  { key: 'scheduleDate',  label: 'Schedule Date',          width: 120 },
  { key: 'productName',   label: 'Product Name',           width: 220 },
  { key: 'woCode',        label: 'WO Code',                width: 150 },
  { key: 'planToProdQty', label: 'Plan To Product Quantity', width: 170, align: 'right' },
  { key: 'requestBy',     label: 'Request By',             width: 120 },
  { key: 'ginNo',         label: 'GIN No',                 width: 90, align: 'right' },
];

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

// ── Component ─────────────────────────────────────────────────────────────────

const MaterialRequestView: React.FC = () => {

  const [data, setData]                   = useState<RmRequestApiData[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [searchInput, setSearchInput]     = useState('');
  const [keyword, setKeyword]             = useState('');
  const [selected, setSelected]           = useState<number[]>([]);
  const [page, setPage]                   = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // ── Form (modal) state ────────────────────────────────────────────────────
  const [formOpen, setFormOpen]   = useState(false);
  const [formMode, setFormMode]   = useState<'create' | 'update'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);

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

      const res = await api.get('/api/inventory/rm-request/view', { params });
      const d   = res.data.data;

      if (Array.isArray(d)) {
        setData(d.map(mapRmRequest));
        setTotalPages(1);
        setTotalElements(d.length);
      } else if (d?.content) {
        setData(d.content.map(mapRmRequest));
        setTotalPages(d.totalPages    ?? 1);
        setTotalElements(d.totalElements ?? 0);
      } else {
        setData([]);
      }
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.message ||
        'Failed to fetch material requests.'
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

  const allIds       = data.map(d => d.rmReqId);
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

  // ── Form handlers ─────────────────────────────────────────────────────────

  const handleAdd = () => {
    setFormMode('create');
    setEditingId(null);
    setFormOpen(true);
  };

  const handleEdit = () => {
    if (selected.length !== 1) {
      notifications.show({
        color:   'yellow',
        title:   'Select a row',
        message: 'Please select exactly one row to edit',
      });
      return;
    }
    setFormMode('update');
    setEditingId(selected[0]);   // form will fetch full record from backend
    setFormOpen(true);
  };

  const handleSave = async (formData: MaterialRequestFormData) => {
   
    try {
      const payload = {
        rmReqId:             formData.rmReqId,
        rmReqDate:           formData.rmReqDate ?? new Date().toISOString(),
        scheduleDate:        formData.scheduleDate ?? null,
        woId:                formData.woId ? Number(formData.woId) : null,
        planToProdQty:       formData.planToProdQty ? Number(formData.planToProdQty) : null,
        productionLotNumber: formData.productionLotNumber || null,
        ginNo:               formData.ginNo || null,
        requestBy:           formData.requestBy,
        productionPlanId:    formData.productionPlanId,
        isRmIssueCompleted:  formData.isRmIssueCompleted,
        lines:                formData.rmLines?.map(line => ({
          woId:          line.woId,
          rmId:          line.rmId,
          rmCode:        line.rmCode,
          rmName:        line.rmName,
          mixPercentage: line.mixPercentage,
          planQty:       line.planQty,
          requiredQty:   line.requiredQty,
        })),

      };

      if (formMode === 'update' && formData.rmReqId) {
        await api.put(`/api/inventory/rm-request/${formData.rmReqId}`, payload);
        notifications.show({
          color:   'green',
          title:   'Updated',
          message: 'Material Request updated successfully',
        });
      } else {
        
        await api.post('/api/inventory/rm-request/save', payload);
        notifications.show({
          color:   'green',
          title:   'Created',
          message: 'Material Request created successfully',
        });
      }

      setFormOpen(false);
      setSelected([]);
      await fetchData(page, keyword);
    } catch (err: unknown) {
      
      notifications.show({
        color: 'red',
        title: 'Save failed',
        message:
          (err as any)?.response?.data?.message ||
          'Failed to save Material Request',
      });
    }
  };

  // ── Build rows ────────────────────────────────────────────────────────────

  const rows = data.map(item => {
    const isSel = selected.includes(item.rmReqId);
    return (
      <Table.Tr
        key={item.rmReqId}
        bg={isSel ? 'var(--mantine-color-blue-0)' : undefined}
      >
        {/* Checkbox */}
        <Table.Td>
          <Checkbox
            checked={isSel}
            onChange={() => toggleRow(item.rmReqId)}
            size="sm"
          />
        </Table.Td>

        {/* Request Date */}
        <Table.Td>
          <Text size="xs">{fmtDate(item.rmReqDate)}</Text>
        </Table.Td>

        {/* Schedule Date */}
        <Table.Td>
          <Text size="xs">{fmtDate(item.scheduleDate)}</Text>
        </Table.Td>

        {/* Product Name */}
        <Table.Td>
          <Text size="xs" fw={500}>{dash(item.productName)}</Text>
        </Table.Td>

        {/* WO Code */}
        <Table.Td>
          <Text size="xs">{dash(item.woCode)}</Text>
        </Table.Td>

        {/* Plan To Product Quantity */}
        <Table.Td ta="right">
          <Text size="xs" fw={500}>
            {item.planToProdQty != null
              ? `${Number(item.planToProdQty).toLocaleString('en-IN')} Kgs`
              : '—'}
          </Text>
        </Table.Td>

        {/* Request By */}
        <Table.Td>
          <Text size="xs">{dash(item.requestBy)}</Text>
        </Table.Td>

        {/* GIN No */}
        <Table.Td ta="right">
          {item.ginNo != null ? (
            <Badge variant="light" color="teal" size="sm">
              {item.ginNo}
            </Badge>
          ) : (
            <Text size="xs" c="dimmed">—</Text>
          )}
        </Table.Td>

      </Table.Tr>
    );
  });

  const colSpan = COLUMNS.length + 1;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box p="md" style={{ width: '100%', overflowX: 'auto' }}>

      <Box mb="md">
        <Title order={3}>Material Requests</Title>
        <Text c="dimmed" size="sm">View raw material requests</Text>
      </Box>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
          {error}
        </Alert>
      )}

      {loading && !data.length ? (
        <Paper withBorder p="xl" ta="center">
          <Loader size="md" />
          <Text c="dimmed" size="sm" mt="sm">Loading material requests...</Text>
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
          searchPlaceholder="Search by WO code, product..."
          allSelected={allSelected}
          someSelected={someSelected}
          onToggleSelectAll={toggleAll}
          selectedCount={selected.length}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={undefined}
          onRefresh={() => fetchData(page, keyword)}
          onExport={() => console.log('Export', selected)}
        />
      )}

      {/* ── Material Request Form (Add / Edit) ─────────────────────────── */}
      <MaterialRequestForm
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        mode={formMode}
        rmReqId={editingId}
        onSave={handleSave}
      />

    </Box>
  );
};

export default MaterialRequestView;