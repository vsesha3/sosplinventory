/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Text, Group, Button,
  Grid, Badge, Divider, Stack, Loader, Center, Table,
} from '@mantine/core';
import type { DateValue } from '@mantine/dates';
import { IconPrinter } from '@tabler/icons-react';
import { Modal } from '@mantine/core';
import api from '../../services/api';
import type { ApiResponse } from '../../types/api.types';

import { FormDatePicker } from '../../components/common/FormDatePicker';
import { FormTextInput } from '../../components/common/FormTextInput';
import { FormSelect } from '../../components/common/FormSelect';
import { FormTextarea } from '../../components/common/FormTextarea';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import MasterTable from '../../components/common/MasterTable';
import type { ColumnDef } from '../../components/common/MasterTable';
import POLineItem from './Polineitem';
import type { POLineItemData } from './Polineitem';

// ── API Types ─────────────────────────────────────────────────────────────────

interface DropDownOption {
  value: string;
  label: string;
  prefix?: string;
}

interface DropDownApiResponse {
  success: boolean;
  message: string;
  data: DropDownOption[];
}

interface DecimalField {
  source: string;
  parsedValue: number;
}

interface PurchaseOrderApiData {
  poRefNo: number;
  poNo: string;
  poDate: string;
  poKindAttention: string | null;
  supplierId: number | null;
  supplierCode: string | null;
  supplierName: string | null;
  poDeliverySchedule: string | null;
  poPaymentTerms: string | null;
  poDeliveryTerms: string | null;
  poType: string | null;
  poReference: string | null;
  poRemarks: string | null;
  requestedBy: number | null;
  addCharges: number | null;
  poClosedFlag: string | null;
  isActive: boolean;
  createdBy: string | null;
  createdAt: string | null;
  updatedBy: string | null;
  updatedAt: string | null;
}

interface PoDetailApiResponse {
  success: boolean;
  message: string;
  data: PurchaseOrderApiData;
}

interface PoLineItem {
  poDetId: number;
  poRefNo: number;
  poRmCode: string;
  poRmName: string;
  poQty: DecimalField | null;
  poRate: DecimalField | null;
  poUom: string | null;
  sgst: DecimalField | null;
  sgstValue: DecimalField | null;
  poNoOfPacks: DecimalField | null;
  poPackSize: DecimalField | null;
  cgst: DecimalField | null;
  cgstValue: DecimalField | null;
  igst: DecimalField | null;
  igstValue: DecimalField | null;
  hsnCode: string | null;
}

interface PoLineItemsApiResponse {
  success: boolean;
  message: string;
  data: PoLineItem[];
}

interface ReferenceNumberResponse {
  referenceNumber: string;
}

// ── Form Types ────────────────────────────────────────────────────────────────

export interface PurchaseOrderFormData {
  poRefNo?: number;
  poDate: DateValue;
  poType: string | null;
  poNo: string;
  poKindAttention: string;
  supplierId: string | null;
  supplierName: string | null;
  poDeliverySchedule: DateValue;
  poPaymentTerms: string;
  poDeliveryTerms: string;
  poReference: string;
  poRemarks: string;
  addCharges: string;
  requestedBy: string | null;
}

export interface PurchaseOrderFormProps {
  initialData?: Partial<PurchaseOrderFormData>;
  poTypeOptions?: DropDownOption[];
  supplierOptions?: DropDownOption[];
  onSave?: (data: PurchaseOrderFormData) => void;
  onPrint?: () => void;
  readOnly?: boolean;
  opened: boolean;
  onClose: () => void;
  mode?: 'create' | 'update';
  poRefNo?: number | null;
}

// ── Default form values ───────────────────────────────────────────────────────

const defaultForm: PurchaseOrderFormData = {
  poDate: null,
  poType: null,
  poNo: '',
  poKindAttention: '',
  supplierId: null,
  supplierName: null,
  poDeliverySchedule: null,
  poPaymentTerms: '',
  poDeliveryTerms: '',
  poReference: '',
  poRemarks: '',
  addCharges: '',
  requestedBy: null,
};

// ── Line item columns for MasterTable ─────────────────────────────────────────

const LINE_ITEM_COLUMNS: ColumnDef[] = [
  { key: 'poRmCode',    label: 'RM Code',   width: 110 },
  { key: 'poRmName',    label: 'RM Name',   width: 180 },
  { key: 'poUom',       label: 'UOM',       width: 70  },
  { key: 'poQty',       label: 'Qty',       width: 90,  align: 'right' },
  { key: 'poRate',      label: 'Rate',      width: 90,  align: 'right' },
  { key: 'poNoOfPacks', label: 'Packs',     width: 80,  align: 'right' },
  { key: 'poPackSize',  label: 'Pack Size', width: 90,  align: 'right' },
  { key: 'hsnCode',     label: 'HSN Code',  width: 100 },
  { key: 'sgst',        label: 'SGST %',    width: 80,  align: 'right' },
  { key: 'cgst',        label: 'CGST %',    width: 80,  align: 'right' },
  { key: 'igst',        label: 'IGST %',    width: 80,  align: 'right' },
  { key: 'igstValue',   label: 'IGST Val',  width: 90,  align: 'right' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const pv = (field: DecimalField | null | undefined, decimals = 2): string => {
  if (field == null) return '—';
  if (typeof field === 'number') return (field as number).toFixed(decimals);
  if (field.parsedValue == null) return field.source ?? '—';
  return field.parsedValue.toFixed(decimals);
};

const dash = (val: string | null | undefined): string =>
  val && val.trim() ? val : '—';

// ── Component ─────────────────────────────────────────────────────────────────

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  initialData,
  poTypeOptions = [
    { value: 'Raw Material',     label: 'Raw Material',     prefix: 'RM'   },
    { value: 'Packing Material', label: 'Packing Material', prefix: 'PM'   },
    { value: 'Capital Goods',    label: 'Capital Goods',    prefix: 'CG'   },
    { value: 'Miscellaneous',    label: 'Miscellaneous',    prefix: 'MISC' },
  ],
  onSave,
  onPrint,
  readOnly = false,
  opened,
  onClose,
  mode = 'create',
  poRefNo = null,
}) => {

  const [form, setForm]           = useState<PurchaseOrderFormData>({ ...defaultForm, ...initialData });
  const [dropdowns, setDropdowns] = useState({
    employeeOptions: [] as DropDownOption[],
    supplierOptions: [] as DropDownOption[],
  });
  const [lineItems, setLineItems]             = useState<PoLineItem[]>([]);
  const [selectedLines, setSelectedLines]     = useState<number[]>([]);
  const [formLoading, setFormLoading]         = useState(false);
  const [fetchError, setFetchError]           = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen]         = useState(false);
  const [lineItemOpen, setLineItemOpen]       = useState(false);
  const [editLineItem, setEditLineItem]       = useState<Partial<POLineItemData> | undefined>();
  const [lineItemMode, setLineItemMode]       = useState<'create' | 'edit'>('create');

  // ── Fetch functions ───────────────────────────────────────────────────────

  const fetchEmployees = async (): Promise<DropDownOption[]> => {
    const res = await api.get<DropDownApiResponse>('/api/inventory/employees/dropdown');
    return res.data.data.filter(opt => opt.label != null && opt.value != null);
  };

  const fetchSuppliersList = async (): Promise<DropDownOption[]> => {
    const res = await api.get<DropDownApiResponse>('/api/supplier-view/dropdown');
    return res.data.data.filter(opt => opt.label != null && opt.value != null);
  };

  const fetchPoFormDetails = async (refNo: number): Promise<PurchaseOrderApiData> => {
    const res = await api.get<PoDetailApiResponse>(`/api/inventory/purchase-order/${refNo}`);
    return res.data.data;
  };

  const fetchPoLineItems = async (refNo: number): Promise<PoLineItem[]> => {
    const res = await api.get<PoLineItemsApiResponse>(`/api/inventory/po-details/${refNo}`);
    return res.data.data;
  };

  // ── Map API → form ────────────────────────────────────────────────────────

  const mapApiToForm = (
    apiData: PurchaseOrderApiData,
    fetchedSupplierOptions: DropDownOption[],
  ): PurchaseOrderFormData => {
    const matchedSupplier = fetchedSupplierOptions.find(
      (opt) => opt.label.toLowerCase() === (apiData.supplierName ?? '').toLowerCase()
    )?.value ?? null;

    return {
      poRefNo:            apiData.poRefNo,
      poNo:               apiData.poNo ?? '',
      poDate:             apiData.poDate ? new Date(apiData.poDate) : null,
      poKindAttention:    apiData.poKindAttention?.trim() ?? '',
      supplierId:         matchedSupplier,
      supplierName:       apiData.supplierName ?? null,
      poDeliverySchedule: apiData.poDeliverySchedule ? new Date(apiData.poDeliverySchedule) : null,
      poPaymentTerms:     apiData.poPaymentTerms ?? '',
      poDeliveryTerms:    apiData.poDeliveryTerms ?? '',
      poType:             apiData.poType ?? null,
      poReference:        apiData.poReference ?? '',
      poRemarks:          apiData.poRemarks ?? '',
      requestedBy:        apiData.requestedBy != null ? String(apiData.requestedBy) : null,
      addCharges:         apiData.addCharges != null ? String(apiData.addCharges) : '',
    };
  };

  // ── Master loader ─────────────────────────────────────────────────────────

  const loadFormData = async (cancelled: { value: boolean }) => {
    setFormLoading(true);
    setFetchError(null);
    try {
      const promises: Promise<unknown>[] = [
        fetchEmployees(),
        fetchSuppliersList(),
      ];
      if (mode === 'update' && poRefNo) {
        promises.push(fetchPoFormDetails(poRefNo));
        promises.push(fetchPoLineItems(poRefNo));
      }
      const results = await Promise.all(promises);
      if (cancelled.value) return;

      const employeeOptions  = results[0] as DropDownOption[];
      const fetchedSuppliers = results[1] as DropDownOption[];
      setDropdowns({ employeeOptions, supplierOptions: fetchedSuppliers });

      if (mode === 'update' && results[2]) {
        const apiData = results[2] as PurchaseOrderApiData;
        const items   = (results[3] as PoLineItem[]) ?? [];
        setForm(mapApiToForm(apiData, fetchedSuppliers));
        setLineItems(items);
      } else {
        setForm({ ...defaultForm, ...initialData });
        setLineItems([]);
      }
    } catch {
      if (!cancelled.value) setFetchError('Failed to load form data. Please close and try again.');
    } finally {
      if (!cancelled.value) setFormLoading(false);
    }
  };

  useEffect(() => {
    if (!opened) return;
    const cancelled = { value: false };
    loadFormData(cancelled);
    return () => { cancelled.value = true; };
  }, [opened]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Form helpers ──────────────────────────────────────────────────────────

  const set = (field: keyof PurchaseOrderFormData) =>
    (value: string | null) =>
      setForm((prev) => ({ ...prev, [field]: value }));

  const setDate = (field: keyof PurchaseOrderFormData) =>
    (value: DateValue) =>
      setForm((prev) => ({ ...prev, [field]: value }));

  const setStr = (field: keyof PurchaseOrderFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.currentTarget.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const handlePoTypeChange = async (value: string | null) => {
    set('poType')(value);
    if (!value || mode === 'update') return;
    const selected = poTypeOptions.find(opt => opt.value === value);
    if (!selected?.prefix) return;
    try {
      const res = await api.get<ApiResponse<ReferenceNumberResponse>>(
        `/api/inventory/purchase-order/generate-reference-number`,
        { params: { prefix: selected.prefix } }
      );
      setForm(prev => ({ ...prev, poNo: res.data.data.referenceNumber }));
    } catch {
      console.error('Failed to generate reference number');
    }
  };

  // ── Line item selection ───────────────────────────────────────────────────

  const lineIds   = lineItems.map((item) => item.poDetId);
  const allLines  = lineIds.length > 0 && lineIds.every((id) => selectedLines.includes(id));
  const someLines = lineIds.some((id) => selectedLines.includes(id)) && !allLines;

  const toggleAllLines = () => {
    if (allLines) setSelectedLines([]);
    else setSelectedLines(lineIds);
  };

  const toggleLine = (id: number) =>
    setSelectedLines((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  // ── Line item totals for footer ───────────────────────────────────────────

  const totalQty      = lineItems.reduce((s, i) => s + (i.poQty?.parsedValue      ?? 0), 0);
  const totalRate     = lineItems.reduce((s, i) => s + (i.poRate?.parsedValue     ?? 0), 0);
  const totalIgstVal  = lineItems.reduce((s, i) => s + (i.igstValue?.parsedValue  ?? 0), 0);

  // ── Build MasterTable rows ────────────────────────────────────────────────

  const lineItemRows = lineItems.map((item) => {
    const isSel = selectedLines.includes(item.poDetId);
    return (
      <Table.Tr key={item.poDetId} bg={isSel ? 'var(--mantine-color-blue-0)' : undefined}>
        <Table.Td>
          <input
            type="checkbox"
            checked={isSel}
            onChange={() => toggleLine(item.poDetId)}
          />
        </Table.Td>
        <Table.Td fw={500}>{item.poRmCode}</Table.Td>
        <Table.Td>{item.poRmName}</Table.Td>
        <Table.Td>{dash(item.poUom)}</Table.Td>
        <Table.Td ta="right">{pv(item.poQty, 3)}</Table.Td>
        <Table.Td ta="right">{pv(item.poRate, 2)}</Table.Td>
        <Table.Td ta="right">{pv(item.poNoOfPacks, 0)}</Table.Td>
        <Table.Td ta="right">{pv(item.poPackSize, 3)}</Table.Td>
        <Table.Td>{dash(item.hsnCode)}</Table.Td>
        <Table.Td ta="right">{pv(item.sgst, 2)}</Table.Td>
        <Table.Td ta="right">{pv(item.cgst, 2)}</Table.Td>
        <Table.Td ta="right">{pv(item.igst, 2)}</Table.Td>
        <Table.Td ta="right">{pv(item.igstValue, 2)}</Table.Td>
      </Table.Tr>
    );
  });

  // ── Footer row for MasterTable ────────────────────────────────────────────

  const lineItemFooter = lineItems.length > 0 ? (
    <Table.Tfoot>
      <Table.Tr style={{ backgroundColor: 'var(--mantine-color-gray-1)', fontWeight: 600 }}>
        {/* checkbox col */}
        <Table.Td />
        {/* RM Code */}
        <Table.Td>
          <Text size="xs" fw={700}>Total</Text>
        </Table.Td>
        {/* RM Name */}
        <Table.Td>
          <Text size="xs" c="dimmed">{lineItems.length} item{lineItems.length !== 1 ? 's' : ''}</Text>
        </Table.Td>
        {/* UOM */}
        <Table.Td />
        {/* Qty */}
        <Table.Td ta="right">
          <Text size="xs" fw={700}>{totalQty.toFixed(3)}</Text>
        </Table.Td>
        {/* Rate */}
        <Table.Td ta="right">
          <Text size="xs" fw={700}>{totalRate.toFixed(2)}</Text>
        </Table.Td>
        {/* Packs */}
        <Table.Td />
        {/* Pack Size */}
        <Table.Td />
        {/* HSN */}
        <Table.Td />
        {/* SGST */}
        <Table.Td />
        {/* CGST */}
        <Table.Td />
        {/* IGST */}
        <Table.Td />
        {/* IGST Val */}
        <Table.Td ta="right">
          <Text size="xs" fw={700}>{totalIgstVal.toFixed(2)}</Text>
        </Table.Td>
      </Table.Tr>
    </Table.Tfoot>
  ) : null;

  // ── Handle line item save ─────────────────────────────────────────────────

  const handleLineItemSave = (data: POLineItemData) => {
    if (lineItemMode === 'edit') {
      setLineItems(prev =>
        prev.map(item => item.poDetId === data.poDetId
          ? {
              ...item,
              poRmCode:    data.poRmCode ?? '',
              poRmName:    data.poRmName ?? '',
              poUom:       data.poUom,
              poQty:       data.poQty       ? { source: data.poQty,       parsedValue: parseFloat(data.poQty) }       : null,
              poRate:      data.poRate      ? { source: data.poRate,      parsedValue: parseFloat(data.poRate) }      : null,
              poNoOfPacks: data.poNoOfPacks ? { source: data.poNoOfPacks, parsedValue: parseFloat(data.poNoOfPacks) } : null,
              poPackSize:  data.poPackSize  ? { source: data.poPackSize,  parsedValue: parseFloat(data.poPackSize) }  : null,
              sgst:        data.sgst        ? { source: data.sgst,        parsedValue: parseFloat(data.sgst) }        : null,
              cgst:        data.cgst        ? { source: data.cgst,        parsedValue: parseFloat(data.cgst) }        : null,
              igst:        data.igst        ? { source: data.igst,        parsedValue: parseFloat(data.igst) }        : null,
              hsnCode:     data.hsnCode || null,
            }
          : item
        )
      );
    } else {
      setLineItems(prev => [...prev, {
        poDetId:     Date.now(),
        poRefNo:     form.poRefNo ?? 0,
        poRmCode:    data.poRmCode ?? '',
        poRmName:    data.poRmName ?? '',
        poUom:       data.poUom,
        poQty:       data.poQty       ? { source: data.poQty,       parsedValue: parseFloat(data.poQty) }       : null,
        poRate:      data.poRate      ? { source: data.poRate,      parsedValue: parseFloat(data.poRate) }      : null,
        poNoOfPacks: data.poNoOfPacks ? { source: data.poNoOfPacks, parsedValue: parseFloat(data.poNoOfPacks) } : null,
        poPackSize:  data.poPackSize  ? { source: data.poPackSize,  parsedValue: parseFloat(data.poPackSize) }  : null,
        sgst:        data.sgst        ? { source: data.sgst,        parsedValue: parseFloat(data.sgst) }        : null,
        sgstValue:   null,
        cgst:        data.cgst        ? { source: data.cgst,        parsedValue: parseFloat(data.cgst) }        : null,
        cgstValue:   null,
        igst:        data.igst        ? { source: data.igst,        parsedValue: parseFloat(data.igst) }        : null,
        igstValue:   null,
        hsnCode:     data.hsnCode || null,
      }]);
    }
    setLineItemOpen(false);
  };

  const confirmLabel = mode === 'update' ? 'Update' : 'Save';

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
      <Paper
        withBorder
        radius="md"
        style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
      >

        {/* ── Header ── */}
        <Box
          px="lg" py="sm"
          style={{
            backgroundColor: '#2c4a6e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <Group gap="sm">
            <Text fw={700} size="md" c="white">
              Purchase Order — {mode === 'update' ? 'Edit' : 'New'}
            </Text>
            {form.poRefNo && (
              <Badge
                variant="filled"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              >
                PO Ref # {form.poRefNo}
              </Badge>
            )}
          </Group>
          <Button
            size="xs"
            variant="white"
            color="dark"
            leftSection={<IconPrinter size={14} />}
            onClick={onPrint}
          >
            Print
          </Button>
        </Box>

        {/* ── Loading ── */}
        {formLoading ? (
          <Center py={80} style={{ flex: 1 }}>
            <Stack align="center" gap="sm">
              <Loader size="md" />
              <Text size="sm" c="dimmed">Loading form data...</Text>
            </Stack>
          </Center>
        ) : (
          <Box style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }} p="lg">

            {fetchError && (
              <Text size="xs" c="red" mb="sm">{fetchError}</Text>
            )}

            {/* ── Row 1: PO Date | PO Type | Supplier Name | PO Number ── */}
            <Grid gutter="md" mb="md">
              <Grid.Col span={3}>
                <FormDatePicker
                  label="PO Date"
                  value={form.poDate}
                  onChange={setDate('poDate')}
                  required
                  readOnly={readOnly}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <FormSelect
                  label="PO Type"
                  value={form.poType}
                  onChange={handlePoTypeChange}
                  data={poTypeOptions}
                  placeholder="Select type"
                  required
                  readOnly={readOnly}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <FormSelect
                  label="Supplier Name"
                  value={form.supplierId}
                  onChange={set('supplierId')}
                  data={dropdowns.supplierOptions}
                  placeholder="Select supplier"
                  required
                  searchable
                  readOnly={readOnly}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <FormTextInput
                  label="PO Number"
                  value={form.poNo}
                  onChange={setStr('poNo')}
                  placeholder="e.g. RM/694/2025-2026"
                  required
                  readOnly={readOnly}
                />
              </Grid.Col>
            </Grid>

            {/* ── Row 2: Delivery Schedule | Kind Attention | Payment Terms | Delivery Terms ── */}
            <Grid gutter="md" mb="md">
              <Grid.Col span={3}>
                <FormDatePicker
                  label="Delivery Schedule"
                  value={form.poDeliverySchedule}
                  onChange={setDate('poDeliverySchedule')}
                  required
                  readOnly={readOnly}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <FormTextInput
                  label="Kind Attention"
                  value={form.poKindAttention}
                  onChange={setStr('poKindAttention')}
                  placeholder="Attention name"
                  readOnly={readOnly}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <FormTextInput
                  label="PO Payment Terms"
                  value={form.poPaymentTerms}
                  onChange={setStr('poPaymentTerms')}
                  placeholder="e.g. 60 days"
                  readOnly={readOnly}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <FormTextInput
                  label="Delivery Terms"
                  value={form.poDeliveryTerms}
                  onChange={setStr('poDeliveryTerms')}
                  placeholder="e.g. Door delivery"
                  readOnly={readOnly}
                />
              </Grid.Col>
            </Grid>

            {/* ── Row 3: PO Reference | Other Charges | Requested By | (spacer) ── */}
            <Grid gutter="md" mb="md">
              <Grid.Col span={3}>
                <FormTextInput
                  label="PO Reference"
                  value={form.poReference}
                  onChange={setStr('poReference')}
                  placeholder="e.g. teleconversation"
                  required
                  readOnly={readOnly}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <FormTextInput
                  label="Other Charges"
                  value={form.addCharges}
                  onChange={setStr('addCharges')}
                  placeholder="0.00"
                  readOnly={readOnly}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <FormSelect
                  label="Requested By"
                  value={form.requestedBy}
                  onChange={set('requestedBy')}
                  data={dropdowns.employeeOptions}
                  placeholder="Select employee"
                  searchable
                  readOnly={readOnly}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                {/* intentionally empty — remarks takes full width below */}
              </Grid.Col>
            </Grid>

            {/* ── Row 4: Remarks (full width) ── */}
            <Grid gutter="md" mb="lg">
              <Grid.Col span={12}>
                <FormTextarea
                  label="Remarks"
                  value={form.poRemarks}
                  onChange={setStr('poRemarks')}
                  placeholder="Enter any remarks..."
                  minRows={2}
                  readOnly={readOnly}
                />
              </Grid.Col>
            </Grid>

            {/* ── Line Items via MasterTable ── */}
            <Divider
              label={
                <Group gap="xs">
                  <Text size="sm" fw={500}>Line Items</Text>
                  {lineItems.length > 0 && (
                    <Badge size="xs" variant="light" color="blue">
                      {lineItems.length} item{lineItems.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </Group>
              }
              labelPosition="left"
              mb="md"
            />

            <MasterTable
              columns={LINE_ITEM_COLUMNS}
              rows={lineItemRows}
              colSpan={LINE_ITEM_COLUMNS.length + 1}
              totalElements={lineItems.length}
              loading={false}
              page={1}
              totalPages={1}
              pageSize={lineItems.length || 1}
              onPageChange={() => {}}
              searchValue=""
              onSearchChange={() => {}}
              allSelected={allLines}
              someSelected={someLines}
              onToggleSelectAll={toggleAllLines}
              selectedCount={selectedLines.length}
              footer={lineItemFooter}
              onAdd={() => {
                setLineItemMode('create');
                setEditLineItem(undefined);
                setLineItemOpen(true);
              }}
              onEdit={() => {
                if (selectedLines.length === 1) {
                  const found = lineItems.find(i => i.poDetId === selectedLines[0]);
                  if (found) {
                    setEditLineItem({
                      poDetId:     found.poDetId,
                      poRmCode:    found.poRmCode,
                      poRmName:    found.poRmName,
                      poUom:       found.poUom,
                      poQty:       found.poQty?.source       ?? '',
                      poRate:      found.poRate?.source      ?? '',
                      poNoOfPacks: found.poNoOfPacks?.source ?? '',
                      poPackSize:  found.poPackSize?.source  ?? '',
                      sgst:        found.sgst?.source        ?? '',
                      cgst:        found.cgst?.source        ?? '',
                      igst:        found.igst?.source        ?? '',
                      hsnCode:     found.hsnCode             ?? '',
                    });
                    setLineItemMode('edit');
                    setLineItemOpen(true);
                  }
                }
              }}
              onDelete={() => {
                setLineItems(prev =>
                  prev.filter(i => !selectedLines.includes(i.poDetId))
                );
                setSelectedLines([]);
              }}
              onRefresh={() => {
                if (poRefNo) fetchPoLineItems(poRefNo).then(setLineItems);
              }}
            />

          </Box>
        )}

        {/* ── Footer ── */}
        {!readOnly && (
          <Box
            px="lg" py="sm"
            style={{
              borderTop: '1px solid var(--mantine-color-gray-3)',
              backgroundColor: 'var(--mantine-color-body)',
              flexShrink: 0,
            }}
          >
            <Group justify="flex-end">
              <Button variant="default" size="sm" onClick={onClose}>Cancel</Button>
              <Button onClick={() => setConfirmOpen(true)}>Save PO</Button>
            </Group>
          </Box>
        )}

      </Paper>

      <ConfirmDialog
        opened={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => onSave?.(form)}
        message={`Are you sure you want to ${confirmLabel.toLowerCase()} this Purchase Order?`}
        confirmLabel={confirmLabel}
      />

      <POLineItem
        opened={lineItemOpen}
        onClose={() => setLineItemOpen(false)}
        onSave={handleLineItemSave}
        initialData={editLineItem}
        mode={lineItemMode}
        poType={form.poType}
      />

    </Modal>
  );
};

export default PurchaseOrderForm;
