export interface MaterialReceiptSummary {
  receiptDetId:  number;
  poRefNo:       number;
  materialType:  string;
  invoiceNo:     string;
  supplierId:    number;
  invoiceDate:   string;
  sgstValue:     number | null;
  cgstValue:     number | null;
  igstValue:     number | null;
  noOfReceived:  number | null;
  netAmount:     number | null;
  totalAmount:   number | null;
  inwardType:    'BYPO' | 'JOBINWARD';
  // Raw value from the API: "JOBINWARD" or "<PO No>-BYPO" (e.g. "RM/0002/2026-2027-BYPO")
  inwardRef:     string;
  grnNo:         string | null;
  supplierName:  string | null;
}

// Quantities: always 2 decimals — 500 → "500.00", 50.5 → "50.50"
export const fmtQty = (v: number | string | null | undefined): string => {
  if (v == null || v === '') return '—';
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return isNaN(n) ? '—' : n.toLocaleString('en-IN', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
};

// PO number carried in inwardRef — null for job inward (no PO)
export const poNoFromInwardRef = (ref: string | null | undefined): string | null => {
  if (!ref || ref === 'JOBINWARD') return null;
  const poNo = ref.replace(/-?BYPO$/i, '').trim();
  return poNo || null;
};

// "2026-10-01" (or "2026-10-01T..." ) → "01-10-2026"; anything else is returned as-is
export const fmtDdMmYyyy = (val: string | null | undefined): string => {
  if (!val) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(val);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : val;
};

// Decimal fields arrive as a number or as { source, parsedValue } — Number({...}) is NaN
const toNum = (v: any): number | null => {
  if (v == null) return null;
  if (typeof v === 'object') {
    const n = v.parsedValue ?? (v.source != null ? Number(v.source) : null);
    return n != null && !isNaN(Number(n)) ? Number(n) : null;
  }
  const n = Number(v);
  return isNaN(n) ? null : n;
};

export const mapMaterialReceiptSummary =(raw: any): MaterialReceiptSummary => ({
  // inwardType may be "JOBINWARD" or a GRN-style string like "RM/0002/2026-2027-BYPO"
  inwardType:    raw.inwardType === 'JOBINWARD' ? 'JOBINWARD' : 'BYPO',
  inwardRef:     raw.inwardType    ?? '',
  // API sends a number (job_grn_no for job inward, grn_no otherwise) — keep as text
  grnNo:         raw.grnNo != null && raw.grnNo !== '' ? String(raw.grnNo) : null,
  receiptDetId:  raw.receiptDetId  ?? 0,
  poRefNo:       raw.poRefNo       ?? 0,
  materialType:  raw.materialType  ?? '',
  invoiceNo:     raw.invoiceNo     ?? '',
  supplierId:    raw.supplierId    ?? 0,
  supplierName:  raw.supplierName  ?? null,
  invoiceDate:   raw.invoiceDate   ?? '',
  sgstValue:     toNum(raw.sgstValue),
  cgstValue:     toNum(raw.cgstValue),
  igstValue:     toNum(raw.igstValue),
  noOfReceived:  toNum(raw.noOfReceived),
  netAmount:     toNum(raw.netAmount),
  totalAmount:   toNum(raw.totalAmount),
});


export interface MaterialReceiptWithRMDetails {
  poDetId:              number;
  poRmCode:             string | null;
  poRmName:             string | null;
  poUom:                string | null;
  rmOrderQty:           number | null;
  rmReceivedQty:        number | null;
  receivedRate:         number | null;
  sgst:                 number | null;
  cgst:                 number | null;
  igst:                 number | null;
  expectedDeliveryDate: string | null;
  actualDeliveryDate:   string | null;
  inspectedBy:          string | null;
  approvedBy:           string | null;
  lotNumber:            string | null;
}

export const mapMaterialReceiptWithRMDetails = (
  raw: any
): MaterialReceiptWithRMDetails => ({
  poDetId:              raw.poDetId       != null ? Number(raw.poDetId)       : 0,
  poRmCode:             raw.poRmCode      ?? null,
  poRmName:             raw.poRmName      ?? null,
  poUom:                raw.poUom         ?? null,
  rmOrderQty:           raw.rmOrderQty    != null ? Number(raw.rmOrderQty)    : null,
  rmReceivedQty:        raw.rmReceivedQty != null ? Number(raw.rmReceivedQty) : null,
  receivedRate:         raw.receivedRate  != null ? Number(raw.receivedRate)  : null,
  sgst:                 raw.sgst          != null ? Number(raw.sgst)          : null,
  cgst:                 raw.cgst          != null ? Number(raw.cgst)          : null,
  igst:                 raw.igst          != null ? Number(raw.igst)          : null,
  expectedDeliveryDate: raw.expectedDeliveryDate ?? null,
  actualDeliveryDate:   raw.actualDeliveryDate   ?? null,
  inspectedBy:          raw.inspectedBy          ?? null,
  approvedBy:           raw.approvedBy           ?? null,
  lotNumber:            raw.lotNumber            ?? null,
});