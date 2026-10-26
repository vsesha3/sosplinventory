/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box, Paper, Text, Group, Button,
  Grid, Badge, Stack, Loader, Center, Table, Checkbox, Tooltip, ActionIcon,
} from '@mantine/core';
import { IconListSearch, IconX } from '@tabler/icons-react';
import ProductionPlanPickerModal from '../Operations/ProductionPlanPickerModal';
import type { ProductionPlanApiData } from '../../types/production.types';
import type { DateValue } from '@mantine/dates';
import { Modal } from '@mantine/core';
import api from '../../services/api';

import { FormDatePicker } from '../../components/common/FormDatePicker';
import { FormTextInput } from '../../components/common/FormTextInput';
import { FormSelect } from '../../components/common/FormSelect';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import MasterTable from '../../components/common/MasterTable';
import type { ColumnDef } from '../../components/common/MasterTable';
import MasterCardGrid from '../../components/common/MasterCardGrid';
import type { CardFieldDef } from '../../components/common/MasterCardGrid';

import { createFormSetters } from '../../components/common/formSetters.ts';
import type {
  MaterialRequestApiData,
  MaterialRequestDetailApiResponse,
  MaterialRequestFormData, RmMappingLine
} from '../../types/MaterialRequest.types.ts';
import type { DropDownOption, DropDownApiResponse } from '../../types/common.types';

// ── RM Mapping types ──────────────────────────────────────────────────────────

import StockIssuanceEditModal from './StockIssuanceEditModal';


import type { StockIssuanceLine } from './StockIssuanceEditModal';


const extractDecimal = (v: any): number | null => {
  if (v == null) return null;
  if (typeof v === 'number') return v;
  if (typeof v === 'object') return v.parsedValue ?? parseFloat(v.source) ?? null;
  return parseFloat(v) || null;
};

const mapRmLine = (raw: any): RmMappingLine => ({
  woId: raw.woId ?? 0,
  woCode: raw.woCode ?? null,
  productId: raw.productId ?? null,
  rmId: raw.rmId ?? 0,
  rmCode: raw.rmCode ?? null,
  rmName: raw.rmName ?? null,
  mixPercentage: extractDecimal(raw.mixPercentage),
  planQty: extractDecimal(raw.planQty),
  requiredQty: extractDecimal(raw.requiredQty),
});

// ── PM Packing Detail type ────────────────────────────────────────────────────

export interface PmPackingDetail {
  woId: number | null;
  pmId: number | null;
  pmCode: string | null;
  pmName: string | null;
  pmSize: number | null;
  pmQty: number | null;
  pmUom: string | null;
  description: string | null;
  [key: string]: any;  // allow additional fields from API
}

// ── RM Stock type ─────────────────────────────────────────────────────────────

interface RmStockLine {
  receiptId: number;
  lotNo: string | null;
  rmCode: string | null;
  rmName: string | null;
  totalQty: number | null;
  perUnitRate: number | null;
  issuedQty: number | null;
  remainingQty: number | null;
  receiptDate: string | null;
  grnNo: string | null;
  invoiceNo: string | null;
}

const mapRmStock = (raw: any): RmStockLine => ({
  receiptId: raw.receiptId ?? 0,
  lotNo: raw.lotNo ?? null,
  rmCode: raw.rmCode != null ? String(raw.rmCode) : null,
  rmName: raw.rmName ?? null,
  totalQty: extractDecimal(raw.totalQty),
  perUnitRate: extractDecimal(raw.perUnitRate),
  issuedQty: extractDecimal(raw.issuedQty),
  remainingQty: extractDecimal(raw.remainingQty),
  receiptDate: raw.receiptDate ?? null,
  grnNo: raw.grnNo ?? null,
  invoiceNo: raw.invoiceNo ?? null,
});

const STOCK_COLUMNS: ColumnDef[] = [
  { key: 'rmName', label: 'RM Name', width: 200 },
  { key: 'lotNo', label: 'Lot No', width: 160 },
  { key: 'totalQty', label: 'Total Qty', width: 110, align: 'right' },
  { key: 'issuedQty', label: 'Issued Qty', width: 110, align: 'right' },
  { key: 'remainingQty', label: 'Remaining Qty', width: 120, align: 'right' },
  { key: 'receiptDate', label: 'Receipt Date', width: 120 },
  { key: 'invoiceNo', label: 'Invoice No', width: 130 },
];

// Raw fields first, normalised fields after — so the normalised values win.
// product-pm-mapping/wo returns the PM name as `rmName` and no pmCode → fall back.
const mapPmDetail = (raw: any): PmPackingDetail => ({
  ...raw,
  woId: raw.woId != null ? Number(raw.woId) : null,
  pmId: raw.pmId != null ? Number(raw.pmId) : null,
  pmCode: raw.pmCode != null ? String(raw.pmCode)
        : raw.pmId != null ? String(raw.pmId) : null,
  pmName: raw.pmName ?? raw.rmName ?? null,
  // Pack size from the product's PM mapping (packSize); pmSize kept for older responses
  pmSize: extractDecimal(raw.packSize ?? raw.pmSize),
  pmQty: extractDecimal(raw.pmQty),
  pmUom: raw.pmUom ?? null,
  description: raw.description ?? null,
  avgRate: raw.avgRate != null ? Number(raw.avgRate) : null,
  fgLotCode: raw.fgLotCode ?? null,
});

// ── RM Mapping columns ────────────────────────────────────────────────────────

const RM_PAGE_SIZE = 5;

const RM_COLUMNS: ColumnDef[] = [
  { key: 'rmCode', label: 'RM Code', width: 90 },
  { key: 'rmName', label: 'RM Name', width: 200 },
  { key: 'mixPercentage', label: 'Mix %', width: 70, align: 'right' },
  { key: 'planQty', label: 'Plan Qty', width: 90, align: 'right' },
  { key: 'requiredQty', label: 'Req Qty', width: 90, align: 'right' },
];

const fmt = (v: number | null, d = 3) =>
  v != null ? v.toFixed(d) : '—';

// ── Props ─────────────────────────────────────────────────────────────────────

export interface MaterialRequestFormProps {
  initialData?: Partial<MaterialRequestFormData>;
  onSave?: (data: MaterialRequestFormData) => void;
  readOnly?: boolean;
  opened: boolean;
  onClose: () => void;
  mode?: 'create' | 'update';
  rmReqId?: number | null;
  saving?: boolean;   // true while the parent is saving — shows a loading Save button
}

// ── Work order details (product / vessel / lot) — display only ───────────────

interface WoDetails {
  productName:         string;
  productCode:         string;
  vesselName:          string;
  productionLotNumber: string;
}

const emptyWoDetails: WoDetails = {
  productName: '', productCode: '', vesselName: '', productionLotNumber: '',
};

// ── Default form ──────────────────────────────────────────────────────────────

const defaultForm: MaterialRequestFormData = {
  rmReqDate: new Date(),
  scheduleDate: null,
  woId: null,
  planToProdQty: '',
  productionLotNumber: '',
  ginNo: '',
  requestBy: null,
  productionPlanId: null,
  isRmIssueCompleted: false,
};

// ── Component ─────────────────────────────────────────────────────────────────

const MaterialRequestForm: React.FC<MaterialRequestFormProps> = ({
  initialData,
  onSave,
  readOnly = false,
  opened,
  onClose,
  mode = 'create',
  rmReqId = null,
  saving = false,
}) => {

  const [form, setForm] = useState<MaterialRequestFormData>({ ...defaultForm, ...initialData });
  const [dropdowns, setDropdowns] = useState({
    workOrderOptions: [] as DropDownOption[],
    employeeOptions: [] as DropDownOption[],
  });

  // ── Production Plan ───────────────────────────────────────────────────────
  // The plan drives the form: it sets the Work Order (→ wo-details as before) and
  // the allowed Schedule Date range (plan From – To). Nothing else is editable until
  // a plan is selected.
  const [planPickerOpen, setPlanPickerOpen]   = useState(false);
  const [pickedPlanLabel, setPickedPlanLabel] = useState('');
  const [planRange, setPlanRange] = useState<{ from: Date | null; to: Date | null }>(
    { from: null, to: null });
  const [planLoading, setPlanLoading] = useState(false);
  // From the plan itself — the WO dropdown can't be used (it omits fully planned WOs)
  const [planQty, setPlanQty]       = useState<number | null>(null);
  const [planWoCode, setPlanWoCode] = useState('');
  const [planVessel, setPlanVessel] = useState('');   // the plan's vessel (plan-specific)

  const planChosen = form.productionPlanId != null;

  // Start of day, so range checks ignore the time part
  const dayStart = (v: string | Date | null | undefined): Date | null => {
    if (!v) return null;
    const d = new Date(v);
    if (isNaN(d.getTime())) return null;
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const inPlanRange = (v: DateValue | null | undefined): boolean => {
    const d = dayStart(v as Date | null);
    if (!d) return true;
    if (planRange.from && d < planRange.from) return false;
    if (planRange.to && d > planRange.to) return false;
    return true;
  };

  const handlePlanPicked = (plan: ProductionPlanApiData) => {
    const from = dayStart(plan.productionFromDate);
    const to   = dayStart(plan.productionToDate);
    const woId = plan.woId != null ? String(plan.woId) : null;

    setPickedPlanLabel(`#${plan.productionPlanId}${plan.woCode ? ` — ${plan.woCode}` : ''}`);
    setPlanRange({ from, to });
    setPlanQty(plan.qty);
    setPlanWoCode(plan.woCode ?? '');
    setPlanVessel(plan.vesselName ?? '');

    // New plan → new work order: reset everything that depended on the old one
    setForm(prev => {
      const sd = dayStart(prev.scheduleDate as Date | null);
      const keepSchedule = sd != null
        && (!from || sd >= from) && (!to || sd <= to);
      return {
        ...prev,
        productionPlanId:    plan.productionPlanId,
        woId,
        planToProdQty:       '',
        productionLotNumber: '',
        scheduleDate:        keepSchedule ? prev.scheduleDate : null,
      };
    });
    setRmLines([]);
    setPmLines([]);
    setPmRawResponse(null);
    setRmStock([]);
    setSelectedRmId(null);
    setSelectedRmCode(null);
    setValidationErrors([]);

    loadWoDetails(woId);   // product / product code / vessel — previous workflow
  };

  const clearPlan = () => {
    setPickedPlanLabel('');
    setPlanRange({ from: null, to: null });
    setPlanQty(null);
    setPlanWoCode('');
    setPlanVessel('');
    setForm(prev => ({
      ...prev,
      productionPlanId: null, woId: null, planToProdQty: '',
      productionLotNumber: '', scheduleDate: null,
    }));
    setRmLines([]);
    setPmLines([]);
    setPmRawResponse(null);
    setRmStock([]);
    setSelectedRmId(null);
    setSelectedRmCode(null);
    loadWoDetails(null);
  };

  // Edit mode: the request only stores productionPlanId + woId. Rebuild what the picker
  // gives us — date range, plan qty, WO code — from the plan and WO APIs.
  const loadPlanForEdit = async (planId: number, woId: number | null) => {
    setPlanLoading(true);
    try {
      const [planRes, woRes] = await Promise.allSettled([
        api.get(`/api/inventory/production-plan/${planId}`),
        woId != null ? api.get(`/api/inventory/work-order/${woId}`) : Promise.reject(),
      ]);

      const plan = planRes.status === 'fulfilled'
        ? (planRes.value.data?.data ?? planRes.value.data) : null;
      if (plan) {
        setPlanRange({ from: dayStart(plan.productionFromDate), to: dayStart(plan.productionToDate) });
        setPlanQty(extractDecimal(plan.qty));
      }

      // WO code
      const wo = woRes.status === 'fulfilled' ? (woRes.value.data?.data ?? woRes.value.data) : null;
      const woCode = wo?.woCode ?? plan?.woCode ?? '';
      if (woCode) setPlanWoCode(String(woCode));

      // Vessel — only if the plan API sends the name. Otherwise the Vessel field uses
      // /api/misc/wo-details (same source as on plan selection). Don't look up vesselId
      // in vessel-list: it only holds VESSEL misc rows, so older ids map to the wrong name.
      setPlanVessel(plan?.vesselName ?? '');
    } catch (err: any) {
      console.warn('[loadPlanForEdit] Failed:', err?.response?.data ?? err);
    } finally {
      setPlanLoading(false);
    }
  };

  // Work Order text: plan's WO code → dropdown label → WO id
  const woDisplay = !form.woId
    ? ''
    : planWoCode
      || dropdowns.workOrderOptions.find(o => o.value === form.woId)?.label
      || `WO #${form.woId}`;

  // Text shown in the Production Plan box: picked label → "#id — WO code" (edit mode)
  const planLabel = !planChosen
    ? ''
    : pickedPlanLabel
      || [
        `#${form.productionPlanId}`,
        planWoCode || dropdowns.workOrderOptions.find(o => o.value === form.woId)?.label,
      ].filter(Boolean).join(' — ');
  const [formLoading, setFormLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // ── RM Mapping state ──────────────────────────────────────────────────────
  const [rmLines, setRmLines] = useState<RmMappingLine[]>([]);
  const [rmPage, setRmPage]   = useState(1);

  // Back to page 1 whenever the RM mapping is reloaded
  useEffect(() => { setRmPage(1); }, [rmLines]);
  const [rmLoading, setRmLoading] = useState(false);

  // ── PM Packing state ──────────────────────────────────────────────────────
  const [pmLines, setPmLines] = useState<PmPackingDetail[]>([]);
  const [pmLoading, setPmLoading] = useState(false);
  const [pmRawResponse, setPmRawResponse] = useState<any>(null);

  const { set, setDate, setStr } = createFormSetters(setForm);

  // ── Work order details ────────────────────────────────────────────────────
  const [woDetails, setWoDetails]       = useState<WoDetails>({ ...emptyWoDetails });
  const [woDetailsLoading, setWoDetailsLoading] = useState(false);
  const latestWoRef = useRef<string | null>(null);   // ignores stale responses

  // GET /api/misc/wo-details/{id} → product name/code, vessel, production lot number.
  // id = productionPlanId in edit mode, woId on Work Order selection.
  // Lot number fills the form only when it's empty (never overwrites a saved/typed one).
  const loadWoDetails = async (woId: string | null) => {
    latestWoRef.current = woId;
    setWoDetails({ ...emptyWoDetails });
    if (!woId) return;

    setWoDetailsLoading(true);
    try {
      const res = await api.get(`/api/misc/wo-details/${woId}`);
      if (latestWoRef.current !== woId) return;
      // API may return the object directly, wrapped in { data }, or as a one-item array
      const raw = res.data?.data ?? res.data;
      const d = (Array.isArray(raw) ? raw[0] : raw) ?? {};
      const details: WoDetails = {
        productName:         d.productName         ?? '',
        productCode:         d.productCode         ?? '',
        vesselName:          d.vesselName          ?? '',
        productionLotNumber: d.productionLotNumber ?? '',
      };
      setWoDetails(details);
      if (details.productionLotNumber) {
        setForm(prev => prev.productionLotNumber
          ? prev
          : { ...prev, productionLotNumber: details.productionLotNumber });
      }
    } catch (err: any) {
      console.warn('[loadWoDetails] Failed:', err?.response?.data ?? err);
    } finally {
      if (latestWoRef.current === woId) setWoDetailsLoading(false);
    }
  };



  const [rmStock, setRmStock] = useState<RmStockLine[]>([]);
  const [rmStockLoading, setRmStockLoading] = useState(false);
  const [selectedRmCode, setSelectedRmCode] = useState<string | null>(null);

  const [selectedRmId, setSelectedRmId] = useState<number | null>(null);


const [selectedStockId, setSelectedStockId]   = useState<number | null>(null);
const [stockEditOpen, setStockEditOpen]       = useState(false);
const [stockEditItem, setStockEditItem]       = useState<StockIssuanceLine | null>(null);


  const handleRmRowSelect = (item: RmMappingLine) => {
    const newId = selectedRmId === item.rmId ? null : item.rmId;
    setSelectedRmId(newId);
    setSelectedRmCode(newId != null ? item.rmCode : null);
    if (newId != null && item.rmCode) {
      loadRmStock(item.rmCode);
    } else {
      setRmStock([]);
    }
  };

  // ── Fetch helpers ─────────────────────────────────────────────────────────

  const fetchRequestDetails = async (reqId: number): Promise<MaterialRequestApiData> => {
    const res = await api.get<MaterialRequestDetailApiResponse>(
      `/api/inventory/rm-request/${reqId}`
    );
    return res.data.data;
  };

  const fetchWorkOrders = async (): Promise<DropDownOption[]> => {
    const res = await api.get<DropDownApiResponse>('/api/inventory/work-order/dropdown');
    return res.data.data.filter(opt => opt.label != null && opt.value != null);
  };

  const fetchEmployees = async (): Promise<DropDownOption[]> => {
    const res = await api.get<DropDownApiResponse>('/api/inventory/employees/dropdown');
    return res.data.data.filter(opt => opt.label != null && opt.value != null);
  };

  // ── Map API → form ────────────────────────────────────────────────────────

  const mapApiToForm = (apiData: MaterialRequestApiData): MaterialRequestFormData => ({
    rmReqId: apiData.rmReqId,
    rmReqDate: apiData.rmReqDate ? new Date(apiData.rmReqDate) : null,
    scheduleDate: apiData.scheduleDate ? new Date(apiData.scheduleDate) : null,
    woId: apiData.woId != null ? String(apiData.woId) : null,
    planToProdQty: apiData.planToProdQty != null ? String(apiData.planToProdQty) : '',
    productionLotNumber: apiData.productionLotNumber ?? '',
    ginNo: apiData.ginNo ?? '',
    requestBy: apiData.requestBy ?? null,
    productionPlanId: apiData.productionPlanId,
    isRmIssueCompleted: !!apiData.isRmIssueCompleted,
  });

  // ── Load RM mapping from API ──────────────────────────────────────────────

  const loadRmMapping = async (woId: string, qty: string) => {
    setRmLoading(true);
    setPmLoading(true);
    try {
      // ── Fire all three calls in parallel ────────────────────────────────
      // Lot number: new request → generated; existing request (rmReqId) → its saved lot
      const lotParams = mode === 'update' && rmReqId ? { rmReqId } : undefined;
      const [rmRes, lotRes, pmRes] = await Promise.allSettled([
        api.get(`/api/inventory/product-rm-mapping/wo/${woId}`, { params: { qty } }),
        api.get(`/api/misc/wo-details/${woId}`, { params: lotParams }),
        api.get(`/api/inventory/product-pm-mapping/wo/${woId}`),
      ]);

      // ── RM Mapping ───────────────────────────────────────────────────────
      if (rmRes.status === 'fulfilled') {
        const d = rmRes.value.data?.data;
        const arr = Array.isArray(d) ? d : [];
        setRmLines(arr.map(mapRmLine));
      } else {
        setValidationErrors([
          rmRes.reason?.response?.data?.message || 'Failed to fetch RM mapping.',
        ]);
        setRmLines([]);
      }

      // ── Lot Number — auto-fill productionLotNumber ───────────────────────
      if (lotRes.status === 'fulfilled') {
        // Accepts a plain string, an object, or a one-item array
        const rawLot  = lotRes.value.data?.data ?? lotRes.value.data;
        const lotData = Array.isArray(rawLot) ? rawLot[0] : rawLot;
        const lotNumber = typeof lotData === 'string'
          ? lotData
          : lotData?.productionLotNumber ?? lotData?.lotNumber ?? lotData?.generatedLotNumber ?? '';
        if (lotNumber) {
          setForm(prev => ({ ...prev, productionLotNumber: String(lotNumber) }));
        }
      } else {
        console.warn('Lot number fetch failed:', lotRes.reason);
      }

      // ── PM Packing Details ───────────────────────────────────────────────
      if (pmRes.status === 'fulfilled') {
        const pmData = pmRes.value.data?.data;
        setPmRawResponse(pmData);              // keep raw for inspection
        const pmArr = Array.isArray(pmData) ? pmData : pmData ? [pmData] : [];
        setPmLines(pmArr.map(mapPmDetail));
        console.log(pmRawResponse);
      } else {
        console.warn('PM details fetch failed:', pmRes.reason);
        setPmLines([]);
        setPmRawResponse(null);
      }

    } finally {
      setRmLoading(false);
      setPmLoading(false);
    }
  };


  const loadRmStock = async (rmCode: string) => {
    setRmStockLoading(true);
    setRmStock([]);
    try {
      const res = await api.get(`/api/inventory/rm-stock/code/${rmCode}`);
      const d = res.data?.data ?? res.data;
      const arr = Array.isArray(d) ? d : d ? [d] : [];
      setRmStock(arr.map(mapRmStock));
    } catch (err: any) {
      console.warn('[loadRmStock] Failed:', err?.response?.data ?? err);
      setRmStock([]);
    } finally {
      setRmStockLoading(false);
    }
  };

  // ── Master loader ─────────────────────────────────────────────────────────

  const loadFormData = async (cancelled: { value: boolean }) => {
    setFormLoading(true);
    setFetchError(null);
    try {
      const promises: Promise<unknown>[] = [fetchWorkOrders(), fetchEmployees()];
      if (mode === 'update' && rmReqId) promises.push(fetchRequestDetails(rmReqId));
      const results = await Promise.all(promises);
      if (cancelled.value) return;

      const workOrderOptions = results[0] as DropDownOption[];
      const employeeOptions = results[1] as DropDownOption[];
      setDropdowns({ workOrderOptions, employeeOptions });

      if (mode === 'update' && results[2]) {
        const apiData = results[2] as MaterialRequestApiData;
        const mapped = mapApiToForm(apiData);
        setForm(mapped);
        // Schedule Date range comes from the saved plan
        if (apiData.productionPlanId != null) {
          loadPlanForEdit(apiData.productionPlanId, apiData.woId ?? null);
        }
        if (apiData.woId != null) loadWoDetails(String(apiData.woId));
        // Auto-load RM mapping if we have woId and qty
        if (apiData.woId && apiData.planToProdQty) {
          loadRmMapping(String(apiData.woId), String(apiData.planToProdQty));
        }
      } else {
        setForm({ ...defaultForm, ...initialData });
      }
    } catch {
      if (!cancelled.value)
        setFetchError('Failed to load form data. Please close and try again.');
    } finally {
      if (!cancelled.value) setFormLoading(false);
    }
  };

  useEffect(() => {
    if (!opened) {
      setForm({ ...defaultForm });
      setValidationErrors([]);
      setFetchError(null);
      setRmLines([]);
      setPmLines([]);
      setPmRawResponse(null);
      setRmStock([]);
      setSelectedRmId(null);
      setSelectedRmCode(null);
      latestWoRef.current = null;
      setPlanPickerOpen(false);
      setPickedPlanLabel('');
      setPlanRange({ from: null, to: null });
      setPlanLoading(false);
      setPlanQty(null);
      setPlanWoCode('');
      setPlanVessel('');
      setWoDetails({ ...emptyWoDetails });
      setWoDetailsLoading(false);
      return;
    }
    const cancelled = { value: false };
    loadFormData(cancelled);
    return () => { cancelled.value = true; };
  }, [opened]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Remaining Plan Qty ────────────────────────────────────────────────────

  // Based on the selected production plan's qty (not the WO dropdown, which only
  // lists work orders with unplanned qty and so misses fully planned ones).
  const remainingPlanQty = useMemo(() => {
    if (!planChosen || planQty == null) return '';
    const remaining = planQty - (Number(form.planToProdQty) || 0);
    return String(remaining);
  }, [planChosen, planQty, form.planToProdQty]);

  // ── Qty validation ────────────────────────────────────────────────────────

  const validateQty = (value: string): string[] => {
    const errors: string[] = [];
    if (!planChosen || !form.woId)
      errors.push('Please select a Production Plan first');
    const entered = Number(value) || 0;
    if (entered <= 0)
      errors.push('Quantity must be greater than 0');
    if (planQty != null && entered > planQty)
      errors.push(`Quantity cannot exceed the plan qty (${planQty})`);
    return errors;
  };

  // ── Qty handlers ──────────────────────────────────────────────────────────

  const handlePlanQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, planToProdQty: value }));
    setValidationErrors([]);
    if (!value) {
      setRmLines([]);
      setPmLines([]);
      setPmRawResponse(null);
      setRmStock([]);          // ← add
      setSelectedRmId(null);     // ← add
      setSelectedRmCode(null);   // ← add
    }
  };

  const handlePlanQtyBlur = async () => {
    const value = form.planToProdQty;
    if (!value || value === '') return;

    const errors = validateQty(value);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setRmLines([]);
      return;
    }

    setValidationErrors([]);
    await loadRmMapping(form.woId!, value);
  };

  // ── Form validation ───────────────────────────────────────────────────────

  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!planChosen) errors.push('Production Plan is required');
    if (!form.rmReqDate) errors.push('Request Date is required');
    if (!form.scheduleDate) errors.push('Schedule Date is required');
    else if (!inPlanRange(form.scheduleDate)) {
      const f = (d: Date | null) => d ? d.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric' }) : '—';
      errors.push(`Schedule Date must be within the production plan (${f(planRange.from)} – ${f(planRange.to)})`);
    }
    if (!form.woId) errors.push('Work Order is required');
    if (!form.planToProdQty || parseFloat(form.planToProdQty) <= 0)
      errors.push('Request Quantity must be greater than 0');
    if (remainingPlanQty !== '' && parseFloat(form.planToProdQty) > parseFloat(form.planToProdQty))
      errors.push(`Request Quantity cannot exceed Remaining Plan Qty (${remainingPlanQty})`);
    if (!form.requestBy) errors.push('Request By is required');
    return errors;
  };

  const confirmLabel = mode === 'update' ? 'Update' : 'Save';

  const handleStockRowSelect = (item: RmStockLine) => {
    setSelectedStockId(prev => prev === item.receiptId ? null : item.receiptId);
  };

  // ── RM Mapping rows ───────────────────────────────────────────────────────

  // RM Mapping is paged client-side — RM_PAGE_SIZE rows per page
  const rmTotalPages = Math.max(1, Math.ceil(rmLines.length / RM_PAGE_SIZE));
  const rmPageSafe   = Math.min(rmPage, rmTotalPages);
  const rmPageLines  = rmLines.slice((rmPageSafe - 1) * RM_PAGE_SIZE, rmPageSafe * RM_PAGE_SIZE);

  const rmRows = rmPageLines.map(item => {
    const isSel = selectedRmId === item.rmId;
    return (
      <Table.Tr
        key={item.rmId}
        bg={isSel ? 'var(--mantine-color-blue-0)' : undefined}
        style={{ cursor: 'pointer' }}
        onClick={() => handleRmRowSelect(item)}
      >
        <Table.Td>
          <Checkbox
            size="sm"
            checked={isSel}
            onChange={() => handleRmRowSelect(item)}
            onClick={e => e.stopPropagation()}
          />
        </Table.Td>
        <Table.Td><Text size="xs" fw={500}>{item.rmCode ?? '—'}</Text></Table.Td>
        <Table.Td><Text size="xs">{item.rmName ?? '—'}</Text></Table.Td>
        <Table.Td ta="right"><Text size="xs">{fmt(item.mixPercentage, 2)}</Text></Table.Td>
        <Table.Td ta="right"><Text size="xs">{fmt(item.planQty, 2)}</Text></Table.Td>
        <Table.Td ta="right">
          <Text size="xs" fw={600} c="blue">{fmt(item.requiredQty, 2)}</Text>
        </Table.Td>
      </Table.Tr>
    );
  });


  const stockRows = rmStock.map(item => {
    const isSel = selectedStockId === item.receiptId;
    return (
      <Table.Tr
        key={item.receiptId}
        bg={isSel ? 'var(--mantine-color-blue-0)' : undefined}
        style={{ cursor: 'pointer' }}
        onClick={() => handleStockRowSelect(item)}
      >
        <Table.Td>
          <Checkbox
            size="sm"
            checked={isSel}
            onChange={() => handleStockRowSelect(item)}
            onClick={e => e.stopPropagation()}
          />
        </Table.Td>
        <Table.Td><Text size="xs" fw={500}>{item.rmName ?? '—'}</Text></Table.Td>
        <Table.Td><Text size="xs">{item.lotNo ?? '—'}</Text></Table.Td>
        <Table.Td ta="right">
          <Text size="xs" fw={500}>{item.totalQty != null ? item.totalQty.toFixed(3) : '—'}</Text>
        </Table.Td>
        <Table.Td ta="right">
          <Text size="xs" c="orange">{item.issuedQty != null ? item.issuedQty.toFixed(3) : '—'}</Text>
        </Table.Td>
        <Table.Td ta="right">
          <Text size="xs" fw={600} c={item.remainingQty != null && item.remainingQty > 0 ? 'green' : 'red'}>
            {item.remainingQty != null ? item.remainingQty.toFixed(3) : '—'}
          </Text>
        </Table.Td>
        <Table.Td><Text size="xs">{item.receiptDate ?? '—'}</Text></Table.Td>
        <Table.Td><Text size="xs">{item.invoiceNo ?? '—'}</Text></Table.Td>
      </Table.Tr>
    );
  });

const handleStockEdit = () => {
  if (selectedStockId == null) return;
  const item = rmStock.find(s => s.receiptId === selectedStockId);
  if (!item) return;

  // ── Find requiredQty from rmLines for this rmCode ─────────────────────
  const matchingRmLine = rmLines.find(
    r => r.rmCode === String(item.rmCode)
  );

  // ── Count how many lots exist for this rmCode ─────────────────────────
  const lotCount = rmStock.filter(
    s => s.rmCode === item.rmCode
  ).length;

  setStockEditItem({
    ...item,
    requiredQty: matchingRmLine?.requiredQty ?? null,
    lotCount,
  });
  setStockEditOpen(true);
};

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

        {/* ── Header ── */}
        <Box px="lg" py="sm"
          style={{
            backgroundColor: '#2c4a6e',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
          <Group gap="sm">
            <Text fw={700} size="md" c="white">
              Material Request Form — {mode === 'update' ? 'Edit' : 'New'}
            </Text>
            {(form as any).rmReqId && (
              <Badge variant="filled"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                Req # {(form as any).rmReqId}
              </Badge>
            )}
          </Group>
        </Box>

        {/* ── Scrollable body ── */}
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

            {/* ── Header fields ── */}
            <Paper withBorder p="md" mb="md" radius="sm"
              style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
              <Grid columns={12} gutter="md">

                {/* Row 1: Request Date | Production Plan | Schedule Date | G.I.N. No. | Request By
                    Every field except Production Plan stays disabled until a plan is picked. */}
                <Grid.Col span={2}>
                  <FormDatePicker
                    label="Request Date"
                    value={form.rmReqDate}
                    onChange={setDate('rmReqDate')}
                    required
                    readOnly={readOnly}
                    disabled={!planChosen}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  {/* Picked from a modal table — sets the Work Order and the Schedule Date range */}
                  <Group gap="xs" align="flex-end" wrap="nowrap">
                    <Box style={{ flex: 1 }}>
                      <FormTextInput
                        label="Production Plan"
                        value={planLabel}
                        onChange={() => { }}
                        placeholder={planLoading ? 'Loading plan...' : 'Pick a production plan'}
                        required
                        readOnly
                      />
                    </Box>
                    {!readOnly && (
                      <Tooltip label="Pick production plan" position="top">
                        <ActionIcon variant="light" color="blue" size="lg" mb={1}
                          onClick={() => setPlanPickerOpen(true)}>
                          <IconListSearch size={16} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                    {!readOnly && form.productionPlanId != null && (
                      <Tooltip label="Clear production plan" position="top">
                        <ActionIcon variant="subtle" color="gray" size="lg" mb={1}
                          onClick={clearPlan}>
                          <IconX size={14} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </Group>
                </Grid.Col>
                <Grid.Col span={2}>
                  {/* Only dates inside the plan's From – To range can be picked */}
                  <FormDatePicker
                    label="Schedule Date"
                    value={form.scheduleDate}
                    onChange={setDate('scheduleDate')}
                    required
                    readOnly={readOnly}
                    disabled={!planChosen}
                    minDate={planRange.from ?? undefined}
                    maxDate={planRange.to ?? undefined}
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <FormTextInput
                    label="G.I.N. No."
                    value={form.ginNo}
                    onChange={setStr('ginNo')}
                    placeholder="e.g. 35"
                    readOnly={readOnly}
                    disabled={!planChosen}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <FormSelect
                    label="Request By"
                    value={form.requestBy}
                    onChange={set('requestBy')}
                    data={dropdowns.employeeOptions}
                    placeholder="Select employee"
                    required
                    searchable
                    readOnly={readOnly}
                    disabled={!planChosen}
                  />
                </Grid.Col>

                {/* Row 2: Work Order (set by the Production Plan) | Remaining Plan Qty */}
                <Grid.Col span={6}>
                  {/* Shown as text — the WO dropdown omits fully planned work orders */}
                  <FormTextInput
                    label="Work Order"
                    value={woDisplay}
                    onChange={() => { }}
                    placeholder="Set by the Production Plan"
                    required
                    readOnly
                    disabled={!planChosen}
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <FormTextInput
                    label="Remaining Plan Qty"
                    value={remainingPlanQty}
                    onChange={() => { }}
                    placeholder="—"
                    readOnly
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <FormTextInput
                    label="Request Quantity (Kgs)"
                    value={form.planToProdQty}
                    onChange={handlePlanQtyChange}
                    onBlur={handlePlanQtyBlur}
                    placeholder="0.00"
                    required
                    readOnly={readOnly}
                    disabled={!planChosen}
                  />
                  {validationErrors.length > 0 && (
                    <Box mt={4}>
                      {validationErrors.map((err, i) => (
                        <Text key={i} size="xs" c="red">{err}</Text>
                      ))}
                    </Box>
                  )}
                </Grid.Col>
                <Grid.Col span={2}>
                  <FormTextInput
                    label="Production Lot Number"
                    value={form.productionLotNumber}
                    onChange={() => { }}
                    placeholder="Auto-generated"
                    readOnly   // generated by the backend (wo-details) — not editable
                  />
                </Grid.Col>

                {/* Row 3: Product | Product Code | Vessel — from the selected Work Order */}
                <Grid.Col span={6}>
                  <FormTextInput
                    label="Product"
                    value={woDetails.productName}
                    onChange={() => { }}
                    placeholder={woDetailsLoading ? 'Loading...' : 'Auto-filled from Work Order'}
                    readOnly
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <FormTextInput
                    label="Product Code"
                    value={woDetails.productCode}
                    onChange={() => { }}
                    placeholder={woDetailsLoading ? 'Loading...' : 'Auto-filled from Work Order'}
                    readOnly
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <FormTextInput
                    label="Vessel"
                    value={planVessel || woDetails.vesselName}
                    onChange={() => { }}
                    placeholder={woDetailsLoading ? 'Loading...' : 'Auto-filled from Work Order'}
                    readOnly
                  />
                </Grid.Col>

              </Grid>
            </Paper>

            {/* ── Two tables side by side ── */}
            <Grid columns={12} gutter="md">

              {/* ── Left: RM Mapping ── */}
              <Grid.Col span={selectedRmCode || rmStockLoading ? 4 : 6}>
                <Group gap="xs" mb="xs">
                  <Text size="sm" fw={600}>RM Mapping</Text>
                  {rmLines.length > 0 && (
                    <Badge size="xs" variant="light" color="blue">
                      {rmLines.length} item{rmLines.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </Group>

                <MasterTable
                  columns={RM_COLUMNS}
                  rows={rmRows}
                  colSpan={RM_COLUMNS.length + 1}
                  totalElements={rmLines.length}
                  loading={rmLoading}
                  page={rmPageSafe}
                  totalPages={rmTotalPages}
                  pageSize={RM_PAGE_SIZE}
                  onPageChange={setRmPage}
                  searchValue=""
                  onSearchChange={() => { }}
                  allSelected={false}
                  someSelected={false}
                  onToggleSelectAll={() => { }}
                  selectedCount={0}
                  onAdd={undefined}
                  onEdit={undefined}
                  onDelete={undefined}
                  onRefresh={() => {
                    if (form.woId && form.planToProdQty)
                      loadRmMapping(form.woId, form.planToProdQty);
                  }}
                />

                {rmLines.length === 0 && !rmLoading && (
                  <Text size="xs" c="dimmed" ta="center" py="md">
                    {form.woId && form.planToProdQty
                      ? 'No RM mapping found.'
                      : 'Select Work Order and enter Quantity to load RM mapping.'}
                  </Text>
                )}
              </Grid.Col>
              {/* ── Stock table (full width, shown when RM row selected) ── */}
              {(selectedRmCode || rmStockLoading) && (
                <Grid.Col span={5}>
                  <Group gap="xs" mb="xs">
                    <Text size="sm" fw={600}>
                      RM Stock Lot Wise Selection — {selectedRmCode}
                    </Text>
                    {rmLines.find(r => r.rmCode === selectedRmCode)?.rmName && (
                      <Text size="sm" c="dimmed">
                        ({rmLines.find(r => r.rmCode === selectedRmCode)?.rmName})
                      </Text>
                    )}
                    {rmStock.length > 0 && (
                      <Badge size="xs" variant="light" color="green">
                        {rmStock.length} lot{rmStock.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </Group>

                  <MasterTable
                    columns={STOCK_COLUMNS}
                    rows={stockRows}
                    colSpan={STOCK_COLUMNS.length + 1}
                    totalElements={rmStock.length}
                    loading={rmStockLoading}
                    page={1}
                    totalPages={1}
                    pageSize={rmStock.length || 1}
                    onPageChange={() => { }}
                    searchValue=""
                    onSearchChange={() => { }}
                    allSelected={false}
                    someSelected={false}
                    onToggleSelectAll={() => { }}
                    selectedCount={selectedStockId != null ? 1 : 0}   // ← update
                    onAdd={undefined}
                    onEdit={selectedStockId != null ? handleStockEdit : undefined}
                    onDelete={undefined}
                    onRefresh={() => { if (selectedRmCode) loadRmStock(selectedRmCode); }}
                  />

                  {rmStock.length === 0 && !rmStockLoading && (
                    <Text size="xs" c="dimmed" ta="center" py="md">
                      No stock found for RM: {selectedRmCode}
                    </Text>
                  )}
                </Grid.Col>
              )}

              {/* ── Right: PM Packing Details ── */}

              <Grid.Col span={selectedRmCode || rmStockLoading ? 3 : 5}>
                <Group gap="xs" mb="xs">
                  <Text size="sm" fw={600}>PM Packing Details</Text>
                  {pmLines.length > 0 && (
                    <Badge size="xs" variant="light" color="teal">
                      {pmLines.length} item{pmLines.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </Group>

                {pmLoading ? (
                  <Center py={40}>
                    <Stack align="center" gap="xs">
                      <Loader size="sm" />
                      <Text size="xs" c="dimmed">Loading PM details...</Text>
                    </Stack>
                  </Center>
                ) : pmLines.length > 0 ? (
                  // Scrolls when there are several packing items, so the panel stays compact
                  <Box style={{ maxHeight: 460, overflowY: 'auto' }}>
                  <MasterCardGrid
                    fields={[
                      { key: 'pmName', label: 'PM Name' },
                      { key: 'pmCode', label: 'PM Code' },
                      {
                        key: 'pmSize', label: 'Pack Size',
                        render: (v) => v != null ? `${v}` : '—'
                      },
                      {
                        // Request Quantity ÷ Pack Size, rounded up (a part pack is still a pack)
                        key: 'noOfPacks', label: 'No. of Packs',
                        render: (v) => v != null
                          ? <Text size="sm" fw={700} c="blue">{v}</Text>
                          : '—'
                      },
                      {
                        key: 'avgRate', label: 'Avg Rate',
                        render: (v) => v != null ? `₹${Number(v).toFixed(2)}` : '—'
                      },
                    ] as CardFieldDef[]}
                    // Each packing item gets its own pack count from its own pack size
                    items={pmLines.map((pm, i) => {
                      const qty = Number(form.planToProdQty) || 0;
                      return {
                        ...pm,
                        // Unique per row — the same PM can appear with different pack sizes
                        rowKey: pm.pmPackingDetslId ?? `${pm.pmId ?? 'pm'}-${i}`,
                        noOfPacks: pm.pmSize && pm.pmSize > 0 && qty > 0
                          ? Math.ceil(qty / pm.pmSize)
                          : null,
                      };
                    })}
                    idKey="rowKey"
                    showToolbar={false}
                    totalElements={pmLines.length}
                    loading={pmLoading}
                    columns={1}
                    page={1}
                    totalPages={1}
                    pageSize={pmLines.length || 1}
                    onPageChange={() => { }}
                    searchValue=""
                    onSearchChange={() => { }}
                    selected={[]}
                    onToggleSelect={() => { }}
                    onToggleSelectAll={() => { }}
                    allSelected={false}
                    someSelected={false}
                    onRefresh={() => {
                      if (form.woId) loadRmMapping(form.woId, form.planToProdQty);
                    }}
                  />
                  </Box>
                ) : (
                  <Paper withBorder p="xl" radius="sm"
                    style={{
                      minHeight: 200,
                      backgroundColor: 'var(--mantine-color-gray-0)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                    <Text size="xs" c="dimmed">
                      {form.woId && form.planToProdQty
                        ? 'No PM details found.'
                        : 'Select Work Order and enter Quantity to load PM details.'}
                    </Text>


                  </Paper>
                )}
              </Grid.Col>

            </Grid>

          </Box>
        )}

        {/* ── Footer — always pinned ── */}
        {!readOnly && (
          <Box px="lg" py="sm"
            style={{
              borderTop: '1px solid var(--mantine-color-gray-3)',
              backgroundColor: 'var(--mantine-color-body)',
              flexShrink: 0,
            }}>
            <Group justify="flex-end" gap="sm">
              <Button variant="default" size="sm" onClick={onClose} disabled={saving}>Cancel</Button>
              <Button size="sm"
                loading={saving}
                onClick={() => {
                  const errors = validateForm();
                  setValidationErrors(errors);
                  setConfirmOpen(true);
                }}>
                {mode === 'update' ? 'Apply Changes' : 'Save Request'}
              </Button>
            </Group>
          </Box>
        )}

      </Paper>

      <ConfirmDialog
        opened={confirmOpen}
        onClose={() => { setConfirmOpen(false); setValidationErrors([]); }}
        onConfirm={() => {
          setConfirmOpen(false);   // close the dialog; progress shows on the Save button + banner
          onSave?.({ ...form, rmLines: rmLines });
        }}
        message={`Are you sure you want to ${confirmLabel.toLowerCase()} this Material Request?`}
        confirmLabel={confirmLabel}
        zIndex={250}
        errors={validationErrors}
      />

      {/* ── Production Plan picker ── */}
      <ProductionPlanPickerModal
        opened={planPickerOpen}
        onClose={() => setPlanPickerOpen(false)}
        onSelect={handlePlanPicked}
        selectedPlanId={form.productionPlanId}
      />

       <StockIssuanceEditModal
        opened={stockEditOpen}
        onClose={() => {
          setStockEditOpen(false);
          setStockEditItem(null);
          setSelectedStockId(null);
        }}
        item={stockEditItem}
        onSaved={(updatedItem) => {
          setRmStock(prev => prev.map(s =>
            s.receiptId === updatedItem.receiptId ? updatedItem : s
          ));
          setStockEditOpen(false);
          setStockEditItem(null);
          setSelectedStockId(null);
        }}
      />

    </Modal>
  );
};

export default MaterialRequestForm;