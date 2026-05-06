/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal, Paper, Box, Text,  Badge,
  Loader, Center, Stack, Table, Checkbox,
} from '@mantine/core';
import { IconClipboardList } from '@tabler/icons-react';
import MasterTable from '../../components/common/MasterTable';
import type { ColumnDef } from '../../components/common/MasterTable';
import ExpandableRow from '../../components/common/ExpandableRow';
import type { ChildColumnDef } from '../../components/common/ExpandableRow';
import FormHeader from '../common/Formheader';
import api from '../../services/api';

import type { MaterialReceiptSummary } from '../../types/receipt.type';
import { mapMaterialReceiptSummary, mapMaterialReceiptWithRMDetails } from '../../types/receipt.type';
import type { MaterialReceiptWithRMDetails } from '../../types/receipt.type';
import type { InwardReceiptFormData } from './Rawmaterialinwardreceipt';

import RawMaterialInwardReceipt from '../raw-material/Rawmaterialinwardreceipt';


// ── Props ─────────────────────────────────────────────────────────────────────

export interface MaterialReceiptListModalProps {
  opened: boolean;
  onClose: () => void;
  poRefNo: number | null;
  poNo?: string | null;
  materialType?: string;
  onSaveReceipt?: (data: InwardReceiptFormData) => void;
  poDate?: string | null;
}

// ── Parent columns ────────────────────────────────────────────────────────────

const COLUMNS: ColumnDef[] = [
  { key: 'receiptDetId', label: 'Receipt ID', width: 100 },
  { key: 'invoiceNo', label: 'Invoice No', width: 150 },
  { key: 'invoiceDate', label: 'Invoice Date', width: 120 },
  { key: 'materialType', label: 'Material Type', width: 130 },
  { key: 'noOfReceived', label: 'Qty Received', width: 110, align: 'right' },
  { key: 'netAmount', label: 'Net Amount', width: 110, align: 'right' },
  { key: 'sgstValue', label: 'SGST Amt', width: 100, align: 'right' },
  { key: 'cgstValue', label: 'CGST Amt', width: 100, align: 'right' },
  { key: 'igstValue', label: 'IGST Amt', width: 100, align: 'right' },
  { key: 'totalAmount', label: 'Total Amount', width: 120, align: 'right' },
];

// ── Child columns (RM details per receipt) ────────────────────────────────────

const CHILD_COLUMNS: ChildColumnDef[] = [
  { key: 'poRmCode',             label: 'RM Code',      width: 100 },
  { key: 'poRmName',             label: 'RM Name',      width: 180 },
  { key: 'poUom',                label: 'UOM',          width: 80  },
  { key: 'rmReceivedQty',        label: 'Qty Received', width: 110, align: 'right',
    render: (v) => v != null ? Number(v).toFixed(3) : '—' },
  { key: 'receivedRate',         label: 'Rate',         width: 100, align: 'right',
    render: (v) => v != null ? Number(v).toFixed(2) : '—' },
  { key: 'sgst',                 label: 'SGST %',       width: 80,  align: 'right',
    render: (v) => v != null ? Number(v).toFixed(2) : '—' },
  { key: 'cgst',                 label: 'CGST %',       width: 80,  align: 'right',
    render: (v) => v != null ? Number(v).toFixed(2) : '—' },
  { key: 'igst',                 label: 'IGST %',       width: 80,  align: 'right',
    render: (v) => v != null ? Number(v).toFixed(2) : '—' },
  { key: 'lotNumber',            label: 'Lot No',       width: 130 },
  { key: 'expectedDeliveryDate', label: 'Exp Del',      width: 110 },
  { key: 'actualDeliveryDate',   label: 'Act Del',      width: 110 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const fmt = (v: number | null, d = 2) => v != null ? v.toFixed(d) : '—';

const dash = (v: any) =>
  v != null && v !== '' ? v : <Text c="dimmed" size="sm">—</Text>;

// ── Component ─────────────────────────────────────────────────────────────────

const MaterialReceiptListModal: React.FC<MaterialReceiptListModalProps> = ({
  opened,
  onClose,
  poRefNo,
  poNo,
  materialType,
  onSaveReceipt,
  poDate,
}) => {

  const [data, setData] = useState<MaterialReceiptSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [inwardOpen, setInwardOpen] = useState(false);
  // Add this state near the other useState declarations
  const [editReceiptDetId, setEditReceiptDetId] = useState<number | null>(null);

  // ── Fetch parent receipts ─────────────────────────────────────────────────

  const fetchData = useCallback(async (currentPage: number, keyword: string) => {
    if (!poRefNo) return;
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {
        page: currentPage - 1,
        size: PAGE_SIZE,
      };
      if (materialType) params.materialType = materialType;
      if (keyword.trim()) params.keyword = keyword.trim();

      const url = keyword.trim()
        ? '/api/inventory/material-receipt/search'
        : `/api/inventory/material-receipt/summary/porefno/${poRefNo}`;

      const res = await api.get(url, { params });
      const d = res.data.data;

      if (Array.isArray(d)) {
        setData(d.map(mapMaterialReceiptSummary));
        setTotalPages(1);
        setTotalElements(d.length);
      } else if (d?.content) {
        setData(d.content.map(mapMaterialReceiptSummary));
        setTotalPages(d.totalPages ?? 1);
        setTotalElements(d.totalElements ?? 0);
      } else {
        setData([]);
      }
    } catch {
      setError('Failed to load receipts for this PO.');
    } finally {
      setLoading(false);
    }
  }, [poRefNo, materialType]);

  // ── Fetch child RM details for a receipt ─────────────────────────────────

  const fetchRmDetails = useCallback(
    async (receiptDetId: number | string): Promise<MaterialReceiptWithRMDetails[]> => {
      const res = await api.get(
        `/api/inventory/material-receipt/rmlist/${receiptDetId}`
      );
      const d = res.data;
      const arr = Array.isArray(d)
        ? d
        : Array.isArray(d?.data)
          ? d.data
          : [];
      return arr.map(mapMaterialReceiptWithRMDetails);
    },
    []
  );

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!opened) {
      setData([]);
      setSelected([]);
      setPage(1);
      setSearchInput('');
      setError(null);
      return;
    }
    fetchData(1, '');
  }, [opened, fetchData]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchData(1, searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Selection ─────────────────────────────────────────────────────────────

  const allIds = data.map(r => r.receiptDetId);
  const allSelected = allIds.length > 0 && allIds.every(id => selected.includes(id));
  const someSelected = allIds.some(id => selected.includes(id)) && !allSelected;

  const toggleAll = () =>
    allSelected
      ? setSelected(prev => prev.filter(id => !allIds.includes(id)))
      : setSelected(prev => [...new Set([...prev, ...allIds])]);

  const toggleRow = (id: number) =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );

  // ── Build expandable rows ─────────────────────────────────────────────────

  // colSpan = expand(1) + checkbox(1) + columns
  const expandColSpan = 1 + 1 + COLUMNS.length;

  const rows = data.map(item => {
    const isSel = selected.includes(item.receiptDetId);
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
          <Checkbox
            checked={isSel}
            onChange={() => toggleRow(item.receiptDetId)}
            size="sm"
          />
        }
        parentCells={
          <>
            <Table.Td fw={500} c="blue">{item.receiptDetId}</Table.Td>
            <Table.Td>{dash(item.invoiceNo)}</Table.Td>
            <Table.Td>{dash(item.invoiceDate)}</Table.Td>
            <Table.Td>
              {item.materialType
                ? <Badge variant="light" color="indigo" size="sm">{item.materialType}</Badge>
                : <Text c="dimmed" size="sm">—</Text>}
            </Table.Td>
            <Table.Td ta="right">{fmt(item.noOfReceived, 3)}</Table.Td>
            <Table.Td ta="right">{fmt(item.netAmount)}</Table.Td>
            <Table.Td ta="right">{fmt(item.sgstValue)}</Table.Td>
            <Table.Td ta="right">{fmt(item.cgstValue)}</Table.Td>
            <Table.Td ta="right">{fmt(item.igstValue)}</Table.Td>
            <Table.Td ta="right" fw={600} c="blue">{fmt(item.totalAmount)}</Table.Td>
          </>
        }
      />
    );
  });

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={null}
      size="90%"
      padding={0}
      radius="md"
      withCloseButton={false}
      zIndex={200}
      styles={{
        body: {
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          overflow: 'hidden',
        },
      }}
    >
      <Paper withBorder radius="md"
        style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

        <FormHeader
          title={`Material Receipts${poNo ? ` — PO: ${poNo}` : ''}`}
          icon={<IconClipboardList size={18} color="white" />}
          color="#2c6e49"
          badge={totalElements > 0
            ? `${totalElements} receipt${totalElements !== 1 ? 's' : ''}`
            : undefined}
          onClose={onClose}
        />

        <Box style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }} p="lg">

          {error && <Text size="xs" c="red" mb="sm">{error}</Text>}

          {loading && !data.length ? (
            <Center py={80}>
              <Stack align="center" gap="sm">
                <Loader size="md" />
                <Text size="sm" c="dimmed">Loading receipts...</Text>
              </Stack>
            </Center>
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
              onPageChange={(val) => { setPage(val); fetchData(val, searchInput); setSelected([]); }}
              searchValue={searchInput}
              onSearchChange={setSearchInput}
              searchPlaceholder="Search by invoice no..."
              allSelected={allSelected}
              someSelected={someSelected}
              onToggleSelectAll={toggleAll}
              selectedCount={selected.length}

              onAdd={() => setInwardOpen(true)}
              // Replace the onEdit={undefined} in MasterTable with:
              onEdit={selected.length === 1
                ? () => {
                  setEditReceiptDetId(selected[0]);
                  setInwardOpen(true);
                }
                : undefined
              }
              onDelete={undefined}
              onRefresh={() => fetchData(page, searchInput)}
              onExport={() => console.log('Export receipts', selected)}
            />
          )}

        </Box>
      
        <RawMaterialInwardReceipt
          opened={inwardOpen}
          onClose={() => {
            setInwardOpen(false);
            setEditReceiptDetId(null);   // ← clear edit target on close
          }}
          onSave={(data: InwardReceiptFormData) => {
            if (onSaveReceipt) onSaveReceipt(data);
            setInwardOpen(false);
            setEditReceiptDetId(null);
            fetchData(page, searchInput);
          }}
          poRefNo={poRefNo}
          poNo={poNo}
          poDate={poDate}
          receiptDetId={editReceiptDetId}   // ← null = Add, number = Edit
        />

      </Paper>
    </Modal>
  );
};

export default MaterialReceiptListModal;