/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button,
  Grid, Badge, Stack, Loader, Center, Table, Divider,
} from '@mantine/core';
import { IconClipboardCheck } from '@tabler/icons-react';
import { FormTextInput } from '../../components/common/FormTextInput';
import { FormSelect } from '../../components/common/FormSelect';
import { FormDatePicker } from '../../components/common/FormDatePicker';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import MasterTable from '../../components/common/MasterTable';
import type { ColumnDef } from '../../components/common/MasterTable';
import type { DateValue } from '@mantine/dates';
import api from '../../services/api';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DropDownOption {
  value: string;
  label: string;
}

interface PoLineItemDetail {
  poDetId: number;
  poRefNo: number;
  poRmCode: string;
  poRmName: string;
  poQty: number | null;
  poRate: number | null;
  poUom: string | null;
  poNoOfPacks: number | null;
  poPackSize: number | null;
  hsnCode: string | null;
}

interface PoListItem {
  poRefNo: number;
  poNo: string;
  poDate: string;
}

interface PoListApiResponse {
  success: boolean;
  message: string;
  data: {
    content: PoListItem[];
    totalElements: number;
    totalPages: number;
  };
}

interface PoLineItemsApiResponse {
  success: boolean;
  message: string;
  data: PoLineItemDetail[];
}

// ── Inward Receipt Line Item ───────────────────────────────────────────────────

export interface InwardReceiptLine {
  poDetId: number;
  poRmCode: string;
  poRmName: string;
  poUom: string | null;
  rmOrderQty: number;
  rmReceivedQty: string;          // editable
  expectedDeliveryDate: DateValue;// editable
  actualDeliveryDate: DateValue;  // editable
  inspectedBy: string;            // editable
  approvedBy: string;             // editable
}

// ── Inward Receipt Form Data ───────────────────────────────────────────────────

export interface InwardReceiptFormData {
  invoiceNumber: string;
  poRefNo: string | null;
  poDate: string | null;
  lines: InwardReceiptLine[];
}

export interface RawMaterialInwardReceiptProps {
  opened: boolean;
  onClose: () => void;
  onSave?: (data: InwardReceiptFormData) => void;
  poRefNo?: number | null;   // pre-select a PO if opened from PO list
  poNo?: string | null;
}

// ── Columns ───────────────────────────────────────────────────────────────────

const LINE_COLUMNS: ColumnDef[] = [
  { key: 'poRmCode',             label: 'RM Code',              width: 110 },
  { key: 'poRmName',             label: 'RM Description',       width: 200 },
  { key: 'poUom',                label: 'UOM',                  width: 70  },
  { key: 'rmOrderQty',           label: 'RM Order Qty',         width: 110, align: 'right' },
  { key: 'rmReceivedQty',        label: 'RM Received Qty',      width: 130, align: 'right' },
  { key: 'expectedDeliveryDate', label: 'Expected Delivery',    width: 140 },
  { key: 'actualDeliveryDate',   label: 'Actual Delivery',      width: 140 },
  { key: 'inspectedBy',          label: 'Inspected By',         width: 130 },
  { key: 'approvedBy',           label: 'Approved By',          width: 130 },
];

const dash = (v: any) => (v != null && v !== '' ? v : '—');

const fmtDate = (val: string | null) => {
  if (!val) return '—';
  try {
    return new Date(val).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return val; }
};

// ── Component ─────────────────────────────────────────────────────────────────

const RawMaterialInwardReceipt: React.FC<RawMaterialInwardReceiptProps> = ({
  opened,
  onClose,
  onSave,
  poRefNo: initialPoRefNo = null,
  poNo: initialPoNo = null,
}) => {

  const [invoiceNumber, setInvoiceNumber]   = useState('');
  const [selectedPoRefNo, setSelectedPoRefNo] = useState<string | null>(
    initialPoRefNo ? String(initialPoRefNo) : null
  );
  const [poDate, setPoDate]                 = useState<string | null>(null);
  const [poOptions, setPoOptions]           = useState<DropDownOption[]>([]);
  const [lines, setLines]                   = useState<InwardReceiptLine[]>([]);
  const [selectedLines, setSelectedLines]   = useState<number[]>([]);
  const [loading, setLoading]               = useState(false);
  const [linesLoading, setLinesLoading]     = useState(false);
  const [fetchError, setFetchError]         = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen]       = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [editingCell, setEditingCell]       = useState<{ detId: number; field: string } | null>(null);

  // ── Load PO dropdown ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!opened) {
      // reset on close
      setInvoiceNumber('');
      setSelectedPoRefNo(initialPoRefNo ? String(initialPoRefNo) : null);
      setPoDate(null);
      setLines([]);
      setSelectedLines([]);
      setFetchError(null);
      setValidationErrors([]);
      return;
    }

    const loadPoList = async () => {
      setLoading(true);
      try {
        const res = await api.get<PoListApiResponse>('/api/inventory/purchase-order', {
          params: { page: 0, size: 200 },
        });
        const opts = res.data.data.content.map(po => ({
          value: String(po.poRefNo),
          label: po.poNo,
        }));
        setPoOptions(opts);

        // if pre-selected, load its line items
        if (initialPoRefNo) {
          setSelectedPoRefNo(String(initialPoRefNo));
          await loadPoLines(initialPoRefNo);
        }
      } catch {
        setFetchError('Failed to load purchase orders.');
      } finally {
        setLoading(false);
      }
    };

    loadPoList();
  }, [opened]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load PO line items when PO selected ───────────────────────────────────

  const loadPoLines = async (refNo: number) => {
    setLinesLoading(true);
    try {
      const [linesRes, headerRes] = await Promise.all([
        api.get<PoLineItemsApiResponse>(`/api/inventory/po-details/${refNo}`),
        api.get(`/api/inventory/purchase-order/${refNo}`),
      ]);
      const items = linesRes.data.data ?? [];
      setPoDate(headerRes.data.data?.poDate ?? null);
      setLines(items.map(item => ({
        poDetId:              item.poDetId,
        poRmCode:             item.poRmCode,
        poRmName:             item.poRmName,
        poUom:                item.poUom,
        rmOrderQty:           Number(item.poQty) || 0,
        rmReceivedQty:        '',
        expectedDeliveryDate: null,
        actualDeliveryDate:   null,
        inspectedBy:          '',
        approvedBy:           '',
      })));
    } catch {
      setFetchError('Failed to load PO line items.');
    } finally {
      setLinesLoading(false);
    }
  };

  const handlePoChange = async (value: string | null) => {
    setSelectedPoRefNo(value);
    setLines([]);
    setPoDate(null);
    if (value) await loadPoLines(Number(value));
  };

  // ── Line editing helpers ───────────────────────────────────────────────────

  const updateLine = (poDetId: number, field: keyof InwardReceiptLine, value: any) => {
    setLines(prev => prev.map(l => l.poDetId === poDetId ? { ...l, [field]: value } : l));
  };

  // ── Selection ─────────────────────────────────────────────────────────────

  const lineIds   = lines.map(l => l.poDetId);
  const allLines  = lineIds.length > 0 && lineIds.every(id => selectedLines.includes(id));
  const someLines = lineIds.some(id => selectedLines.includes(id)) && !allLines;
  const toggleAllLines = () => allLines ? setSelectedLines([]) : setSelectedLines(lineIds);
  const toggleLine = (id: number) =>
    setSelectedLines(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  // ── Validation ─────────────────────────────────────────────────────────────

  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!invoiceNumber.trim())  errors.push('Invoice Number is required');
    if (!selectedPoRefNo)       errors.push('PO Number is required');
    if (lines.length === 0)     errors.push('No line items found for this PO');
    const hasReceivedQty = lines.some(l => l.rmReceivedQty && parseFloat(l.rmReceivedQty) > 0);
    if (!hasReceivedQty)        errors.push('At least one line item must have Received Quantity > 0');
    return errors;
  };

  // ── Build rows ────────────────────────────────────────────────────────────

  const lineRows = lines.map(line => {
    const isSel = selectedLines.includes(line.poDetId);
    return (
      <Table.Tr key={line.poDetId} bg={isSel ? 'var(--mantine-color-blue-0)' : undefined}>
        <Table.Td>
          <input type="checkbox" checked={isSel} onChange={() => toggleLine(line.poDetId)} />
        </Table.Td>
        <Table.Td fw={500}>{line.poRmCode}</Table.Td>
        <Table.Td>{line.poRmName}</Table.Td>
        <Table.Td>{dash(line.poUom)}</Table.Td>
        <Table.Td ta="right">{line.rmOrderQty.toFixed(3)}</Table.Td>

        {/* Received Qty — editable */}
        <Table.Td ta="right">
          <input
            type="number"
            value={line.rmReceivedQty}
            onChange={e => updateLine(line.poDetId, 'rmReceivedQty', e.currentTarget.value)}
            placeholder="0.000"
            style={{
              width: '100%', textAlign: 'right', border: '1px solid var(--mantine-color-gray-4)',
              borderRadius: 4, padding: '2px 6px', fontSize: 13,
              backgroundColor: 'var(--mantine-color-yellow-0)',
            }}
          />
        </Table.Td>

        {/* Expected Delivery Date — editable */}
        <Table.Td>
          <input
            type="date"
            value={line.expectedDeliveryDate
              ? new Date(line.expectedDeliveryDate as Date).toISOString().split('T')[0]
              : ''}
            onChange={e => updateLine(line.poDetId, 'expectedDeliveryDate',
              e.currentTarget.value ? new Date(e.currentTarget.value) : null)}
            style={{
              width: '100%', border: '1px solid var(--mantine-color-gray-4)',
              borderRadius: 4, padding: '2px 6px', fontSize: 12,
              backgroundColor: 'var(--mantine-color-yellow-0)',
            }}
          />
        </Table.Td>

        {/* Actual Delivery Date — editable */}
        <Table.Td>
          <input
            type="date"
            value={line.actualDeliveryDate
              ? new Date(line.actualDeliveryDate as Date).toISOString().split('T')[0]
              : ''}
            onChange={e => updateLine(line.poDetId, 'actualDeliveryDate',
              e.currentTarget.value ? new Date(e.currentTarget.value) : null)}
            style={{
              width: '100%', border: '1px solid var(--mantine-color-gray-4)',
              borderRadius: 4, padding: '2px 6px', fontSize: 12,
              backgroundColor: 'var(--mantine-color-yellow-0)',
            }}
          />
        </Table.Td>

        {/* Inspected By — editable */}
        <Table.Td>
          <input
            type="text"
            value={line.inspectedBy}
            onChange={e => updateLine(line.poDetId, 'inspectedBy', e.currentTarget.value)}
            placeholder="Name"
            style={{
              width: '100%', border: '1px solid var(--mantine-color-gray-4)',
              borderRadius: 4, padding: '2px 6px', fontSize: 12,
              backgroundColor: 'var(--mantine-color-yellow-0)',
            }}
          />
        </Table.Td>

        {/* Approved By — editable */}
        <Table.Td>
          <input
            type="text"
            value={line.approvedBy}
            onChange={e => updateLine(line.poDetId, 'approvedBy', e.currentTarget.value)}
            placeholder="Name"
            style={{
              width: '100%', border: '1px solid var(--mantine-color-gray-4)',
              borderRadius: 4, padding: '2px 6px', fontSize: 12,
              backgroundColor: 'var(--mantine-color-yellow-0)',
            }}
          />
        </Table.Td>
      </Table.Tr>
    );
  });

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
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

          {/* ── Header ── */}
          <Box px="lg" py="sm"
            style={{
              backgroundColor: '#2c6e49',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexShrink: 0,
            }}
          >
            <Group gap="sm">
              <IconClipboardCheck size={18} color="white" />
              <Text fw={700} size="md" c="white">PO Receipt Form</Text>
              {selectedPoRefNo && (
                <Badge variant="filled"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  PO Ref # {selectedPoRefNo}
                </Badge>
              )}
            </Group>
            <Button size="xs" variant="white" color="dark" onClick={onClose}>Cancel</Button>
          </Box>

          {/* ── Body ── */}
          {loading ? (
            <Center py={80} style={{ flex: 1 }}>
              <Stack align="center" gap="sm">
                <Loader size="md" />
                <Text size="sm" c="dimmed">Loading...</Text>
              </Stack>
            </Center>
          ) : (
            <Box style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }} p="lg">

              {fetchError && <Text size="xs" c="red" mb="sm">{fetchError}</Text>}

              {/* ── Header Fields ── */}
              <Paper withBorder p="md" mb="lg" radius="sm"
                style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <Grid columns={12} gutter="md">
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Invoice Number"
                      value={invoiceNumber}
                      onChange={e => setInvoiceNumber(e.currentTarget.value)}
                      placeholder="Enter invoice number"
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormSelect
                      label="PO Number"
                      value={selectedPoRefNo}
                      onChange={handlePoChange}
                      data={poOptions}
                      placeholder="Select PO"
                      required
                      searchable
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="PO Date"
                      value={poDate ? fmtDate(poDate) : ''}
                      onChange={() => {}}
                      placeholder="—"
                      readOnly={true}
                    />
                  </Grid.Col>
                </Grid>
              </Paper>

              {/* ── PO Receipt Line Items ── */}
              <Divider
                label={
                  <Group gap="xs">
                    <Text size="sm" fw={500}>PO Receipt</Text>
                    {lines.length > 0 && (
                      <Badge size="xs" variant="light" color="green">
                        {lines.length} item{lines.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </Group>
                }
                labelPosition="left"
                mb="md"
              />

              {linesLoading ? (
                <Center py={40}>
                  <Stack align="center" gap="xs">
                    <Loader size="sm" />
                    <Text size="xs" c="dimmed">Loading line items...</Text>
                  </Stack>
                </Center>
              ) : (
                <MasterTable
                  columns={LINE_COLUMNS}
                  rows={lineRows}
                  colSpan={LINE_COLUMNS.length + 1}
                  totalElements={lines.length}
                  loading={false}
                  page={1}
                  totalPages={1}
                  pageSize={lines.length || 1}
                  onPageChange={() => {}}
                  searchValue=""
                  onSearchChange={() => {}}
                  allSelected={allLines}
                  someSelected={someLines}
                  onToggleSelectAll={toggleAllLines}
                  selectedCount={selectedLines.length}
                  onAdd={undefined}
                  onEdit={undefined}
                  onDelete={() => {
                    setLines(prev => prev.filter(l => !selectedLines.includes(l.poDetId)));
                    setSelectedLines([]);
                  }}
                  onRefresh={() => {
                    if (selectedPoRefNo) loadPoLines(Number(selectedPoRefNo));
                  }}
                />
              )}

              {lines.length === 0 && !linesLoading && (
                <Text size="sm" c="dimmed" ta="center" py="xl">
                  {selectedPoRefNo ? 'No line items found for this PO.' : 'Select a PO Number to load line items.'}
                </Text>
              )}

            </Box>
          )}

          {/* ── Footer ── */}
          <Box px="lg" py="sm"
            style={{
              borderTop: '1px solid var(--mantine-color-gray-3)',
              backgroundColor: 'var(--mantine-color-body)',
              flexShrink: 0,
            }}
          >
            <Group justify="space-between" align="center">
              <Text size="xs" c="dimmed">
                {lines.length > 0
                  ? `${lines.filter(l => l.rmReceivedQty && parseFloat(l.rmReceivedQty) > 0).length} of ${lines.length} items with received qty`
                  : 'No items loaded'}
              </Text>
              <Group gap="sm">
                <Button variant="light" color="red" size="sm"
                  disabled={selectedLines.length === 0}
                  onClick={() => {
                    setLines(prev => prev.filter(l => !selectedLines.includes(l.poDetId)));
                    setSelectedLines([]);
                  }}>
                  Delete Selected
                </Button>
                <Button variant="light" size="sm"
                  disabled={lines.length === 0}
                  onClick={() => {
                    // Submit — just save as-is (Close PO variant)
                    const errors = validateForm();
                    setValidationErrors(errors);
                    if (errors.length === 0) setConfirmOpen(true);
                    else setConfirmOpen(true);
                  }}>
                  Close PO
                </Button>
                <Button size="sm" color="green"
                  disabled={lines.length === 0}
                  onClick={() => {
                    const errors = validateForm();
                    setValidationErrors(errors);
                    setConfirmOpen(true);
                  }}>
                  Submit
                </Button>
              </Group>
            </Group>
          </Box>

        </Paper>
      </Modal>

      <ConfirmDialog
        opened={confirmOpen}
        onClose={() => { setConfirmOpen(false); setValidationErrors([]); }}
        onConfirm={() => {
          onSave?.({
            invoiceNumber,
            poRefNo: selectedPoRefNo,
            poDate,
            lines,
          });
          setConfirmOpen(false);
          onClose();
        }}
        message="Are you sure you want to submit this inward receipt?"
        confirmLabel="Submit"
        errors={validationErrors}
        zIndex={250}
      />
    </>
  );
};

export default RawMaterialInwardReceipt;