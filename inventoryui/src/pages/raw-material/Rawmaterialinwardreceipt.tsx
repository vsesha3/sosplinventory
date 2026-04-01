/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button,
  Grid, Badge, Stack, Loader, Center, Divider,
} from '@mantine/core';
import { IconClipboardCheck } from '@tabler/icons-react';
import type { DateValue } from '@mantine/dates';
import { FormTextInput } from '../../components/common/FormTextInput';
import { FormSelect } from '../../components/common/FormSelect';
import { FormDatePicker } from '../../components/common/FormDatePicker';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import FormHeader from '../common/Formheader';
import InwardReceiptLineTable from '../common/Inwardreceiptlinetable';
import type { InwardReceiptLine } from '../common/Inwardreceiptlinetable';
import api from '../../services/api';
import { PO_TYPE_LABELS } from '../../types/api.types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DropDownOption {
  value: string;
  label: string;
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

interface PoLineItemDetail {
  poDetId: number;
  poRefNo: number;
  poRmCode: string;
  poRmName: string;
  poQty: number | null;
  poUom: string | null;
  poNoOfPacks: number | null;
  poPackSize: number | null;
  sgst: any | null;   // ← add
  cgst: any | null;   // ← add
  igst: any | null;   // ← add
  poRate: any | null;   // ← add (for pre-filling rate)
  rmReceivedQty: number | null; // ← add (for received qty from receipt if exists)
  expDateDel: string | null; // ← add (for expected delivery date)
  actDateDel: string | null; // ← add (for actual delivery date)
  inspectedBy: string | null; // ← add
  approvedBy: string | null; // ← add
  lotNumber: string | null; // ← add
}

interface PoLineItemsApiResponse {
  success: boolean;
  message: string;
  data: PoLineItemDetail[];
}

// ── Form Data ─────────────────────────────────────────────────────────────────

export interface InwardReceiptFormData {
  actualDateTimeOfReceipt: DateValue;
  dateTimeOfReceipt: DateValue;
  grnNo: string;
  ircNo: string;
  supplierId: string | null;

  transporterId: string | null;
  stnCommercialInvoiceNo: string;
  invoiceDate: DateValue;
  modvatCopyNo: string;
  sapPo: string;
  lrNumber: string;
  poRefNo: string | null;
  poDate: string | null;
  lines: InwardReceiptLine[];
  poType: string | null;
  freight: string;
   freightTaxPct: string;
}

export interface RawMaterialInwardReceiptProps {
  opened: boolean;
  onClose: () => void;
  onSave?: (data: InwardReceiptFormData) => void;
  poRefNo?: number | null;
  poNo?: string | null;
 
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const defaultForm = {
  actualDateTimeOfReceipt: null as DateValue,
  dateTimeOfReceipt: null as DateValue,
  grnNo: '',
  ircNo: '',
  supplierId: null as string | null,

  transporterId: null as string | null,
  stnCommercialInvoiceNo: '',
  invoiceDate: null as DateValue,
  modvatCopyNo: '',
  sapPo: '',
  lrNumber: '',
  poRefNo: null as string | null,
  poDate: null as string | null,
  poType: null as string | null,
  materialDetId: null as number | null,
  freight: '',
  freightTaxPct: '' as string,
};

const fmtDate = (val: string | null) => {
  if (!val) return '';
  try {
    return new Date(val).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return val; }
};

// ── Reusable label cell ───────────────────────────────────────────────────────



// ── Component ─────────────────────────────────────────────────────────────────

const RawMaterialInwardReceipt: React.FC<RawMaterialInwardReceiptProps> = ({
  opened,
  onClose,
  onSave,
  poRefNo: initialPoRefNo = null,
}) => {

  const [form, setForm] = useState({ ...defaultForm });
  const [lines, setLines] = useState<InwardReceiptLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [linesLoading, setLinesLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [poOptions, setPoOptions] = useState<DropDownOption[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<DropDownOption[]>([]);

  const [transporterOptions, setTransporterOptions] = useState<DropDownOption[]>([]);

  // ── Load ──────────────────────────────────────────────────────────────────



  useEffect(() => {
    if (!opened) {
      setForm({ ...defaultForm });
      setLines([]);
      setFetchError(null);
      setValidationErrors([]);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const [poRes, supplierRes, transporterRes] = await Promise.all([
          api.get<PoListApiResponse>('/api/inventory/purchase-order', {
            params: { page: 0, size: 200 }
          }),
          api.get('/api/supplier-view/dropdown'),
          api.get('/api/transporter/dropdown').catch(() => ({
            data: { data: [] }
          })),
        ]);

        setPoOptions(
          poRes.data.data.content.map(po => ({
            value: String(po.poRefNo),
            label: po.poNo
          }))
        );
        setSupplierOptions(supplierRes.data.data ?? []);
        setTransporterOptions(transporterRes.data.data ?? []);

        if (initialPoRefNo) {
          setForm(prev => ({
            ...prev,
            poRefNo: String(initialPoRefNo)
          }));

          // Load PO lines
          await loadPoLines(initialPoRefNo);


          // ── Fetch existing receipt header if already saved ────────────
          try {
            const receiptRes = await api.get(
              `/api/inventory/material-receipt/header/po/${initialPoRefNo}`,
              { params: { materialType: form.poType } } // ← pass poType if available
            );

            const header = receiptRes.data.data;

            if (header) {
              // ── Map header fields to form ─────────────────────────────
              setForm(prev => ({
                ...prev,
                poRefNo: String(initialPoRefNo),
                grnNo: header.grnNo ?? '',
                ircNo: header.ircNo ?? '',
                stnCommercialInvoiceNo: header.invoiceNo ?? '',
                invoiceDate: header.invoiceDate ?? '',
                modvatCopyNo: header.modvatCopyNo ?? '',
                sapPo: header.sapPo ?? '',
                lrNumber: header.lrNumber ?? '',
                supplierId: header.supplierId
                  ? String(header.supplierId)
                  : '',
                transporterId: header.transporterId
                  ? String(header.transporterId)
                  : null,
                dateTimeOfReceipt: header.receiptDateTime ?? '',
                actualDateTimeOfReceipt: header.actualReceiptDateTime ?? '',
                freight: header.freightRs ?? '',
              }));
            }
          } catch {
            // No existing receipt — form stays as default
            // This is not an error — just means no receipt saved yet
            console.info('No receipt found for PO:', initialPoRefNo);
            console.info(
              'No existing receipt for PO:',
              initialPoRefNo
            );
          }
        }

      } catch {
        setFetchError('Failed to load form data.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [opened]); // eslint-disable-line react-hooks/exhaustive-deps


  const loadPoLines = async (refNo: number) => {
    setLinesLoading(true);
    try {
      const [linesRes, headerRes] = await Promise.all([
        api.get<PoLineItemsApiResponse>(`/api/inventory/po-details/with-receipt/${refNo}`),
        api.get(`/api/inventory/purchase-order/${refNo}`),
      ]);
      const items = linesRes.data.data ?? [];
      const header = headerRes.data.data;
      const poDeliverySchedule = header?.poDeliverySchedule ?? null;

      setForm(prev => ({
        ...prev,
        poDate: header?.poDate ?? null,
        supplierId: header?.supplierId ? String(header.supplierId) : prev.supplierId,
        // ← pre-fill dateTimeOfReceipt from PO delivery schedule
        dateTimeOfReceipt: poDeliverySchedule ? new Date(poDeliverySchedule) : prev.dateTimeOfReceipt,
        poType: header?.poType ?? null
      }));

      setLines(items.map(item => ({
        poDetId: item.poDetId,
        poRmCode: item.poRmCode ?? '',
        poRmName: item.poRmName ?? '',
        poUom: item.poUom ?? '',

        // Order qty from PO
        rmOrderQty: Number(item.poQty) || 0,

        // Received qty — from receipt if exists else empty
        rmReceivedQty: item.rmReceivedQty != null
          ? String(item.rmReceivedQty)
          : '',

        // Tax fields — from receipt if exists else from PO
        sgst: item.sgst != null
          ? String(item.sgst)
          : '',
        cgst: item.cgst != null
          ? String(item.cgst)
          : '',
        igst: item.igst != null
          ? String(item.igst)
          : '',

        // Rate — handle both object and primitive
        receivedRate: item.poRate != null
          ? (typeof item.poRate === 'object'
            ? String(
              item.poRate.parsedValue
              ?? item.poRate.source
              ?? '')
            : String(item.poRate))
          : '',

        // Dates — from receipt if exists else from PO delivery schedule
        expectedDeliveryDate: item.expDateDel
          ? new Date(item.expDateDel)
          : poDeliverySchedule
            ? new Date(poDeliverySchedule)
            : null,

        actualDeliveryDate: item.actDateDel
          ? new Date(item.actDateDel)
          : form.actualDateTimeOfReceipt
            ? new Date(form.actualDateTimeOfReceipt)
            : null,

        // From receipt if exists else empty
        inspectedBy: item.inspectedBy ?? '',
        approvedBy: item.approvedBy ?? '',
        lotNumber: item.lotNumber ?? '',
      })));
    } catch {
      setFetchError('Failed to load PO line items.');
    } finally {
      setLinesLoading(false);
    }
  };


  // ── Form helpers ──────────────────────────────────────────────────────────

  const setStr = (field: keyof typeof defaultForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const setDate = (field: keyof typeof defaultForm) =>
    (value: DateValue) =>
      setForm(prev => ({ ...prev, [field]: value }));

  const setSelect = (field: keyof typeof defaultForm) =>
    (value: string | null) =>
      setForm(prev => ({ ...prev, [field]: value }));

  // ── Validation ────────────────────────────────────────────────────────────

  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!form.actualDateTimeOfReceipt) errors.push('Actual Date & Time of Receipt is required');
    if (!form.dateTimeOfReceipt) errors.push('Date & Time of Receipt is required');
    if (!form.supplierId) errors.push('Supplier Name is required');
    // if (!form.companyId)                    errors.push('Company is required');
    // if (!form.transporterId)                errors.push('Transporter is required');
    if (!form.stnCommercialInvoiceNo.trim()) errors.push('STN Commercial Invoice No. is required');
    if (!form.poRefNo) errors.push('PO Number is required');
    if (lines.length === 0) errors.push('No line items found for this PO');
    const hasReceived = lines.some(l => l.rmReceivedQty && parseFloat(l.rmReceivedQty) > 0);
    if (!hasReceived) errors.push('At least one line item must have Received Quantity > 0');
    return errors;
  };

  // In RawMaterialInwardReceipt — sync actualDeliveryDate when actualDateTimeOfReceipt changes
  useEffect(() => {
    if (!form.actualDateTimeOfReceipt || lines.length === 0) return;
    setLines(prev => prev.map(l => ({
      ...l,
      actualDeliveryDate: form.actualDateTimeOfReceipt,
    })));
  }, [form.actualDateTimeOfReceipt]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render ────────────────────────────────────────────────────────────────

  const safe = (val: string) => { const n = parseFloat(val); return isNaN(n) ? 0 : n; };
  const freightTaxOptions = useMemo(() => {
    const seen = new Set<string>();
    const opts: { value: string; label: string }[] = [
      { value: '', label: 'Inclusive of GST (no calc)' },
    ];
    lines.forEach(l => {
      const igst = safe(l.igst);
      const sgst = safe(l.sgst);
      const cgst = safe(l.cgst);
      if (igst > 0 && !seen.has(String(igst))) {
        seen.add(String(igst));
        opts.push({ value: String(igst), label: `IGST ${igst}%` });
      }
      if ((sgst > 0 || cgst > 0) && !seen.has(`${sgst}+${cgst}`)) {
        seen.add(`${sgst}+${cgst}`);
        opts.push({ value: String(sgst + cgst), label: `SGST ${sgst}% + CGST ${cgst}%` });
      }
    });
    return opts;
  }, [lines]);

  const freightAmt = safe(form.freight);
  const freightTaxPct = safe(form.freightTaxPct);
  const freightTaxAmt = form.freightTaxPct
    ? freightAmt * freightTaxPct / 100
    : 0;
  const freightTotal = freightAmt + freightTaxAmt;
  const linesTotalNett = lines
    .filter(l => l.rmReceivedQty && parseFloat(l.rmReceivedQty) > 0)
    .reduce((s, l) => {
      const qty = safe(l.rmReceivedQty);
      const rate = safe(l.receivedRate);
      const amt = qty * rate;
      const taxPct = safe(l.igst) > 0 ? safe(l.igst) : (safe(l.sgst) + safe(l.cgst));
      return s + amt + amt * taxPct / 100;
    }, 0);
  const grandTotal = linesTotalNett + freightTotal;


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

          {/* ── Shared FormHeader ── */}
          <FormHeader
            title={`${PO_TYPE_LABELS[form.poType ?? ''] ?? ''} Inward Receipt — PO: ${poOptions.find(p => p.value === form.poRefNo)?.label ?? '...'
              }${form.poDate ? ` | ${fmtDate(form.poDate)}` : ''}`}
            icon={<IconClipboardCheck size={18} color="white" />}
            color="#4a6fa5"
            onClose={onClose}
          />

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

              {/* ── Header fields: 3 per row ── */}
              {/* Each row: [label | input | label | input | label | input] */}
              {/* Grid columns=24: label=3, input=5 per field → 3×(3+5)=24 */}
              <Paper withBorder p="md" mb="md" radius="sm"
                style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <Grid columns={12} gutter="sm">

                  {/* ── Row 1: Actual Date | STN Invoice No | Invoice Date | Date & Time of Receipt ── */}
                  <Grid.Col span={3}>
                    <FormDatePicker label="* Actual Date & Time of Receipt" value={form.actualDateTimeOfReceipt} onChange={setDate('actualDateTimeOfReceipt')} required />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormTextInput label="* STN Commercial Invoice No." value={form.stnCommercialInvoiceNo} onChange={setStr('stnCommercialInvoiceNo')} placeholder="Enter invoice no" required />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormDatePicker label="Invoice Date" value={form.invoiceDate} onChange={setDate('invoiceDate')} />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormDatePicker label="* Date & Time of Receipt" value={form.dateTimeOfReceipt} onChange={setDate('dateTimeOfReceipt')} required />
                  </Grid.Col>

                  {/* ── Row 2: GRN No | IRC No | Modvat Copy No | SAP PO ── */}
                  <Grid.Col span={3}>
                    <FormTextInput label="GRN No." value={form.grnNo} onChange={setStr('grnNo')} placeholder="Auto / manual" />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormTextInput label="IRC No." value={form.ircNo} onChange={setStr('ircNo')} placeholder="" />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormTextInput label="Modvat Copy No." value={form.modvatCopyNo} onChange={setStr('modvatCopyNo')} placeholder="" />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormTextInput label="SAP PO" value={form.sapPo} onChange={setStr('sapPo')} placeholder="" />
                  </Grid.Col>

                  {/* ── Row 3: Supplier Name | Company | Transporter | L.R's Number ── */}
                  <Grid.Col span={3}>
                    <FormSelect label="* Supplier Name" value={form.supplierId} onChange={setSelect('supplierId')} data={supplierOptions} placeholder="--------Select----------" required searchable />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormSelect label="Transporter" value={form.transporterId} onChange={setSelect('transporterId')} data={transporterOptions} placeholder="--------Select----------" searchable />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormTextInput label="L.R's Number" value={form.lrNumber} onChange={setStr('lrNumber')} placeholder="" />
                  </Grid.Col>


                  {/* ── Row 4: Freight | Tax on Freight | Freight Total ── */}
                  <Grid.Col span={3}>
                    <FormTextInput
                      label="Other Charges / Freight"
                      value={form.freight}
                      onChange={setStr('freight')}
                      placeholder="0.00"
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormSelect
                      label="Tax on Freight"
                      value={form.freightTaxPct}
                      onChange={setSelect('freightTaxPct')}
                      data={freightTaxOptions}
                      placeholder="Inclusive of GST"
                    />
                  </Grid.Col>
                
                    <Grid.Col span={3}>
                    <FormTextInput
                      label="Freight Tax Amount"
                      value={freightTaxAmt > 0 ? freightTaxAmt.toFixed(2) : ''}
                      onChange={() => { }}
                      placeholder="—"
                      readOnly
                    />
                  </Grid.Col>
                    <Grid.Col span={3}>
                    <FormTextInput
                      label="Freight Total"
                      value={freightTotal > 0 ? freightTotal.toFixed(2) : ''}
                      onChange={() => { }}
                      placeholder="—"
                      readOnly
                    />
                  </Grid.Col>
                  <Grid.Col span={3} />

                </Grid>
              </Paper>

              {/* ── PO Receipt Line Items ── */}
              <Divider
                label={
                  <Group gap="xs">
                    <Text size="sm" fw={500}>PO Receipt</Text>
                    {lines.length > 0 && (
                      <Badge size="xs" variant="light" color="blue">
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
                <InwardReceiptLineTable
                  lines={lines}
                  onChange={setLines}
                  loading={false}
                />
              )}

              {lines.length === 0 && !linesLoading && (
                <Text size="sm" c="dimmed" ta="center" py="xl">
                  {form.poRefNo
                    ? 'No line items found for this PO.'
                    : 'Select a PO Number to load line items.'}
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
              <Stack gap={2}>
                <Text size="xs" c="dimmed">
                  {lines.length > 0
                    ? `${lines.filter(l => l.rmReceivedQty && parseFloat(l.rmReceivedQty) > 0).length} of ${lines.length} items with received qty`
                    : 'No items loaded'}
                  {freightAmt > 0
                    ? ` | Freight: ₹${freightTotal.toFixed(2)}${form.freightTaxPct ? ` (tax @ ${freightTaxPct}%)` : ' (incl. GST)'}`
                    : ''}
                </Text>
                {grandTotal > 0 && (
                  <Text size="xs" fw={700} c="blue">
                    Grand Total (Lines + Freight): ₹{grandTotal.toFixed(2)}
                  </Text>
                )}
              </Stack>
              <Group gap="sm">
                <Button variant="light" size="sm" color="red" onClick={onClose}>Cancel</Button>
                <Button variant="light" size="sm"
                  disabled={lines.length === 0}
                  onClick={() => { setValidationErrors(validateForm()); setConfirmOpen(true); }}>
                  Close PO
                </Button>
                <Button size="sm" color="blue"
                  disabled={lines.length === 0}
                  onClick={() => { setValidationErrors(validateForm()); setConfirmOpen(true); }}>
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
          onSave?.({ ...form, lines });
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