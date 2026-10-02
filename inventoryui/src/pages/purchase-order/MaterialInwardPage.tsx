import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Title, Text, Box, Alert, Loader, Paper, Badge, Table, Checkbox,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import dayjs from 'dayjs';
import api from '../../services/api';
import MasterTable from '../../components/common/MasterTable';
import type { ColumnDef } from '../../components/common/MasterTable';
import ExpandableRow from '../../components/common/ExpandableRow';
import type { ChildColumnDef } from '../../components/common/ExpandableRow';
import SaveStatusBanner from '../common/Savestatusbanner';
import type { SaveStatus } from '../common/Savestatusbanner';

import RawMaterialInwardReceipt from '../raw-material/Rawmaterialinwardreceipt';
import type { InwardReceiptFormData } from '../raw-material/Rawmaterialinwardreceipt';
import { saveInwardReceipt } from '../raw-material/saveInwardReceipt';
import type { MaterialReceiptSummary, MaterialReceiptWithRMDetails } from '../../types/receipt.type';
import { mapMaterialReceiptSummary, mapMaterialReceiptWithRMDetails } from '../../types/receipt.type';

// ── Types ─────────────────────────────────────────────────────────────────────

interface PoLookup {
  poRefNo: number;
  poNo: string;
  poDate: string | null;
  poType: string | null;
  supplierName: string | null;
  poLegacyRefNo: string | null;
}

// ── Columns ───────────────────────────────────────────────────────────────────

const COLUMNS: ColumnDef[] = [
  { key: 'receiptDetId', label: 'Receipt ID',    width: 90 },
  { key: 'poNo',         label: 'PO No / Inward Type', width: 240 },
  { key: 'supplierName', label: 'Supplier',      width: 180 },
  { key: 'invoiceNo',    label: 'Invoice No',    width: 140 },
  { key: 'invoiceDate',  label: 'Invoice Date',  width: 110 },
  { key: 'materialType', label: 'Material Type', width: 130 },
  { key: 'noOfReceived', label: 'Qty Received',  width: 110, align: 'right' },
  { key: 'netAmount',    label: 'Net Amount',    width: 110, align: 'right' },
  { key: 'sgstValue',    label: 'SGST Amt',      width: 100, align: 'right' },
  { key: 'cgstValue',    label: 'CGST Amt',      width: 100, align: 'right' },
  { key: 'igstValue',    label: 'IGST Amt',      width: 100, align: 'right' },
  { key: 'totalAmount',  label: 'Total Amount',  width: 120, align: 'right' },
];

// A line carries either IGST or SGST + CGST — show whichever applies
const gstLabel = (row: MaterialReceiptWithRMDetails) => {
  if (row.igst) return `IGST ${row.igst.toFixed(2)}`;
  if (row.sgst || row.cgst)
    return `SGST ${(row.sgst ?? 0).toFixed(2)} + CGST ${(row.cgst ?? 0).toFixed(2)}`;
  return '—';
};

const CHILD_COLUMNS: ChildColumnDef[] = [
  { key: 'poRmCode',             label: 'RM Code',      width: 100 },
  { key: 'poRmName',             label: 'RM Name',      width: 180 },
  { key: 'poUom',                label: 'UOM',          width: 80  },
  { key: 'rmReceivedQty',        label: 'Qty Received', width: 110, align: 'right',
    render: (v) => v != null ? Number(v).toFixed(3) : '—' },
  { key: 'receivedRate',         label: 'Rate',         width: 100, align: 'right',
    render: (v) => v != null ? Number(v).toFixed(2) : '—' },
  { key: 'gst',                  label: 'GST %',        width: 170,
    render: (_v, row) => gstLabel(row) },
  { key: 'lotNumber',            label: 'Lot No',       width: 130 },
  { key: 'expectedDeliveryDate', label: 'Exp Del',      width: 110 },
  { key: 'actualDeliveryDate',   label: 'Act Del',      width: 110 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const fmt = (v: number | null, d = 2) => v != null ? v.toFixed(d) : '—';

// Only the applicable tax (IGST or SGST + CGST) carries a value
const fmtTax = (v: number | null) => v ? v.toFixed(2) : '—';

const dash = (v: any) =>
  v != null && v !== '' ? v : <Text c="dimmed" size="sm">—</Text>;

const poLabel = (po: PoLookup | undefined, poRefNo: number) =>
  po ? (po.poLegacyRefNo?.trim() || po.poNo) : poRefNo ? `Ref #${poRefNo}` : '';

const inwardTypeLabel = (inwardType: string | null | undefined) =>
  inwardType === 'JOBINWARD' ? 'JOB INWARD' : 'BY PO';

// e.g. "RM/0001/2026-2027-BY PO", or just "JOB INWARD" when there is no PO
const poInwardLabel = (po: PoLookup | undefined, poRefNo: number, inwardType: string | null | undefined) =>
  [poLabel(po, poRefNo), inwardTypeLabel(inwardType)].filter(Boolean).join('-');

const fmtDate = (v: string | null | undefined) => {
  if (!v) return null;
  const d = dayjs(v);
  return d.isValid() ? d.format('DD-MM-YYYY') : v;
};

// ── Page ──────────────────────────────────────────────────────────────────────

const MaterialInwardPage: React.FC = () => {
  const [allData, setAllData]       = useState<MaterialReceiptSummary[]>([]);
  const [poMap, setPoMap]           = useState<Map<number, PoLookup>>(new Map());
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [selected, setSelected]     = useState<number[]>([]);
  const [page, setPage]             = useState(1);

  const [saveStatus, setSaveStatus]   = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  // New entry from this page = job work inward (no PO)
  const [jobInwardOpen, setJobInwardOpen] = useState(false);

  // Edit: open the receipt form for the selected receipt in its own inward type
  const [editReceipt, setEditReceipt] = useState<MaterialReceiptSummary | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchPos = useCallback(async () => {
    try {
      const res = await api.get('/api/inventory/purchase-order', {
        params: { page: 0, size: 1000, sortBy: 'poRefNo', sortDir: 'desc' },
      });
      const d = res.data?.data;
      const content: any[] = Array.isArray(d) ? d : (d?.content ?? []);
      setPoMap(new Map(content.map((p: any) => [Number(p.poRefNo), {
        poRefNo:       Number(p.poRefNo),
        poNo:          p.poNo ?? '',
        poDate:        p.poDate ?? null,
        poType:        p.poType ?? null,
        supplierName:  p.supplierName ?? null,
        poLegacyRefNo: p.poLegacyRefNo ?? null,
      }])));
    } catch {
      // PO lookup is only used for labels — the list still works without it
    }
  }, []);

  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/inventory/material-receipt/summary');
      const d = res.data?.data;
      const arr: any[] = Array.isArray(d) ? d : (d?.content ?? []);
      // Newest first
      setAllData(arr.map(mapMaterialReceiptSummary)
        .sort((a, b) => b.receiptDetId - a.receiptDetId));
    } catch {
      setError('Failed to load material inward entries.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAll = useCallback(() => {
    fetchReceipts();
    fetchPos();
  }, [fetchReceipts, fetchPos]);

  useEffect(() => { refreshAll(); }, [refreshAll]);

  const fetchRmDetails = useCallback(
    async (receiptDetId: number | string): Promise<MaterialReceiptWithRMDetails[]> => {
      const res = await api.get(`/api/inventory/material-receipt/rmlist/${receiptDetId}`);
      const d = res.data;
      const arr = Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
      return arr.map(mapMaterialReceiptWithRMDetails);
    },
    []
  );

  // ── Client-side search + paging (summary endpoint returns the full list) ──

  const filtered = useMemo(() => {
    const kw = searchInput.trim().toLowerCase();
    if (!kw) return allData;
    return allData.filter(r => {
      const po = poMap.get(r.poRefNo);
      return [
        String(r.receiptDetId),
        r.inwardType,
        r.invoiceNo,
        r.materialType,
        po?.poNo,
        po?.poLegacyRefNo,
        r.supplierName ?? po?.supplierName,
      ].some(v => v?.toLowerCase().includes(kw));
    });
  }, [allData, poMap, searchInput]);

  useEffect(() => { setPage(1); }, [searchInput]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Selection ─────────────────────────────────────────────────────────────

  const pageIds = pageData.map(r => r.receiptDetId);
  const allSelected = pageIds.length > 0 && pageIds.every(id => selected.includes(id));
  const someSelected = pageIds.some(id => selected.includes(id)) && !allSelected;

  const toggleAll = () =>
    allSelected
      ? setSelected(prev => prev.filter(id => !pageIds.includes(id)))
      : setSelected(prev => [...new Set([...prev, ...pageIds])]);

  const toggleRow = (id: number) =>
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  // ── Save (shared with Purchase Orders) ────────────────────────────────────

  const handleSave = async (data: InwardReceiptFormData) => {
    setSaveStatus('saving');
    try {
      await saveInwardReceipt(data);
      setSaveStatus('success');
      setSaveMessage('Inward Receipt saved successfully!');
      fetchReceipts();
    } catch (err: any) {
      setSaveStatus('error');
      setSaveMessage(err?.message || 'Failed to save Inward Receipt.');
    }
  };

  // ── Rows ──────────────────────────────────────────────────────────────────

  const expandColSpan = 1 + 1 + COLUMNS.length;   // expand + checkbox + columns

  const rows = pageData.map(item => {
    const isSel = selected.includes(item.receiptDetId);
    const po = poMap.get(item.poRefNo);
    return (
      <ExpandableRow
        key={item.receiptDetId}
        rowId={item.receiptDetId}
        isSelected={isSel}
        colSpan={expandColSpan}
        childTitle={`RM Details — Receipt # ${item.receiptDetId} | ${item.invoiceNo}`}
        childColumns={CHILD_COLUMNS}
        fetchChildren={fetchRmDetails}
        checkboxCell={
          <Checkbox checked={isSel} onChange={() => toggleRow(item.receiptDetId)} size="sm" />
        }
        parentCells={
          <>
            <Table.Td fw={500} c="blue">{item.receiptDetId}</Table.Td>
            <Table.Td>{poInwardLabel(po, item.poRefNo, item.inwardType)}</Table.Td>
            <Table.Td>{dash(item.supplierName ?? po?.supplierName)}</Table.Td>
            <Table.Td>{dash(item.invoiceNo)}</Table.Td>
            <Table.Td>{dash(fmtDate(item.invoiceDate))}</Table.Td>
            <Table.Td>
              {item.materialType
                ? <Badge variant="light" color="indigo" size="sm">{item.materialType}</Badge>
                : <Text c="dimmed" size="sm">—</Text>}
            </Table.Td>
            <Table.Td ta="right">{fmt(item.noOfReceived, 3)}</Table.Td>
            <Table.Td ta="right">{fmt(item.netAmount)}</Table.Td>
            <Table.Td ta="right">{fmtTax(item.sgstValue)}</Table.Td>
            <Table.Td ta="right">{fmtTax(item.cgstValue)}</Table.Td>
            <Table.Td ta="right">{fmtTax(item.igstValue)}</Table.Td>
            <Table.Td ta="right" fw={600} c="blue">{fmt(item.totalAmount)}</Table.Td>
          </>
        }
      />
    );
  });

  const editPo = editReceipt ? poMap.get(editReceipt.poRefNo) : undefined;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box p="md" style={{ width: '100%', overflowX: 'auto' }}>
      <Box mb="md">
        <Title order={3}>Material Inward</Title>
        <Text c="dimmed" size="sm">
          All inward entries — against purchase orders and job work. Use Add for a job work inward.
        </Text>
      </Box>

      {error && <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">{error}</Alert>}

      {loading && !allData.length ? (
        <Paper withBorder p="xl" ta="center">
          <Loader size="md" />
          <Text c="dimmed" size="sm" mt="sm">Loading inward entries...</Text>
        </Paper>
      ) : (
        <MasterTable
          columns={COLUMNS}
          rows={rows}
          colSpan={expandColSpan}
          expandable
          totalElements={filtered.length}
          loading={loading}
          page={page}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          onPageChange={(val) => { setPage(val); setSelected([]); }}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          searchPlaceholder="Search by receipt, PO no, invoice, supplier..."
          allSelected={allSelected}
          someSelected={someSelected}
          onToggleSelectAll={toggleAll}
          selectedCount={selected.length}
          onAdd={() => setJobInwardOpen(true)}
          onEdit={selected.length === 1
            ? () => {
              const r = allData.find(x => x.receiptDetId === selected[0]);
              if (r) setEditReceipt(r);
            }
            : undefined}
          onDelete={undefined}
          onRefresh={refreshAll}
          onExport={() => console.log('Export inward entries', selected)}
        />
      )}

      {/* ── New job work inward (no PO) ── */}
      <RawMaterialInwardReceipt
        opened={jobInwardOpen}
        onClose={() => setJobInwardOpen(false)}
        onSave={handleSave}
        inwardType="JOBINWARD"
        receiptDetId={null}
      />

      {/* ── Edit an existing receipt — BYPO or JOBINWARD as recorded ── */}
      <RawMaterialInwardReceipt
        opened={editReceipt != null}
        onClose={() => setEditReceipt(null)}
        onSave={handleSave}
        inwardType={editReceipt?.inwardType ?? 'BYPO'}
        poRefNo={editReceipt?.inwardType === 'JOBINWARD' ? null : (editReceipt?.poRefNo ?? null)}
        poNo={editPo?.poNo ?? null}
        poDate={editPo?.poDate ?? null}
        receiptDetId={editReceipt?.receiptDetId ?? null}
      />

      <SaveStatusBanner
        status={saveStatus}
        successMessage={saveMessage || 'Saved!'}
        errorMessage={saveMessage || 'Failed to save.'}
        onDismiss={() => setSaveStatus('idle')}
      />
    </Box>
  );
};

export default MaterialInwardPage;
