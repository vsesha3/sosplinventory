/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button,
  Grid, Badge, Stack, Loader, Center, Divider,
} from '@mantine/core';
import { IconClipboardCheck } from '@tabler/icons-react';
import type { DateValue } from '@mantine/dates';
import { FormTextInput }  from '../../components/common/FormTextInput';
import { FormSelect }     from '../../components/common/FormSelect';
import { FormDatePicker } from '../../components/common/FormDatePicker';
import { ConfirmDialog }  from '../../components/common/ConfirmDialog';
import FormHeader         from '../common/Formheader';
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
  poNo:    string;
  poDate:  string;
}

interface PoListApiResponse {
  success: boolean;
  message: string;
  data: {
    content:       PoListItem[];
    totalElements: number;
    totalPages:    number;
  };
}

interface PoLineItemDetail {
  poDetId:       number;
  poRefNo:       number;
  poRmCode:      string;
  poRmName:      string;
  poQty:         number | null;
  poUom:         string | null;
  poNoOfPacks:   number | null;
  poPackSize:    number | null;
  sgst:          any | null;
  cgst:          any | null;
  igst:          any | null;
  poRate:        any | null;
  rmRcvdQty:      number | null;
  expDateDel:    string | null;
  actDateDel:    string | null;
  inspectedBy:   string | null;
  approvedBy:    string | null;
  lotNumber:     string | null;
}

interface PoLineItemsApiResponse {
  success: boolean;
  message: string;
  data:    PoLineItemDetail[];
}

// ── Form Data ─────────────────────────────────────────────────────────────────

export interface InwardReceiptFormData {
  actualDateTimeOfReceipt: DateValue;
  dateTimeOfReceipt:       DateValue;
  grnNo:                   string;
  ircNo:                   string;
  supplierId:              string | null;
  transporterId:           string | null;
  stnCommercialInvoiceNo:  string;
  invoiceDate:             DateValue;
  modvatCopyNo:            string;
  sapPo:                   string;
  lrNumber:                string;
  poRefNo:                 string | null;
  poDate:                  string | null;
  lines:                   InwardReceiptLine[];
  poType:                  string | null;
  freight:                 string;
  freightTaxPct:           string;
  receiptDetId?:            number | null;
}

export interface RawMaterialInwardReceiptProps {
  opened:        boolean;
  onClose:       () => void;
  onSave?:       (data: InwardReceiptFormData) => void;
  poRefNo?:      number | null;   // always passed — used in both modes
  poNo?:         string | null;
  receiptDetId?: number | null;   // null = Add mode, set = Edit mode
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const defaultForm = {
  actualDateTimeOfReceipt: null as DateValue,
  dateTimeOfReceipt:       null as DateValue,
  grnNo:                   '',
  ircNo:                   '',
  supplierId:              null as string | null,
  transporterId:           null as string | null,
  stnCommercialInvoiceNo:  '',
  invoiceDate:             null as DateValue,
  modvatCopyNo:            '',
  sapPo:                   '',
  lrNumber:                '',
  poRefNo:                 null as string | null,
  poDate:                  null as string | null,
  poType:                  null as string | null,
  materialDetId:           null as number | null,
  freight:                 '',
  freightTaxPct:           '' as string,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (val: string | null): string => {
  if (!val) return '';
  try {
    return new Date(val).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return val; }
};

const safe = (val: string): number => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

// ── Component ─────────────────────────────────────────────────────────────────

const RawMaterialInwardReceipt: React.FC<RawMaterialInwardReceiptProps> = ({
  opened,
  onClose,
  onSave,
  poRefNo:      initialPoRefNo      = null,
  poNo:         initialPoNo         = null,
  receiptDetId: initialReceiptDetId = null,
}) => {

  const isEditMode = !!initialReceiptDetId;

  const [form, setForm]           = useState({ ...defaultForm });
  const [lines, setLines]         = useState<InwardReceiptLine[]>([]);
  const [loading, setLoading]     = useState(false);
  const [linesLoading, setLinesLoading]         = useState(false);
  const [fetchError, setFetchError]             = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen]           = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [supplierOptions, setSupplierOptions]   = useState<DropDownOption[]>([]);
  const [transporterOptions, setTransporterOptions] = useState<DropDownOption[]>([]);

  // ── Load shared dropdowns ─────────────────────────────────────────────────

  const loadDropdowns = async () => {
    const [supplierRes, transporterRes] = await Promise.all([
      api.get('/api/supplier-view/dropdown'),
      api.get('/api/transporter/dropdown').catch(() => ({ data: { data: [] } })),
    ]);
    setSupplierOptions(supplierRes.data.data ?? []);
    setTransporterOptions(transporterRes.data.data ?? []);
  };

  // ── ADD MODE: load PO header + fresh PO lines (empty received fields) ─────

  const loadForAdd = async (poRefNo: number) => {
    const [linesRes, headerRes] = await Promise.all([
      api.get<PoLineItemsApiResponse>(`/api/inventory/po-details/with-receipt/${poRefNo}`),
      api.get(`/api/inventory/purchase-order/${poRefNo}`),
    ]);

    const items              = linesRes.data.data ?? [];
    const header             = headerRes.data.data;
    const poDeliverySchedule = header?.poDeliverySchedule ?? null;

    // Populate only PO-level header fields — leave receipt fields empty
    setForm(prev => ({
      ...defaultForm,                          // ← always start fresh for Add
      poRefNo:    String(poRefNo),
      poDate:     header?.poDate     ?? null,
      poType:     header?.poType     ?? null,
      supplierId: header?.supplierId ? String(header.supplierId) : null,
      dateTimeOfReceipt: poDeliverySchedule
        ? new Date(poDeliverySchedule)
        : null,
    }));

    // Load PO lines with empty received fields
    setLines(items.map(item => ({
      poDetId:      item.poDetId,
      poRmCode:     item.poRmCode  ?? '',
      poRmName:     item.poRmName  ?? '',
      poUom:        item.poUom     ?? '',
      rmOrderQty:   Number(item.poQty) || 0,
      // ── Receipt fields all empty for new receipt ──
      rmReceivedQty:        item.rmRcvdQty != null ? String(item.rmRcvdQty) : '',
      receivedRate:         item.poRate != null
        ? (typeof item.poRate === 'object'
          ? String(item.poRate.parsedValue ?? item.poRate.source ?? '')
          : String(item.poRate))
        : '',
      sgst:                 item.sgst != null ? String(item.sgst) : '',
      cgst:                 item.cgst != null ? String(item.cgst) : '',
      igst:                 item.igst != null ? String(item.igst) : '',
      expectedDeliveryDate: item.expDateDel
        ? new Date(item.expDateDel)
        : poDeliverySchedule ? new Date(poDeliverySchedule) : null,
      actualDeliveryDate:   null,   // ← empty for new receipt
      inspectedBy:          '',
      approvedBy:           '',
      lotNumber:            '',
    })));
  };

  // ── EDIT MODE: load existing receipt header + its RM lines ────────────────

  const loadForEdit = async (receiptDetId: number) => {
    const [rmRes, headerRes] = await Promise.all([
      api.get(`/api/inventory/material-receipt/rmlist/${receiptDetId}`),
      api.get(`/api/inventory/material-receipt/${receiptDetId}`),
    ]);

    const rmItems = Array.isArray(rmRes.data?.data)
      ? rmRes.data.data
      : Array.isArray(rmRes.data) ? rmRes.data : [];

    const header = headerRes.data?.data ?? headerRes.data ?? {};

    // Populate all receipt header fields from existing receipt
    setForm(prev => ({
      ...defaultForm,
      poRefNo:                 header.poRefNo
        ? String(header.poRefNo) : (initialPoRefNo ? String(initialPoRefNo) : null),
      poDate:                  header.poDate             ?? null,
      poType:                  header.poType             ?? null,
      grnNo:                   header.grnNo              ?? '',
      ircNo:                   header.ircNo              ?? '',
      stnCommercialInvoiceNo:  header.invoiceNo          ?? '',
      invoiceDate:             header.invoiceDate
        ? new Date(header.invoiceDate) : null,
      modvatCopyNo:            header.modvatCopyNo       ?? '',
      sapPo:                   header.sapPo              ?? '',
      lrNumber:                header.lrNumber           ?? '',
      supplierId:              header.supplierId
        ? String(header.supplierId) : null,
      transporterId:           header.transporterId
        ? String(header.transporterId) : null,
      dateTimeOfReceipt:       header.receiptDateTime
        ? new Date(header.receiptDateTime) : null,
      actualDateTimeOfReceipt: header.actualReceiptDateTime
        ? new Date(header.actualReceiptDateTime) : null,
      freight:                 header.freightRs          ?? '',
      freightTaxPct:           header.freightTaxPct      ?? '',
      receiptDetId:            header.receiptDetId       ?? null,
    }));

    // Populate RM lines from existing receipt
    setLines(rmItems.map((item: any) => ({
      poDetId:              item.receiptId    ?? item.poDetId      ?? 0,
      poRmCode:             item.poRmCode     ?? '',
      poRmName:             item.poRmName     ?? '',
      poUom:                item.poUom        ?? '',
      rmOrderQty:           Number(item.rmOrderQty ?? item.noOfReceived ?? 0),
      rmReceivedQty:        item.noOfReceived != null ? String(item.noOfReceived)  : '',
      receivedRate:         item.perUnitRate  != null ? String(item.perUnitRate)   : '',
      sgst:                 item.sgst         != null ? String(item.sgst)          : '',
      cgst:                 item.cgst         != null ? String(item.cgst)          : '',
      igst:                 item.igst         != null ? String(item.igst)          : '',
      expectedDeliveryDate: item.expectedDeliveryDate
        ? new Date(item.expectedDeliveryDate) : null,
      actualDeliveryDate:   item.actualDeliveryDate
        ? new Date(item.actualDeliveryDate) : null,
      inspectedBy:          item.inspectedBy  ?? '',
      approvedBy:           item.approvedBy   ?? '',
      lotNumber:            item.lotNumber    ?? '',
    })));
  };

  // ── Main useEffect ────────────────────────────────────────────────────────

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
      setLinesLoading(true);
      try {
        await loadDropdowns();

        if (isEditMode && initialReceiptDetId) {
          // ── Edit: fetch existing receipt header + RM lines ────────────
          await loadForEdit(initialReceiptDetId);
        } else if (initialPoRefNo) {
          // ── Add: fetch PO header + fresh PO lines (empty receipt fields)
          await loadForAdd(initialPoRefNo);
        }
      } catch {
        setFetchError('Failed to load data. Please close and try again.');
      } finally {
        setLoading(false);
        setLinesLoading(false);
      }
    };

    load();
  }, [opened]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync actualDeliveryDate when actualDateTimeOfReceipt changes ──────────

  useEffect(() => {
    if (!form.actualDateTimeOfReceipt || lines.length === 0) return;
    setLines(prev => prev.map(l => ({
      ...l,
      actualDeliveryDate: form.actualDateTimeOfReceipt,
    })));
  }, [form.actualDateTimeOfReceipt]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (!form.actualDateTimeOfReceipt)       errors.push('Actual Date & Time of Receipt is required');
    if (!form.dateTimeOfReceipt)             errors.push('Date & Time of Receipt is required');
    if (!form.supplierId)                    errors.push('Supplier Name is required');
    if (!form.stnCommercialInvoiceNo.trim()) errors.push('STN Commercial Invoice No. is required');
    if (!form.poRefNo)                       errors.push('PO Number is required');
    if (lines.length === 0)                  errors.push('No line items found');
    const hasReceived = lines.some(l => l.rmReceivedQty && parseFloat(l.rmReceivedQty) > 0);
    if (!hasReceived) errors.push('At least one line item must have Received Quantity > 0');
    return errors;
  };

  // ── Freight calculations ──────────────────────────────────────────────────

  const freightTaxOptions = useMemo(() => {
    const seen = new Set<string>();
    const opts: DropDownOption[] = [
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

  const freightAmt    = safe(form.freight);
  const freightTaxPct = safe(form.freightTaxPct);
  const freightTaxAmt = form.freightTaxPct ? freightAmt * freightTaxPct / 100 : 0;
  const freightTotal  = freightAmt + freightTaxAmt;

  const linesTotalNett = lines
    .filter(l => l.rmReceivedQty && parseFloat(l.rmReceivedQty) > 0)
    .reduce((s, l) => {
      const qty    = safe(l.rmReceivedQty);
      const rate   = safe(l.receivedRate);
      const amt    = qty * rate;
      const taxPct = safe(l.igst) > 0 ? safe(l.igst) : (safe(l.sgst) + safe(l.cgst));
      return s + amt + amt * taxPct / 100;
    }, 0);

  const grandTotal = linesTotalNett + freightTotal;

  // ── Title ─────────────────────────────────────────────────────────────────

  const poLabel      = initialPoNo ?? `Ref #${initialPoRefNo}`;
  const headerTitle  = `${PO_TYPE_LABELS[form.poType ?? ''] ?? ''} ${
    isEditMode ? `Edit Receipt #${initialReceiptDetId}` : 'New Inward Receipt'
  } — PO: ${poLabel}${form.poDate ? ` | ${fmtDate(form.poDate)}` : ''}`;

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
        zIndex={300}
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
          <FormHeader
            title={headerTitle}
            icon={<IconClipboardCheck size={18} color="white" />}
            color="#4a6fa5"
            badge={isEditMode ? 'Edit Mode' : 'New Receipt'}
            badgeColor={isEditMode ? 'orange' : 'green'}
            onClose={onClose}
          />

          {/* ── Body ── */}
          {loading ? (
            <Center py={80} style={{ flex: 1 }}>
              <Stack align="center" gap="sm">
                <Loader size="md" />
                <Text size="sm" c="dimmed">
                  {isEditMode ? 'Loading receipt...' : 'Loading PO details...'}
                </Text>
              </Stack>
            </Center>
          ) : (
            <Box style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }} p="lg">

              {fetchError && <Text size="xs" c="red" mb="sm">{fetchError}</Text>}

              <Paper withBorder p="md" mb="md" radius="sm"
                style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <Grid columns={12} gutter="sm">

                  {/* ── Row 1: Actual Date | STN Invoice No | Invoice Date | Date & Time of Receipt ── */}
                  <Grid.Col span={3}>
                    <FormDatePicker
                      label="* Actual Date & Time of Receipt"
                      value={form.actualDateTimeOfReceipt}
                      onChange={setDate('actualDateTimeOfReceipt')}
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormTextInput
                      label="* STN Commercial Invoice No."
                      value={form.stnCommercialInvoiceNo}
                      onChange={setStr('stnCommercialInvoiceNo')}
                      placeholder="Enter invoice no"
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormDatePicker
                      label="Invoice Date"
                      value={form.invoiceDate}
                      onChange={setDate('invoiceDate')}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormDatePicker
                      label="* Date & Time of Receipt"
                      value={form.dateTimeOfReceipt}
                      onChange={setDate('dateTimeOfReceipt')}
                      required
                    />
                  </Grid.Col>

                  {/* ── Row 2: GRN No | IRC No | Modvat Copy No | SAP PO ── */}
                  <Grid.Col span={3}>
                    <FormTextInput
                      label="GRN No."
                      value={form.grnNo}
                      onChange={setStr('grnNo')}
                      placeholder="Auto / manual"
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormTextInput
                      label="IRC No."
                      value={form.ircNo}
                      onChange={setStr('ircNo')}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormTextInput
                      label="Modvat Copy No."
                      value={form.modvatCopyNo}
                      onChange={setStr('modvatCopyNo')}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormTextInput
                      label="SAP PO"
                      value={form.sapPo}
                      onChange={setStr('sapPo')}
                    />
                  </Grid.Col>

                  {/* ── Row 3: Supplier Name | Transporter | L.R's Number | empty ── */}
                  <Grid.Col span={3}>
                    <FormSelect
                      label="* Supplier Name"
                      value={form.supplierId}
                      onChange={setSelect('supplierId')}
                      data={supplierOptions}
                      placeholder="--------Select----------"
                      required
                      searchable
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormSelect
                      label="Transporter"
                      value={form.transporterId}
                      onChange={setSelect('transporterId')}
                      data={transporterOptions}
                      placeholder="--------Select----------"
                      searchable
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormTextInput
                      label="L.R's Number"
                      value={form.lrNumber}
                      onChange={setStr('lrNumber')}
                    />
                  </Grid.Col>
                  <Grid.Col span={3} />

                  {/* ── Row 4: Freight | Tax on Freight | Freight Tax Amt | Freight Total ── */}
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
                      onChange={() => {}}
                      placeholder="—"
                      readOnly
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormTextInput
                      label="Freight Total"
                      value={freightTotal > 0 ? freightTotal.toFixed(2) : ''}
                      onChange={() => {}}
                      placeholder="—"
                      readOnly
                    />
                  </Grid.Col>

                </Grid>
              </Paper>

              {/* ── Line Items ── */}
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
                  No line items found.
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
                <Button variant="light" size="sm" color="red" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="light" size="sm"
                  disabled={lines.length === 0}
                  onClick={() => { setValidationErrors(validateForm()); setConfirmOpen(true); }}>
                  Close PO
                </Button>
                <Button size="sm" color="blue"
                  disabled={lines.length === 0}
                  onClick={() => { setValidationErrors(validateForm()); setConfirmOpen(true); }}>
                  {isEditMode ? 'Update' : 'Submit'}
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
        message={`Are you sure you want to ${isEditMode ? 'update' : 'submit'} this inward receipt?`}
        confirmLabel={isEditMode ? 'Update' : 'Submit'}
        errors={validationErrors}
        zIndex={350}
      />
    </>
  );
};

export default RawMaterialInwardReceipt;