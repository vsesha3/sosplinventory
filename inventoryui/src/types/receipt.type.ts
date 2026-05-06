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