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
}

export const mapMaterialReceiptSummary = (raw: any): MaterialReceiptSummary => ({
  receiptDetId:  raw.receiptDetId  ?? 0,
  poRefNo:       raw.poRefNo       ?? 0,
  materialType:  raw.materialType  ?? '',
  invoiceNo:     raw.invoiceNo     ?? '',
  supplierId:    raw.supplierId    ?? 0,
  invoiceDate:   raw.invoiceDate   ?? '',
  sgstValue:     raw.sgstValue  != null ? Number(raw.sgstValue)  : null,
  cgstValue:     raw.cgstValue  != null ? Number(raw.cgstValue)  : null,
  igstValue:     raw.igstValue  != null ? Number(raw.igstValue)  : null,
  noOfReceived:  raw.noOfReceived != null ? Number(raw.noOfReceived) : null,
  netAmount:     raw.netAmount  != null ? Number(raw.netAmount)  : null,
  totalAmount:   raw.totalAmount != null ? Number(raw.totalAmount) : null,
});


export interface MaterialReceiptWithRMDetails {
  receiptId:      number;
  receiptMainId:  number;
  noOfReceived:   number | null;
  perUnitRate:    number | null;
  sgstValue:      number | null;
  cgstValue:      number | null;
  igstValue:      number | null;
  netAmount:      number | null;
  totalAmount:    number | null;
}

export const mapMaterialReceiptWithRMDetails = (
  raw: any
): MaterialReceiptWithRMDetails => ({
  receiptId:     raw.receiptId     ?? 0,
  receiptMainId: raw.receiptMainId ?? 0,
  noOfReceived:  raw.noOfReceived  != null ? Number(raw.noOfReceived)  : null,
  perUnitRate:   raw.perUnitRate   != null ? Number(raw.perUnitRate)   : null,
  sgstValue:     raw.sgstValue     != null ? Number(raw.sgstValue)     : null,
  cgstValue:     raw.cgstValue     != null ? Number(raw.cgstValue)     : null,
  igstValue:     raw.igstValue     != null ? Number(raw.igstValue)     : null,
  netAmount:     raw.netAmount     != null ? Number(raw.netAmount)     : null,
  totalAmount:   raw.totalAmount   != null ? Number(raw.totalAmount)   : null,
});