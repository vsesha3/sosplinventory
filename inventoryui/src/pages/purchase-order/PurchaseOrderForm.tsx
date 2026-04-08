/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
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
import type { PurchaseOrderFormData, PoLineItem } from '../../types/api.types';

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
  freight: number | null;
  freightGst: string | null;
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

interface PoLineItemsApiResponse {
  success: boolean;
  message: string;
  data: PoLineItem[];
}

interface ReferenceNumberResponse {
  referenceNumber: string;
}

// ── Form Types ────────────────────────────────────────────────────────────────

export interface PurchaseOrderFormProps {
  initialData?: Partial<PurchaseOrderFormData>;
  poTypeOptions?: DropDownOption[];
  supplierOptions?: DropDownOption[];
  onSave?: (data: PurchaseOrderFormData, lineItems: PoLineItem[]) => void;
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
  freight: '',
  freightGst: '',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const pv = (field: DecimalField | number | null | undefined, decimals = 2): string => {
  if (field == null) return '—';
  if (typeof field === 'number') return isNaN(field) ? '—' : field.toFixed(decimals);
  if (field.parsedValue == null) return field.source ?? '—';
  return field.parsedValue.toFixed(decimals);
};

const dash = (val: string | null | undefined): string =>
  val && val.trim() ? val : '—';

const safe = (val: string | null | undefined): number => {
  const n = parseFloat(val ?? '');
  return isNaN(n) ? 0 : n;
};

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
  const [lineItems, setLineItems]         = useState<PoLineItem[]>([]);
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [formLoading, setFormLoading]     = useState(false);
  const [fetchError, setFetchError]       = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen]     = useState(false);
  const [lineItemOpen, setLineItemOpen]   = useState(false);
  const [editLineItem, setEditLineItem]   = useState<Partial<POLineItemData> | undefined>();
  const [lineItemMode, setLineItemMode]   = useState<'create' | 'edit'>('create');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
      freight:            apiData.freight != null ? String(apiData.freight) : '',
      freightGst:         apiData.freightGst ?? '',
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
    if (!opened) {
      setForm({ ...defaultForm });
      setLineItems([]);
      setSelectedLines([]);
      setValidationErrors([]);
      setFetchError(null);
      return;
    }
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

  // ── Per-item computation ──────────────────────────────────────────────────

  const numVal = (field: DecimalField | null | undefined | number): number => {
    if (field == null) return 0;
    if (typeof field === 'number') return isNaN(field) ? 0 : field;
    if (field.parsedValue != null && !isNaN(field.parsedValue)) return field.parsedValue;
    const parsed = parseFloat(field.source);
    return isNaN(parsed) ? 0 : parsed;
  };

  const computeLine = (item: PoLineItem) => {
    const qty       = numVal(item.poQty);
    const rate      = numVal(item.poRate);
    const sgst      = numVal(item.sgst);
    const cgst      = numVal(item.cgst);
    const igst      = numVal(item.igst);
    const amount    = qty * rate;
    const taxPct    = igst > 0 ? igst : (sgst + cgst);
    const taxAmount = amount * taxPct / 100;
    const lineTotal = amount + taxAmount;
    return { qty, rate, amount, sgst, cgst, igst, taxAmount, lineTotal };
  };

  // ── Freight GST dropdown — built from line item tax rates ─────────────────
  // Same pattern as RawMaterialInwardReceipt freightTaxOptions
  const freightTaxOptions = useMemo(() => {
    const seen = new Set<string>();
    const opts: DropDownOption[] = [
      { value: '', label: 'Inclusive of GST (no calc)' },
    ];
    lineItems.forEach(item => {
      const igst = numVal(item.igst);
      const sgst = numVal(item.sgst);
      const cgst = numVal(item.cgst);
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
  }, [lineItems]);

  // ── Freight calculations ──────────────────────────────────────────────────
  const freightAmt    = safe(form.freight);
  const freightTaxPct = safe(form.freightGst);
  const freightTaxAmt = form.freightGst ? freightAmt * freightTaxPct / 100 : 0;
  const freightTotal  = freightAmt + freightTaxAmt;

  // ── Line totals ───────────────────────────────────────────────────────────

  const totalAmount = lineItems.reduce((s, i) => s + computeLine(i).amount, 0);
  const totalSgst   = lineItems.reduce((s, i) => {
    const c = computeLine(i);
    return s + (c.igst > 0 ? 0 : c.amount * c.sgst / 100);
  }, 0);
  const totalCgst   = lineItems.reduce((s, i) => {
    const c = computeLine(i);
    return s + (c.igst > 0 ? 0 : c.amount * c.cgst / 100);
  }, 0);
  const totalIgst   = lineItems.reduce((s, i) => {
    const c = computeLine(i);
    return s + (c.igst > 0 ? c.amount * c.igst / 100 : 0);
  }, 0);
  const totalTax    = totalSgst + totalCgst + totalIgst;
  const grandTotal  = lineItems.reduce((s, i) => s + computeLine(i).lineTotal, 0) + freightTotal;

  const hasIgst     = lineItems.some(i => numVal(i.igst)  > 0);
  const hasSgstCgst = lineItems.some(i => numVal(i.sgst) > 0 || numVal(i.cgst) > 0);
  const hasTax      = hasIgst || hasSgstCgst;

  // ── Active columns ────────────────────────────────────────────────────────

  const LINE_ITEM_COLUMNS_ACTIVE: ColumnDef[] = [
    { key: 'poRmCode',    label: 'RM Code',     width: 110 },
    { key: 'poRmName',    label: 'RM Name',     width: 180 },
    { key: 'poQty',       label: 'Qty',         width: 90,  align: 'right' },
    { key: 'poRate',      label: 'Rate',        width: 90,  align: 'right' },
    { key: 'amount',      label: 'Sub Total',   width: 110, align: 'right' },
    { key: 'poNoOfPacks', label: 'Packs',       width: 80,  align: 'right' },
    { key: 'poPackSize',  label: 'Pack Size',   width: 90,  align: 'right' },
    ...(hasSgstCgst && !hasIgst ? [
      { key: 'sgst', label: 'SGST %', width: 75, align: 'right' as const },
      { key: 'cgst', label: 'CGST %', width: 75, align: 'right' as const },
    ] : []),
    ...(hasIgst ? [
      { key: 'igst', label: 'IGST %', width: 75, align: 'right' as const },
    ] : []),
    ...(hasTax ? [
      { key: 'taxAmount', label: 'Tax Amt', width: 100, align: 'right' as const },
    ] : []),
    { key: 'lineTotal',   label: 'Nett Amount', width: 110, align: 'right' },
  ];

  const TOTAL_COLS      = LINE_ITEM_COLUMNS_ACTIVE.length + 1;
  const COLS_BEFORE_TAX = 10;
  const COLS_AFTER_TAX  = hasTax ? 2 : 1;
  const TAX_COLS        = TOTAL_COLS - COLS_BEFORE_TAX - COLS_AFTER_TAX;

  // ── Validation ────────────────────────────────────────────────────────────

  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!form.poDate)      errors.push('PO Date is required');
    if (!form.poType)      errors.push('PO Type is required');
    if (!form.supplierId)  errors.push('Supplier Name is required');
    if (!form.poNo)        errors.push('PO Number is required — please select a PO Type first');
    if (!form.requestedBy) errors.push('Requested By is required');
    return errors;
  };

  const getSource = (field: DecimalField | number | null | undefined): string => {
    if (field == null) return '';
    if (typeof field === 'number') return isNaN(field) ? '' : String(field);
    return field.source ?? '';
  };

  // ── Build rows ────────────────────────────────────────────────────────────

  const lineItemRows = lineItems.map((item) => {
    const isSel = selectedLines.includes(item.poDetId);
    const { amount, taxAmount, lineTotal } = computeLine(item);
    return (
      <Table.Tr key={item.poDetId} bg={isSel ? 'var(--mantine-color-blue-0)' : undefined}>
        <Table.Td>
          <input type="checkbox" checked={isSel} onChange={() => toggleLine(item.poDetId)} />
        </Table.Td>
        <Table.Td fw={500}>{item.poRmCode}</Table.Td>
        <Table.Td>{item.poRmName}</Table.Td>
        <Table.Td ta="right">{pv(item.poQty, 3)} {dash(item.poUom)}</Table.Td>
        <Table.Td ta="right">{pv(item.poRate, 2)}</Table.Td>
        <Table.Td ta="right">{amount.toFixed(2)}</Table.Td>
        <Table.Td ta="right">{pv(item.poNoOfPacks, 0)}</Table.Td>
        <Table.Td ta="right">{pv(item.poPackSize, 3)}</Table.Td>
        {hasSgstCgst && !hasIgst && <Table.Td ta="right">{pv(item.sgst, 2)}</Table.Td>}
        {hasSgstCgst && !hasIgst && <Table.Td ta="right">{pv(item.cgst, 2)}</Table.Td>}
        {hasIgst     &&             <Table.Td ta="right">{pv(item.igst, 2)}</Table.Td>}
        {hasTax      &&             <Table.Td ta="right">{taxAmount.toFixed(2)}</Table.Td>}
        <Table.Td ta="right" fw={600}>{lineTotal.toFixed(2)}</Table.Td>
      </Table.Tr>
    );
  });

  // ── Footer ────────────────────────────────────────────────────────────────

  const ftrLabelCell = (label: string, sub?: string) => (
    <Table.Td colSpan={COLS_BEFORE_TAX} ta="right" style={{ paddingRight: 8 }}>
      <Text size="xs" fw={600}>{label}</Text>
      {sub && <Text size="xs" c="dimmed">{sub}</Text>}
    </Table.Td>
  );

  const ftrEmpty = () => Array.from({ length: TAX_COLS }).map((_, i) => (
    <Table.Td key={i} />
  ));

  const ftrTaxCells = (taxValue: number, color: string) => (
    <>
      {Array.from({ length: TAX_COLS }).map((_, i) => (
        <Table.Td key={i} ta="right">
          {i === TAX_COLS - 1
            ? <Text size="xs" fw={600} c={color}>{taxValue.toFixed(2)}</Text>
            : null}
        </Table.Td>
      ))}
    </>
  );

  const lineItemFooter = lineItems.length > 0 ? (
    <Table.Tfoot>

      {/* Sub Total */}
      <Table.Tr style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
        {ftrLabelCell('Sub Total', `${lineItems.length} item${lineItems.length !== 1 ? 's' : ''}`)}
        {ftrEmpty()}
        {hasTax && <Table.Td />}
        <Table.Td ta="right">
          <Text size="xs" fw={700}>{totalAmount.toFixed(2)}</Text>
        </Table.Td>
      </Table.Tr>

      {/* SGST */}
      {hasSgstCgst && !hasIgst && (
        <Table.Tr style={{ backgroundColor: 'var(--mantine-color-orange-0)' }}>
          {ftrLabelCell('SGST')}
          {ftrEmpty()}
          <Table.Td ta="right">
            <Text size="xs" fw={600} c="orange">{totalSgst.toFixed(2)}</Text>
          </Table.Td>
          <Table.Td />
        </Table.Tr>
      )}

      {/* CGST */}
      {hasSgstCgst && !hasIgst && (
        <Table.Tr style={{ backgroundColor: 'var(--mantine-color-orange-0)' }}>
          {ftrLabelCell('CGST')}
          {ftrEmpty()}
          <Table.Td ta="right">
            <Text size="xs" fw={600} c="orange">{totalCgst.toFixed(2)}</Text>
          </Table.Td>
          <Table.Td />
        </Table.Tr>
      )}

      {/* IGST */}
      {hasIgst && (
        <Table.Tr style={{ backgroundColor: 'var(--mantine-color-violet-0)' }}>
          {ftrLabelCell('IGST')}
          {ftrTaxCells(totalIgst, 'violet')}
          <Table.Td ta="right">
            <Text size="xs" fw={600} c="violet">{totalIgst.toFixed(2)}</Text>
          </Table.Td>
          <Table.Td />
        </Table.Tr>
      )}

      {/* ── Freight row — only shown when freight is entered ── */}
      {freightAmt > 0 && (
        <Table.Tr style={{ backgroundColor: 'var(--mantine-color-teal-0)' }}>
          {ftrLabelCell(
            'Freight / Other Charges',
            form.freightGst
              ? `Tax @ ${freightTaxPct}% = ₹${freightTaxAmt.toFixed(2)}`
              : 'Inclusive of GST'
          )}
          {ftrEmpty()}
          {hasTax && (
            <Table.Td ta="right">
              {freightTaxAmt > 0 && (
                <Text size="xs" fw={600} c="teal">{freightTaxAmt.toFixed(2)}</Text>
              )}
            </Table.Td>
          )}
          <Table.Td ta="right">
            <Text size="xs" fw={600} c="teal">{freightTotal.toFixed(2)}</Text>
          </Table.Td>
        </Table.Tr>
      )}

      {/* Grand Total — includes freight */}
      <Table.Tr style={{ backgroundColor: 'var(--mantine-color-blue-1)' }}>
        {ftrLabelCell('Grand Total')}
        {ftrEmpty()}
        {hasTax && (
          <Table.Td ta="right">
            <Text size="xs" fw={700}>{(totalTax + freightTaxAmt).toFixed(2)}</Text>
          </Table.Td>
        )}
        <Table.Td ta="right">
          <Text size="xs" fw={700} c="blue">{grandTotal.toFixed(2)}</Text>
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
              poRmCode:    data.poRmCode    ?? '',
              poRmName:    data.poRmName    ?? '',
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
        poRmCode:    data.poRmCode    ?? '',
        poRmName:    data.poRmName    ?? '',
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
              <Badge variant="filled" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                PO Ref # {form.poRefNo}
              </Badge>
            )}
          </Group>
          <Button size="xs" variant="white" color="dark" leftSection={<IconPrinter size={14} />} onClick={onPrint}>
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

            {fetchError && <Text size="xs" c="red" mb="sm">{fetchError}</Text>}

            {/* ── Row 1: PO Date | PO Type | Supplier Name | PO Number | Delivery Schedule ── */}
            <Grid columns={20} gutter="md" mb="md">
              <Grid.Col span={4}>
                <FormDatePicker label="PO Date" value={form.poDate} onChange={setDate('poDate')} required readOnly={readOnly} />
              </Grid.Col>
              <Grid.Col span={4}>
                <FormSelect label="PO Type" value={form.poType} onChange={handlePoTypeChange} data={poTypeOptions} placeholder="Select type" required readOnly={readOnly || mode === 'update'} />
              </Grid.Col>
              <Grid.Col span={4}>
                <FormSelect label="Supplier Name" value={form.supplierId} onChange={set('supplierId')} data={dropdowns.supplierOptions} placeholder="Select supplier" required searchable readOnly={readOnly} />
              </Grid.Col>
              <Grid.Col span={4}>
                <FormTextInput label="PO Number" value={form.poNo} onChange={setStr('poNo')} placeholder="e.g. RM/694/2025-2026" required readOnly={true} />
              </Grid.Col>
              <Grid.Col span={4}>
                <FormDatePicker label="Delivery Schedule" value={form.poDeliverySchedule} onChange={setDate('poDeliverySchedule')} required readOnly={readOnly} />
              </Grid.Col>
            </Grid>

            {/* ── Row 2: Kind Attention | Payment Terms | Delivery Terms | PO Reference | Requested By ── */}
            <Grid columns={20} gutter="md" mb="md">
              <Grid.Col span={4}>
                <FormTextInput label="Kind Attention" value={form.poKindAttention} onChange={setStr('poKindAttention')} placeholder="Attention name" readOnly={readOnly} />
              </Grid.Col>
              <Grid.Col span={4}>
                <FormTextInput label="PO Payment Terms" value={form.poPaymentTerms} onChange={setStr('poPaymentTerms')} placeholder="e.g. 60 days" readOnly={readOnly} />
              </Grid.Col>
              <Grid.Col span={4}>
                <FormTextInput label="Delivery Terms" value={form.poDeliveryTerms} onChange={setStr('poDeliveryTerms')} placeholder="e.g. Door delivery" readOnly={readOnly} />
              </Grid.Col>
              <Grid.Col span={4}>
                <FormTextInput label="PO Reference" value={form.poReference} onChange={setStr('poReference')} placeholder="e.g. teleconversation" readOnly={readOnly} />
              </Grid.Col>
              <Grid.Col span={4}>
                <FormSelect label="Requested By" value={form.requestedBy} onChange={set('requestedBy')} data={dropdowns.employeeOptions} placeholder="Select employee" searchable readOnly={readOnly} />
              </Grid.Col>
            </Grid>

            {/* ── Row 3: Remarks | Freight Amount | Freight GST | GST Amount | Freight Total ── */}
            <Grid columns={20} gutter="md" mb="lg">
              <Grid.Col span={10}>
                <FormTextarea label="Remarks" value={form.poRemarks} onChange={setStr('poRemarks')} placeholder="Enter any remarks..." minRows={2} readOnly={readOnly} />
              </Grid.Col>
              <Grid.Col span={3}>
                <FormTextInput
                  label="Freight / Other Charges"
                  value={form.freight ?? ''}
                  onChange={setStr('freight')}
                  placeholder="0.00"
                  readOnly={readOnly}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <FormSelect
                  label="Freight GST"
                  value={form.freightGst ?? ''}
                  onChange={set('freightGst')}
                  data={freightTaxOptions}
                  placeholder="Incl. GST"
                  readOnly={readOnly}
                  disabled={lineItems.length === 0}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <FormTextInput
                  label="GST Amount"
                  value={freightTaxAmt > 0 ? freightTaxAmt.toFixed(2) : ''}
                  onChange={() => {}}
                  placeholder="—"
                  readOnly
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <FormTextInput
                  label="Freight Total"
                  value={freightTotal > 0 ? freightTotal.toFixed(2) : ''}
                  onChange={() => {}}
                  placeholder="—"
                  readOnly
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

            <MasterTable
              columns={LINE_ITEM_COLUMNS_ACTIVE}
              rows={lineItemRows}
              colSpan={TOTAL_COLS}
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
                      poQty:       getSource(found.poQty),
                      poRate:      getSource(found.poRate),
                      poNoOfPacks: getSource(found.poNoOfPacks),
                      poPackSize:  getSource(found.poPackSize),
                      sgst:        getSource(found.sgst),
                      cgst:        getSource(found.cgst),
                      igst:        found.igst?.source ?? '',
                      hsnCode:     found.hsnCode      ?? '',
                    });
                    setLineItemMode('edit');
                    setLineItemOpen(true);
                  }
                }
              }}
              onDelete={() => {
                setLineItems(prev => prev.filter(i => !selectedLines.includes(i.poDetId)));
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
              <Button onClick={() => {
                const errors = validateForm();
                setValidationErrors(errors);
                setConfirmOpen(true);
              }}>
                Save PO
              </Button>
            </Group>
          </Box>
        )}

      </Paper>

      <ConfirmDialog
        opened={confirmOpen}
        onClose={() => { setConfirmOpen(false); setValidationErrors([]); }}
        onConfirm={() => onSave?.(form, lineItems)}
        message={`Are you sure you want to ${confirmLabel.toLowerCase()} this Purchase Order?`}
        confirmLabel={confirmLabel}
        zIndex={250}
        errors={validationErrors}
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