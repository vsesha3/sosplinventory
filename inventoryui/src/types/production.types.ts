// ── production.types.ts ───────────────────────────────────────────────────────

import type { DateValue } from '@mantine/dates';

// ─────────────────────────────────────────────────────────────────────────────
// 1. LIST API DATA
//    Returned by /api/inventory/production-plan/details
//    Uses the custom SosProductionPlanResponse mapper (joined data)
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductionPlanApiData {
  productionPlanId: number;
  qty:              number | null;
  woId:             number | null;
  woCode:           string | null;
  fromDate:         string | null;
  toDate:           string | null;
  pmId:             number | null;
  pmName:           string | null;
  pmSize:           number | null;
  companyId:        number | null;
  companyName:      string | null;
  pmReq:            number | null;
  createdOn:        string | null;
}

// Mapper: raw list API response → ProductionPlanApiData
export const mapProductionPlan = (raw: any): ProductionPlanApiData => ({
  productionPlanId: raw.productionPlanId ?? 0,
  qty:              raw.qty       != null ? Number(raw.qty)       : null,
  woId:             raw.woId      != null ? Number(raw.woId)      : null,
  woCode:           raw.woCode    ?? null,
  fromDate:         raw.fromDate  ?? null,
  toDate:           raw.toDate    ?? null,
  pmId:             raw.pmId      != null ? Number(raw.pmId)      : null,
  pmName:           raw.pmName    ?? null,
  pmSize:           raw.pmSize    != null ? Number(raw.pmSize)    : null,
  companyId:        raw.companyId != null ? Number(raw.companyId) : null,
  companyName:      raw.companyName ?? null,
  pmReq:            raw.pmReq     != null ? Number(raw.pmReq)     : null,
  createdOn:        raw.createdOn ?? null,
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. SINGLE RECORD API DATA
//    Returned by /api/inventory/production-plan/{id}
//    Uses the raw SosProductionPlan entity fields
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductionPlanSingleApiData {
  productionPlanId:    number;
  productionFromDate:  string | null;
  productionFromShift: string | null;
  productionToDate:    string | null;
  productionToShift:   string | null;
  woId:                number | null;
  qty:                 { source: string; parsedValue: number } | number | null;
  vesselId:            number | null;
  coaReference:        string | null;
  // extra joined fields if returned
  productName?:        string | null;
  sapCode?:            string | null;
  remainingQty?:       number | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. FORM DATA (UI state — used by ProductionPlanForm)
//    Single source of truth — exported from here, imported everywhere
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductionPlanFormData {
  productionPlanId:   number | null;
  productionFromDate: DateValue;
  productionToDate:   DateValue;
  vesselId:           string | null;
  woId:               string | null;
  qty:                string;
  coaReference:       string;
  // Auto-filled from WO selection
  productName:        string;
  sapCode:            string;
  remainingQty:       string;
}

// Default form values
export const defaultProductionPlanForm: ProductionPlanFormData = {
  productionPlanId:   null,
  productionFromDate: null,
  productionToDate:   null,
  vesselId:           null,
  woId:               null,
  qty:                '',
  coaReference:       '',
  productName:        '',
  sapCode:            '',
  remainingQty:       '0',
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAPPERS
// ─────────────────────────────────────────────────────────────────────────────

// Helper — extract number from DecimalField or plain number
const extractNum = (val: any): string => {
  if (val == null) return '';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object' && val.parsedValue != null) return String(val.parsedValue);
  if (typeof val === 'object' && val.source      != null) return val.source;
  return String(val);
};

// Mapper: single record API → form state
export const mapSingleApiToForm = (
  raw: ProductionPlanSingleApiData
): ProductionPlanFormData => ({
  productionPlanId:   raw.productionPlanId,
  productionFromDate: raw.productionFromDate ? new Date(raw.productionFromDate) : null,
  productionToDate:   raw.productionToDate   ? new Date(raw.productionToDate)   : null,
  vesselId:           raw.vesselId  != null ? String(raw.vesselId)  : null,
  woId:               raw.woId      != null ? String(raw.woId)      : null,
  qty:                extractNum(raw.qty),
  coaReference:       raw.coaReference ?? '',
  productName:        raw.productName  ?? '',
  sapCode:            raw.sapCode      ?? '',
  remainingQty:       raw.remainingQty != null ? String(raw.remainingQty) : '0',
});

// Mapper: form state → API save/update payload
export const mapFormToPayload = (form: ProductionPlanFormData) => ({
  productionFromDate: form.productionFromDate
    ? new Date(form.productionFromDate as Date).toISOString() : null,
  productionToDate:   form.productionToDate
    ? new Date(form.productionToDate as Date).toISOString() : null,
  vesselId:           form.vesselId  ? Number(form.vesselId)  : null,
  woId:               form.woId      ? Number(form.woId)      : null,
  qty:                form.qty       ? Number(form.qty)        : null,
  coaReference:       form.coaReference || null,
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const SHIFT_OPTIONS = [
  { value: 'A', label: 'Shift A' },
  { value: 'B', label: 'Shift B' },
  { value: 'C', label: 'Shift C' },
  { value: 'G', label: 'General' },
] as const;

export const VESSEL_OPTIONS = [
  { value: '1', label: 'OLP Reactor'    },
  { value: '2', label: 'ALP Reactor'    },
  { value: '3', label: 'Reactor3'       },
  { value: '4', label: 'OLP Formulator' },
  { value: '5', label: 'NLP Formulator' },
  { value: '6', label: 'ALP Formulator' },
  { value: '7', label: 'Melting POT'    },
] as const;

export const getVesselName = (id: number | null | undefined): string => {
  if (id == null) return '—';
  return VESSEL_OPTIONS.find(v => v.value === String(id))?.label ?? String(id);
};