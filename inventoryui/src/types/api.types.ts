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