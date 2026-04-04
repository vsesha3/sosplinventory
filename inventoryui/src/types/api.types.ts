import type { DateValue } from '@mantine/dates';

export interface PagedApiResponse<T> {
  success: boolean;
  message: string;
  data: {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

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


interface DecimalField {
  source: string;
  parsedValue: number;
}


export const  numVal = (field: DecimalField | null | undefined | number): number => {
  if (field == null) return 0;
  if (typeof field === 'number') return isNaN(field) ? 0 : field;
  if (field.parsedValue != null && !isNaN(field.parsedValue)) return field.parsedValue;
  const parsed = parseFloat(field.source);
  return isNaN(parsed) ? 0 : parsed;
};

export interface PoLineItem {
  poDetId: number;
  poRefNo: number;
  poRmCode: string;
  poRmName: string;
  poQty: DecimalField |number | null;
  poRate: DecimalField |number| null;
  poUom: string | null;
  sgst: DecimalField | null;
  sgstValue: DecimalField |number | null;
  poNoOfPacks: DecimalField | number |null;
  poPackSize: DecimalField | number | null;
  cgst: DecimalField | null;
  cgstValue: DecimalField | null;
  igst: DecimalField | null;
  igstValue: DecimalField | null;
  hsnCode: string | null;
}


export const PO_TYPE_OPTIONS = [
  { value: 'RAW_MATERIAL',     label: 'Raw Material',     prefix: 'RM'   },
  { value: 'PACKING_MATERIAL', label: 'Packing Material', prefix: 'PM'   },
  { value: 'CAPITAL_GOODS',    label: 'Capital Goods',    prefix: 'CG'   },
  { value: 'MISCELLANEOUS',    label: 'Miscellaneous',    prefix: 'MISC' },
] as const;

export const PO_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  PO_TYPE_OPTIONS.map(o => [o.value, o.label])
);


export interface MaterialReceiptLineRequest {
  poDetId: string;
  poRmCode: string;
  poRmName: string;
  poUom: string;
  rmOrderQty: string;
  rmReceivedQty: string;
  sgst: string;
  cgst: string;
  igst: string;
  receivedRate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate: string;
  inspectedBy: string;
  approvedBy: string;
  lotNumber: string;
}

export interface MaterialReceiptRequest {
  actualDateTimeOfReceipt: string;
  dateTimeOfReceipt: string;
  grnNo: string;
  ircNo: string;
  supplierId: string;
  transporterId: string | null;
  stnCommercialInvoiceNo: string;
  invoiceDate: string;
  modvatCopyNo: string;
  sapPo: string;
  lrNumber: string;
  poRefNo: string;
  poDate: string;
  poType: string;
  lines: MaterialReceiptLineRequest[];
  freight: string;
  freightGst: string;
  receiptDetId?: number | null;
}