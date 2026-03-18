/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import {
  Title, Text, Box, Alert, Loader, Paper, Badge,
  Group, Button, Tooltip,
} from '@mantine/core';
import { Table, Checkbox } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconAlertCircle, IconPrinter, IconMail, IconFilter, IconX,
} from '@tabler/icons-react';
import api from '../../services/api';
import MasterTable from '../../components/common/MasterTable';
import ExpandableRow from '../../components/common/ExpandableRow';
import type { ColumnDef } from '../../components/common/MasterTable';
import type { ChildColumnDef } from '../../components/common/ExpandableRow';
import type { PagedApiResponse, PoLineItem } from '../../types/api.types';
import PurchaseOrderForm from './PurchaseOrderForm';
import type { PurchaseOrderFormData } from '../../types/api.types';
import  {numVal} from '../../types/api.types';


// ── Interfaces ────────────────────────────────────────────────────────────────

interface PurchaseOrder {
  poRefNo: number;
  poNo: string;
  poDate: string;
  supplierCode: string;
  supplierName: string;
  poDeliverySchedule: string | null;
  poPaymentTerms: string | null;
  poDeliveryTerms: string | null;
  poType: string | null;
  poClosedFlag: string | null;
  addCharges: number | null;
  createdBy: string | null;
  createdAt: string | null;
}

interface PoDetail {
  poDetId: number;
  poRefNo: number;
  poRmCode: string;
  poRmName: string;
  poQty: number | null;
  poRate: number | null;
  poUom: string | null;
  poNoOfPacks: number | null;
  poPackSize: number | null;
  sgst: number | null;
  sgstValue: number | null;
  cgst: number | null;
  cgstValue: number | null;
  igst: number | null;
  igstValue: number | null;
  hSnCode: string | null;
}

const PAGE_SIZE = 10;

// ── Parent columns ────────────────────────────────────────────────────────────
const COLUMNS: ColumnDef[] = [
  { key: 'poNo',               label: 'PO No',             width: 110 },
  { key: 'poDate',             label: 'PO Date',           width: 110 },
  { key: 'supplierCode',       label: 'Supplier Code',     width: 120 },
  { key: 'supplierName',       label: 'Supplier Name',     width: 160 },
  { key: 'poDeliverySchedule', label: 'Delivery Schedule', width: 140 },
  { key: 'poType',             label: 'Type',              width: 130  },
  { key: 'poPaymentTerms',     label: 'Payment Terms',     width: 90 },
  { key: 'poDeliveryTerms',    label: 'Delivery Terms',    width: 120 },
  { key: 'poClosedFlag',       label: 'Status',            width: 90  },
 
  { key: 'createdBy',          label: 'Created By',        width: 110 },
];

// ── Child columns (PO line items) ─────────────────────────────────────────────
const CHILD_COLUMNS: ChildColumnDef[] = [
  { key: 'poRmCode',    label: 'RM Code',     width: 100 },
  { key: 'poRmName',    label: 'RM Name',     width: 180 },
  { key: 'poUom',       label: 'UOM',         width: 70  },
  { key: 'poQty',       label: 'Qty',         width: 80,  align: 'right',
    render: (v) => v != null ? Number(v).toFixed(3) : '—' },
  { key: 'poRate',      label: 'Rate',        width: 90,  align: 'right',
    render: (v) => v != null ? Number(v).toFixed(2) : '—' },
  { key: 'poNoOfPacks', label: 'No of Packs', width: 90,  align: 'right',
    render: (v) => v != null ? Number(v).toFixed(0) : '—' },
  { key: 'poPackSize',  label: 'Pack Size',   width: 90,  align: 'right',
    render: (v) => v != null ? Number(v).toFixed(3) : '—' },
  { key: 'hSnCode',     label: 'HSN Code',    width: 100 },
  { key: 'sgst',        label: 'SGST %',      width: 80,  align: 'right',
    render: (v) => v != null ? Number(v).toFixed(2) : '—' },
  { key: 'cgst',        label: 'CGST %',      width: 80,  align: 'right',
    render: (v) => v != null ? Number(v).toFixed(2) : '—' },
  { key: 'igst',        label: 'IGST %',      width: 80,  align: 'right',
    render: (v) => v != null ? Number(v).toFixed(2) : '—' },
  { key: 'igstValue',   label: 'IGST Val',    width: 90,  align: 'right',
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

// ── Page ──────────────────────────────────────────────────────────────────────

const PurchaseOrderPage: React.FC = () => {
  const [data, setData]                   = useState<PurchaseOrder[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [searchInput, setSearchInput]     = useState('');
  const [keyword, setKeyword]             = useState('');
  const [selected, setSelected]           = useState<number[]>([]);
  const [page, setPage]                   = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  

  const [fromDate, setFromDate] = useState<string | null>(null);
const [toDate, setToDate]     = useState<string | null>(null);
  const [filterActive, setFilterActive]   = useState(false);
  const [poFormOpen, setPoformOpen] = useState(false);
  const [editPoRefNo, setEditPoRefNo]     = useState<number | null>(null);
  const [formMode, setFormMode]           = useState<'create' | 'update'>('create'); // 


  // ── Fetch parent POs ───────────────────────────────────────────────────────
  const fetchData = useCallback(async (
    currentPage: number,
    currentKeyword: string,
    from: string | null,
    to: string | null,
  ) => {
    try {
      setLoading(true);
      setError(null);
      setSelected([]);

      const baseParams = { page: currentPage - 1, size: PAGE_SIZE };
      let url = '/api/inventory/purchase-order';
      let params: Record<string, any> = { ...baseParams };

      if (currentKeyword.trim()) {
        url = '/api/inventory/purchase-order/search';
        params = { ...baseParams, keyword: currentKeyword.trim() };
      } else if (from && to) {
        url = '/api/inventory/purchase-order/date-range';
        params = {
          ...baseParams,
          fromDate: from,
          toDate:   to,
        };
      }

      const response = await api.get<PagedApiResponse<PurchaseOrder>>(url, { params });
      const pageData = response.data.data;
      setData(pageData.content);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
    } catch (err: unknown) {
      setError((err as any)?.response?.data?.message || 'Failed to fetch purchase orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page, keyword, fromDate, toDate);
  }, [page, keyword, fetchData,fromDate, toDate]);

  useEffect(() => {
    const timer = setTimeout(() => { setKeyword(searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── Fetch child PO details ─────────────────────────────────────────────────
  const fetchPoDetails = useCallback(async (poRefNo: number | string): Promise<PoDetail[]> => {
    const response = await api.get(`/api/inventory/po-details/${poRefNo}`);
    // Handle both direct array and wrapped response
    const d = response.data;
    if (Array.isArray(d)) return d;
    if (d?.data && Array.isArray(d.data)) return d.data;
    return [];
  }, []);

  // ── Selection ──────────────────────────────────────────────────────────────
  const allIds       = data.map((item) => item.poRefNo);
  const allSelected  = allIds.length > 0 && allIds.every((id) => selected.includes(id));
  const someSelected = allIds.some((id) => selected.includes(id)) && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) setSelected((prev) => prev.filter((id) => !allIds.includes(id)));
    else setSelected((prev) => [...new Set([...prev, ...allIds])]);
  };

  const toggleRow = (id: number) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const val = (v: string | null | undefined) =>
    v && v !== '-' ? v : <Text c="dimmed" size="sm">—</Text>;

const handlePoSave = async (data: PurchaseOrderFormData, lineItems: PoLineItem[]) => {
  try {
    const payload = {
      ...data,
      supplierId:         data.supplierId  ? Number(data.supplierId)  : null,
      requestedBy:        data.requestedBy ? Number(data.requestedBy) : null,
      poDate:             data.poDate             ? new Date(data.poDate as Date).toISOString() : null,
      poDeliverySchedule: data.poDeliverySchedule ? new Date(data.poDeliverySchedule as Date).toISOString() : null,
      poClosedFlag: 'N',
      lineItems: lineItems.map(item => ({
        poDetId:     item.poDetId > 1000000000000 ? null : item.poDetId,
        poRmCode:    item.poRmCode,
        poRmName:    item.poRmName,
        poUom:       item.poUom,
        poQty:       numVal(item.poQty),
        poRate:      numVal(item.poRate),
        poNoOfPacks: numVal(item.poNoOfPacks),
        poPackSize:  numVal(item.poPackSize),
        sgst:        numVal(item.sgst),
        cgst:        numVal(item.cgst),
        igst:        numVal(item.igst),
        hsnCode:     item.hsnCode,
      })),
    };

    if (formMode === 'update') {
      await api.put(`/api/inventory/purchase-order/${data.poRefNo}`, payload);
    } else {
      await api.post('/api/inventory/purchase-order', payload);
    }

    setPoformOpen(false);
    fetchData(page, keyword, fromDate, toDate);
  } catch (err) {
    console.error('Failed to save PO', err);
  }
};
  
  // ── Rows using ExpandableRow ───────────────────────────────────────────────
  // colSpan = expand(1) + checkbox(1) + columns(11) = 13
  const expandColSpan = 1 + 1 + COLUMNS.length;

  const rows = data.map((item) => {
    const isSelected = selected.includes(item.poRefNo);
    return (
      <ExpandableRow
        key={item.poRefNo}
        rowId={item.poRefNo}
        isSelected={isSelected}
        colSpan={expandColSpan}
        childTitle={`Line Items — ${item.poNo}`}
        childColumns={CHILD_COLUMNS}
        fetchChildren={fetchPoDetails}
        checkboxCell={
          <Checkbox checked={isSelected} onChange={() => toggleRow(item.poRefNo)} size="sm" />
        }
        parentCells={
          <>
            <Table.Td fw={500} c="blue" style={{ cursor: 'pointer' }}>
              {item.poNo}
            </Table.Td>
            <Table.Td>{fmtDate(item.poDate)}</Table.Td>
            <Table.Td>{item.supplierCode}</Table.Td>
            <Table.Td>{item.supplierName}</Table.Td>
            <Table.Td>{fmtDate(item.poDeliverySchedule)}</Table.Td>
            <Table.Td>
              {item.poType
                ? <Badge variant="light" color="indigo" size="sm">{item.poType}</Badge>
                : <Text c="dimmed" size="sm">—</Text>}
            </Table.Td>
            <Table.Td>{val(item.poPaymentTerms)}</Table.Td>
            <Table.Td>{val(item.poDeliveryTerms)}</Table.Td>
            <Table.Td>
              {item.poClosedFlag
                ? <Badge variant="light" color={item.poClosedFlag === 'Y' ? 'red' : 'green'} size="sm">
                    {item.poClosedFlag === 'Y' ? 'Closed' : 'Open'}
                  </Badge>
                : <Text c="dimmed" size="sm">—</Text>}
            </Table.Td>
          
            <Table.Td>{val(item.createdBy)}</Table.Td>
          </>
        }
      />
    );
  });

  // ── Extra toolbar ──────────────────────────────────────────────────────────
  const extraActions = (
    <Group gap="xs">
      <Tooltip label="Print selected PO(s)">
        <Button size="xs" variant="subtle" color="dark"
          leftSection={<IconPrinter size={14} />}
          disabled={selected.length === 0}
          onClick={() => console.log('Print', selected)}>
          Print
        </Button>
      </Tooltip>
      <Tooltip label="Email selected PO(s)">
        <Button size="xs" variant="subtle" color="cyan"
          leftSection={<IconMail size={14} />}
          disabled={selected.length === 0}
          onClick={() => console.log('Email', selected)}>
          Email
        </Button>
      </Tooltip>
    </Group>
  );

  return (
    <Box p="md" style={{ width: '100%', overflowX: 'auto' }}>
      <Box mb="md">
        <Title order={3}>Purchase Orders</Title>
        <Text c="dimmed" size="sm">View and manage purchase orders</Text>
      </Box>

      {/* ── Date Range Filter ── */}
      <Paper withBorder px="md" py="sm" mb="md">
        <Group gap="sm" wrap="wrap" align="flex-end">
          <Text size="sm" fw={500} c="dimmed">Filter by Date:</Text>
         <DatePickerInput
  label="From" placeholder="Pick date"
  value={fromDate}
  onChange={(val: string | null) => setFromDate(val)}
  size="xs" w={140} clearable
/>
<DatePickerInput
  label="To" placeholder="Pick date"
  value={toDate}
  onChange={(val: string | null) => setToDate(val)}
  size="xs" w={140} clearable
/>
         <Button size="xs" leftSection={<IconFilter size={14} />}
  disabled={!fromDate || !toDate}
  onClick={() => { setFilterActive(true); setPage(1); fetchData(1, '', fromDate, toDate); }}>
  Apply
</Button>
          {filterActive && (
            <Button size="xs" variant="subtle" color="red"
              leftSection={<IconX size={14} />}
              onClick={() => { setFromDate(null); setToDate(null); setFilterActive(false); setPage(1); fetchData(1, keyword, null, null); }}>
              Clear
            </Button>
          )}
          {filterActive && <Badge color="blue" variant="light" size="sm">Date filter active</Badge>}
        </Group>
      </Paper>

      {error && <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">{error}</Alert>}

      {loading && !data.length ? (
        <Paper withBorder p="xl" ta="center">
          <Loader size="md" />
          <Text c="dimmed" size="sm" mt="sm">Loading purchase orders...</Text>
        </Paper>
      ) : (
        <MasterTable
          columns={COLUMNS}
          rows={rows}
          colSpan={expandColSpan}
          expandable
          totalElements={totalElements}
          loading={loading}
          page={page}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          onPageChange={(val) => { setPage(val); setSelected([]); }}
          searchValue={searchInput}
          onSearchChange={(val) => setSearchInput(val)}
          searchPlaceholder="Search by PO no, supplier..."
          allSelected={allSelected}
          someSelected={someSelected}
          onToggleSelectAll={toggleSelectAll}
          selectedCount={selected.length}
          onAdd={() => setPoformOpen(true)}
          
          onEdit={() => {
  if (selected.length === 1) {
    setEditPoRefNo(selected[0]); // ← pass selected po id
    setFormMode('update');        // ← set mode
    setPoformOpen(true);
  }
}}
          onDelete={() => console.log('Delete', selected)}
          onRefresh={() => fetchData(page, keyword, fromDate, toDate)}
          onExport={() => console.log('Export')}
          extraActions={extraActions}
        />
      )}

      <PurchaseOrderForm
  opened={poFormOpen}
  onClose={() => setPoformOpen(false)}
  onSave={handlePoSave}
  onPrint={() => console.log('Print')}
  poTypeOptions={[
    { value: 'RAW_MATERIAL',     label: 'Raw Material', prefix: 'RM' },
    { value: 'PACKING_MATERIAL', label: 'Packing Material', prefix: 'PM' },
    { value: 'CAPITAL_GOODS',    label: 'Capital Goods', prefix: 'CG' },
    { value: 'MISCELLANEOUS',    label: 'Miscellaneous', prefix: 'MISC' },
  ]}
  supplierOptions={[]}
  mode={formMode}                // ← pass mode
  poRefNo={editPoRefNo} 
  
/>
    </Box>
  );
};

export default PurchaseOrderPage;
