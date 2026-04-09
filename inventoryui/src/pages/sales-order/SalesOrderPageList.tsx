/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import {
  Title, Text, Box, Alert, Loader, Paper, Badge,
  Group, Button, Tooltip,
} from '@mantine/core';
import { Table, Checkbox } from '@mantine/core';
import {
  IconAlertCircle, IconFileInvoice,
} from '@tabler/icons-react';
import api from '../../services/api';
import MasterTable from '../../components/common/MasterTable';
import type { ColumnDef } from '../../components/common/MasterTable';
import type { PagedApiResponse } from '../../types/api.types';
import SalesOrderForm from './Salesorderform';

import type { SalesOrderFormData, SalesOrderApiData } from '../../types/sales.types';
import { mapSalesOrderFormToPayload } from '../../types/sales.types';
import type { SaveStatus } from '../common/Savestatusbanner';
import SaveStatusBanner from '../common/Savestatusbanner';


import type { ChildColumnDef } from '../../components/common/ExpandableRow';
import ExpandableRow from '../../components/common/ExpandableRow';
import { mapWorkOrder } from '../../types/sales.types';
import type { WorkOrderApiData } from '../../types/sales.types';


import { fetchWorkOrdersByPo } from '../../types/workorder.types';

  // ── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

// ── Columns ───────────────────────────────────────────────────────────────────

const COLUMNS: ColumnDef[] = [
  { key: 'poId',           label: 'PO Id',           width: 90  },
  { key: 'poNumber',       label: 'Sales Order No',  width: 160 },
  { key: 'companyName',    label: 'Company',         width: 180 },
  { key: 'ordDate',        label: 'Order Date',      width: 120 },
  { key: 'ordDeliveryDate',label: 'Delivery Date',   width: 120 },
  { key: 'partialPoFlag',  label: 'Partial PO',      width: 100 },
  { key: 'createdBy',      label: 'Created By',      width: 120 },
  { key: 'createdAt',      label: 'Created At',      width: 130 },
];

const CHILD_COLUMNS: ChildColumnDef[] = [
  { key: 'woId',        label: 'WO Id',        width: 80  },
  { key: 'plant',       label: 'Plant',        width: 80 },
  { key: 'productCode', label: 'Product Code', width: 80 },
  { key: 'productName', label: 'Product Name', width: 200 },
  { key: 'pmName',      label: 'Packing Material',           width: 150 },
  { key: 'qty',         label: 'Qty',          width: 100, align: 'right',
    render: (v) => v != null ? Number(v).toFixed(2) : '—' },
  { key: 'perUnitRate', label: 'Rate',         width: 100, align: 'right',
    render: (v) => v != null ? Number(v).toFixed(2) : '—' },
  { key: 'totalAmount', label: 'Total Amount', width: 120, align: 'right',
    render: (v) => v != null ? Number(v).toFixed(2) : '—' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (val: string | null) => {
  if (!val) return '—';
  try {
    return new Date(val).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return val; }
};

const dash = (v: string | null | undefined) =>
  v && v.trim() && v !== '-'
    ? v
    : <Text c="dimmed" size="sm">—</Text>;

// ── Page ──────────────────────────────────────────────────────────────────────

const SalesOrderPage: React.FC = () => {

  const [data, setData]                   = useState<SalesOrderApiData[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [searchInput, setSearchInput]     = useState('');
  const [keyword, setKeyword]             = useState('');
  const [selected, setSelected]           = useState<number[]>([]);
  const [page, setPage]                   = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [formOpen, setFormOpen]           = useState(false);
  const [editPoId, setEditPoId]           = useState<number | null>(null);
  const [formMode, setFormMode]           = useState<'create' | 'update'>('create');

  const [saveStatus, setSaveStatus]       = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage]     = useState('');

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async (
    currentPage: number,
    currentKeyword: string,
  ) => {
    try {
      setLoading(true);
      setError(null);
      setSelected([]);

      const baseParams = { page: currentPage - 1, size: PAGE_SIZE };
      let url    = '/api/inventory/sales-orders';
      let params: Record<string, any> = { ...baseParams };

      if (currentKeyword.trim()) {
        url    = '/api/inventory/sales-orders/search';
        params = { ...baseParams, keyword: currentKeyword.trim() };
      }

      const response = await api.get<PagedApiResponse<SalesOrderApiData>>(url, { params });
      const pageData = response.data.data;
      setData(pageData.content);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.message ||
        'Failed to fetch sales orders.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

 

const fetchWorkOrders = useCallback(
  (poId: number | string) => fetchWorkOrdersByPo(api, poId),
  []
);

  useEffect(() => {
    fetchData(page, keyword);
  }, [page, keyword, fetchData]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => { setKeyword(searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── Selection ─────────────────────────────────────────────────────────────

  const allIds       = data.map(d => d.poId);
  const allSelected  = allIds.length > 0 && allIds.every(id => selected.includes(id));
  const someSelected = allIds.some(id => selected.includes(id)) && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) setSelected(prev => prev.filter(id => !allIds.includes(id)));
    else             setSelected(prev => [...new Set([...prev, ...allIds])]);
  };
  const expandColSpan = 1 + 1 + COLUMNS.length; 
  const toggleRow = (id: number) =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );

  // ── Save ──────────────────────────────────────────────────────────────────

  const handleSave = async (formData: SalesOrderFormData) => {
    setSaveStatus('saving');
    try {
      const payload = mapSalesOrderFormToPayload(formData);
      if (formMode === 'update' && formData.poId) {
        await api.put(`/api/commercial/sales-orders/${formData.poId}`, payload);
      } else {
        await api.post('/api/commercial/sales-orders', payload);
      }
      setSaveStatus('success');
      setSaveMessage(
        formMode === 'update'
          ? 'Sales Order updated successfully!'
          : 'Sales Order created successfully!'
      );
      setFormOpen(false);
      setEditPoId(null);
      setFormMode('create');
      fetchData(page, keyword);
    } catch (err: any) {
      setSaveStatus('error');
      setSaveMessage(
        err?.response?.data?.message || 'Failed to save Sales Order.'
      );
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (selected.length === 0) return;
    setSaveStatus('saving');
    try {
      await Promise.all(
        selected.map(id => api.delete(`/api/commercial/sales-orders/${id}`))
      );
      setSaveStatus('success');
      setSaveMessage(`${selected.length} record(s) deleted successfully.`);
      setSelected([]);
      fetchData(page, keyword);
    } catch (err: any) {
      setSaveStatus('error');
      setSaveMessage(err?.response?.data?.message || 'Failed to delete.');
    }
  };

  // ── Build rows ────────────────────────────────────────────────────────────

  const rows = data.map(item => {
  const isSel = selected.includes(item.poId);
  return (
    <ExpandableRow
      key={item.poId}
      rowId={item.poId}
      isSelected={isSel}
      colSpan={expandColSpan}
      childTitle={`Work Orders — Sales Order: ${item.poNumber ?? item.poId}`}
      childColumns={CHILD_COLUMNS}
      fetchChildren={fetchWorkOrders}
      checkboxCell={
        <Checkbox
          checked={isSel}
          onChange={() => toggleRow(item.poId)}
          size="sm"
        />
      }
      parentCells={
        <>
          <Table.Td fw={500} c="blue" style={{ cursor: 'pointer' }}
            onClick={() => {
              setEditPoId(item.poId);
              setFormMode('update');
              setFormOpen(true);
            }}>
            {item.poId}
          </Table.Td>
          <Table.Td>{dash(item.poNumber)}</Table.Td>
          <Table.Td>{dash(item.companyName)}</Table.Td>
          <Table.Td>{fmtDate(item.ordDate)}</Table.Td>
          <Table.Td>{fmtDate(item.ordDeliveryDate)}</Table.Td>
          <Table.Td>
            {item.partialPoFlag != null ? (
              <Badge variant="light"
                color={item.partialPoFlag ? 'orange' : 'green'}
                size="sm">
                {item.partialPoFlag ? 'Yes' : 'No'}
              </Badge>
            ) : (
              <Text c="dimmed" size="sm">—</Text>
            )}
          </Table.Td>
          <Table.Td>{dash(item.createdBy)}</Table.Td>
          <Table.Td>{fmtDate(item.createdAt ?? null)}</Table.Td>
        </>
      }
    />
  );
});

 



  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box p="md" style={{ width: '100%', overflowX: 'auto' }}>

      <Box mb="md">
        <Title order={3}>Sales Orders</Title>
        <Text c="dimmed" size="sm">View and manage sales orders</Text>
      </Box>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
          {error}
        </Alert>
      )}

      {loading && !data.length ? (
        <Paper withBorder p="xl" ta="center">
          <Loader size="md" />
          <Text c="dimmed" size="sm" mt="sm">Loading sales orders...</Text>
        </Paper>
      ) : (
        <MasterTable
          columns={COLUMNS}
           expandable 
          rows={rows}
          colSpan={expandColSpan}
          totalElements={totalElements}
          loading={loading}
          page={page}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          onPageChange={(val) => { setPage(val); setSelected([]); }}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          searchPlaceholder="Search by order no, company..."
          allSelected={allSelected}
          someSelected={someSelected}
          onToggleSelectAll={toggleSelectAll}
          selectedCount={selected.length}
          onAdd={() => {
            setEditPoId(null);
            setFormMode('create');
            setFormOpen(true);
          }}
          onEdit={() => {
            if (selected.length === 1) {
              setEditPoId(selected[0]);
              setFormMode('update');
              setFormOpen(true);
            }
          }}
          onDelete={handleDelete}
          onRefresh={() => fetchData(page, keyword)}
          onExport={() => console.log('Export', selected)}
        />
      )}

      {/* ── Sales Order Form Modal ── */}
      <SalesOrderForm
        opened={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditPoId(null);
          setFormMode('create');
        }}
        onSave={handleSave}
        poId={editPoId}
        mode={formMode}
      />

      {/* ── Save Status Banner ── */}
      <SaveStatusBanner
        status={saveStatus}
        successMessage={saveMessage}
        errorMessage={saveMessage}
        onDismiss={() => setSaveStatus('idle')}
      />

    </Box>
  );
};

export default SalesOrderPage;