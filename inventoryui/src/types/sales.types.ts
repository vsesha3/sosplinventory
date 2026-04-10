// ── sales.types.ts ────────────────────────────────────────────────────────────

import type { DateValue } from '@mantine/dates';

// ── API response shape (matches SosPurchaseOrder entity) ─────────────────────

export interface SalesOrderApiData {
  poId:           number;
  poNumber:       string | null;
  companyId:      string | null;
  companyName?:   string | null;   // joined from company table if available
  ordDate:        string | null;
  ordDeliveryDate: string | null;
  partialPoFlag:  boolean | null;
  createdBy?:     string | null;
  createdAt?:     string | null;
  updatedBy?:     string | null;
  updatedAt?:     string | null;
}

// ── Form data (UI state) ──────────────────────────────────────────────────────

export interface SalesOrderFormData {
  poId?:           number | null;
  poNumber:        string;
  companyId:       string | null;   // string for Select component
  ordDate:         DateValue;
  ordDeliveryDate: DateValue;
  partialPoFlag:   string;   
  createdBy:       string | null;  // 'true' | 'false' for Select component
}




// ── Default form ──────────────────────────────────────────────────────────────

export const defaultSalesOrderForm: SalesOrderFormData = {
  poId:            null,
  poNumber:        '',
  companyId:       null,
  ordDate:         null,
  ordDeliveryDate: null,
  partialPoFlag:   'false',
  createdBy:       null,
};

// ── Mapper: API → Form ────────────────────────────────────────────────────────

export const mapApiToSalesOrderForm = (
  raw: SalesOrderApiData
): SalesOrderFormData => ({
  poId:            raw.poId,
  poNumber:        raw.poNumber        ?? '',
  companyId:       raw.companyId       != null ? String(raw.companyId) : null,
  ordDate:         raw.ordDate         ? new Date(raw.ordDate)         : null,
  ordDeliveryDate: raw.ordDeliveryDate ? new Date(raw.ordDeliveryDate) : null,
  partialPoFlag:   raw.partialPoFlag   ? 'true' : 'false',
  createdBy:       raw.createdBy       ?? null,
});

// ── Mapper: Form → API payload ────────────────────────────────────────────────

export const mapSalesOrderFormToPayload = (form: SalesOrderFormData) => ({
  poNumber:        form.poNumber       || null,
  companyId:       form.companyId      ? Number(form.companyId) : null,
  ordDate:         form.ordDate        ? new Date(form.ordDate as Date).toISOString() : null,
  ordDeliveryDate: form.ordDeliveryDate ? new Date(form.ordDeliveryDate as Date).toISOString() : null,
  partialPoFlag:   form.partialPoFlag  === 'true',
  createdBy:       form.createdBy      || null,
  poId:form.poId || null,
});

// ── Partial PO options ────────────────────────────────────────────────────────

export const PARTIAL_PO_OPTIONS = [
  { value: 'true',  label: 'Yes' },
  { value: 'false', label: 'No'  },
];


// ── Work Order (child of Sales Order) ────────────────────────────────────────

