/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Text, Group, Button,
  Grid, Badge, Divider, Stack, Loader, Center, Table, ScrollArea,
} from '@mantine/core';
import type { DateValue } from '@mantine/dates';
import { IconPrinter } from '@tabler/icons-react';
import { Modal } from '@mantine/core';
import api from '../../services/api';

import { FormDatePicker } from '../../components/common/FormDatePicker';
import { FormTextInput } from '../../components/common/FormTextInput';
import { FormSelect } from '../../components/common/FormSelect';
import { FormTextarea } from '../../components/common/FormTextarea';

// ── API Types ─────────────────────────────────────────────────────────────────

interface DropDownOption {
  value: string;
  label: string;
}

interface DropDownApiResponse {
  success: boolean;
  message: string;
  data: DropDownOption[];
}

// Numeric fields come as { source: "264.00", parsedValue: 264 }
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

// ── PO Line Item Types ────────────────────────────────────────────────────────

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
    { value: 'Raw Material',     label: 'Raw Material' },
    { value: 'Packing Material', label: 'Packing Material' },
    { value: 'Capital Goods',    label: 'Capital Goods' },
    { value: 'Miscellaneous',    label: 'Miscellaneous' },
  ],

  onSave,
  onPrint,
  readOnly = false,
  opened,
  onClose,
  mode = 'create',
  poRefNo = null,
}) => {

  const [form, setForm] = useState<PurchaseOrderFormData>({
    ...defaultForm,
    ...initialData,
  });

  const [dropdowns, setDropdowns] = useState({
    employeeOptions: [] as DropDownOption[],
    supplierOptions: [] as DropDownOption[],
  });

  const [lineItems, setLineItems]     = useState<PoLineItem[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [fetchError, setFetchError]   = useState<string | null>(null);

  // ── Fetch functions ───────────────────────────────────────────────────────

  const fetchEmployees = async (): Promise<DropDownOption[]> => {
    const res = await api.get<DropDownApiResponse>('/api/inventory/employees/dropdown');
    return res.data.data;
  };

  const fetchSuppliersList = async (): Promise<DropDownOption[]> => {
    const res = await api.get<DropDownApiResponse>('/api/supplier-view/dropdown');
    return res.data.data;
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
    // Match supplier by name since dropdown value is supplierCode
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
        const apiData  = results[2] as PurchaseOrderApiData;
        const items    = (results[3] as PoLineItem[]) ?? [];
        setForm(mapApiToForm(apiData, fetchedSuppliers));
        setLineItems(items);
      } else {
        setForm({ ...defaultForm, ...initialData });
        setLineItems([]);
      }

    } catch {
      if (!cancelled.value) {
        setFetchError('Failed to load form data. Please close and try again.');
      }
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
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.currentTarget.value }));

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={null}
      size="xl"
      padding={0}
      radius="md"
      withCloseButton={false}
      styles={{
        body: {
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '90vh',
          overflow: 'hidden',
        },
      }}
    >
      <Paper
        withBorder
        radius="md"
        style={{
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
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
          <Box style={{ flex: 1, overflowY: 'scroll', overflowX: 'hidden' }} p="lg">

            {fetchError && (
              <Text size="xs" c="red" mb="sm">{fetchError}</Text>
            )}

            {/* ── Row 1: PO Date | PO Type | PO Number ── */}
            <Grid gutter="md" mb="md">
              <Grid.Col span={4}>
                <FormDatePicker
                  label="PO Date"
                  value={form.poDate}
                  onChange={setDate('poDate')}
                  required
                  readOnly={readOnly}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <FormSelect
                  label="PO Type"
                  value={form.poType}
                  onChange={set('poType')}
                  data={poTypeOptions}
                  placeholder="Select type"
                  required
                  readOnly={readOnly}
                />
              </Grid.Col>
              <Grid.Col span={4}>
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

            {/* ── Row 2: Kind Attention | Supplier Name | Delivery Schedule ── */}
            <Grid gutter="md" mb="md">
              <Grid.Col span={4}>
                <FormTextInput
                  label="Kind Attention"
                  value={form.poKindAttention}
                  onChange={setStr('poKindAttention')}
                  placeholder="Attention name"
                  readOnly={readOnly}
                />
              </Grid.Col>
              <Grid.Col span={4}>
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
              <Grid.Col span={4}>
                <FormDatePicker
                  label="Delivery Schedule"
                  value={form.poDeliverySchedule}
                  onChange={setDate('poDeliverySchedule')}
                  required
                  readOnly={readOnly}
                />
              </Grid.Col>
            </Grid>

            {/* ── Row 3: Payment Terms | Delivery Terms | PO Reference | Other Charges ── */}
            <Grid gutter="md" mb="md">
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
            </Grid>

            {/* ── Row 4: Remarks | Requested By ── */}
            <Grid gutter="md" mb="lg">
              <Grid.Col span={8}>
                <FormTextarea
                  label="Remarks"
                  value={form.poRemarks}
                  onChange={setStr('poRemarks')}
                  placeholder="Enter any remarks..."
                  minRows={3}
                  readOnly={readOnly}
                />
              </Grid.Col>
              <Grid.Col span={4}>
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
            </Grid>

            {/* ── Line Items ── */}
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

            {lineItems.length === 0 ? (
              <Box
                p="xl"
                ta="center"
                style={{
                  border: '1px dashed var(--mantine-color-gray-4)',
                  borderRadius: 6,
                  minHeight: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text c="dimmed" size="sm" fs="italic">
                  No line items found
                </Text>
              </Box>
            ) : (
              <ScrollArea>
                <Table
                  withTableBorder
                  withColumnBorders
                  style={{ fontSize: 12, whiteSpace: 'nowrap' }}
                >
                  <Table.Thead style={{ backgroundColor: 'var(--mantine-color-blue-1)' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: 11 }}>#</Table.Th>
                      <Table.Th style={{ fontSize: 11 }}>RM Code</Table.Th>
                      <Table.Th style={{ fontSize: 11 }}>RM Name</Table.Th>
                      <Table.Th style={{ fontSize: 11 }}>UOM</Table.Th>
                      <Table.Th ta="right" style={{ fontSize: 11 }}>Qty</Table.Th>
                      <Table.Th ta="right" style={{ fontSize: 11 }}>Rate</Table.Th>
                      <Table.Th ta="right" style={{ fontSize: 11 }}>Packs</Table.Th>
                      <Table.Th ta="right" style={{ fontSize: 11 }}>Pack Size</Table.Th>
                      <Table.Th style={{ fontSize: 11 }}>HSN Code</Table.Th>
                      <Table.Th ta="right" style={{ fontSize: 11 }}>SGST %</Table.Th>
                      <Table.Th ta="right" style={{ fontSize: 11 }}>CGST %</Table.Th>
                      <Table.Th ta="right" style={{ fontSize: 11 }}>IGST %</Table.Th>
                      <Table.Th ta="right" style={{ fontSize: 11 }}>IGST Val</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {lineItems.map((item, idx) => (
                      <Table.Tr key={item.poDetId}>
                        <Table.Td>{idx + 1}</Table.Td>
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
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            )}

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
              <Button size="sm" onClick={() => onSave?.(form)}>Save PO</Button>
            </Group>
          </Box>
        )}

      </Paper>
    </Modal>
  );
};

export default PurchaseOrderForm;