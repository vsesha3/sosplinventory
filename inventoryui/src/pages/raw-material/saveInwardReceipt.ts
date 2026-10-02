import api from '../../services/api';
import type { MaterialReceiptRequest } from '../../types/api.types';
import type { InwardReceiptFormData } from './Rawmaterialinwardreceipt';

// Shared by Purchase Orders → Inward Receipt and Procurement → Material Inward

const formatDate = (val: any): string => {
  if (!val) return '';
  try { return new Date(val).toISOString(); } catch { return ''; }
};

/**
 * Saves an inward receipt. Throws an Error with a user-facing message on failure.
 */
export const saveInwardReceipt = async (data: InwardReceiptFormData): Promise<void> => {
  // Only lines with a received quantity are saved
  const receivedLines = data.lines.filter(
    line => line.rmReceivedQty && parseFloat(line.rmReceivedQty) > 0
  );

  if (receivedLines.length === 0) {
    throw new Error(
      'No line items with received quantity. Please enter received qty for at least one item.'
    );
  }

  const inwardType = data.inwardType ?? 'BYPO';

  const payload: MaterialReceiptRequest = {
    inwardType,
    actualDateTimeOfReceipt: formatDate(data.actualDateTimeOfReceipt),
    dateTimeOfReceipt:       formatDate(data.dateTimeOfReceipt),
    grnNo:                   data.grnNo          ?? '',
    ircNo:                   data.ircNo          ?? '',
    supplierId:              data.supplierId     ?? '',
    transporterId:           data.transporterId  ?? null,
    stnCommercialInvoiceNo:  data.stnCommercialInvoiceNo ?? '',
    invoiceDate:             formatDate(data.invoiceDate),
    modvatCopyNo:            data.modvatCopyNo   ?? '',
    sapPo:                   data.sapPo          ?? '',
    lrNumber:                data.lrNumber       ?? '',
    poRefNo:                 inwardType === 'JOBINWARD' ? '' : (data.poRefNo ?? ''),
    poDate:                  data.poDate         ?? '',
    poType:                  data.poType         ?? '',
    freight:                 data.freight        ?? '',
    freightGst:              data.freightTaxPct  ?? '',
    receiptDetId:            data.receiptDetId   ?? null,
    lines: receivedLines.map(line => ({
      receiptId:            line.receiptId ? String(line.receiptId) : '',
      // Job lines use negative local keys — they have no PO line
      poDetId:              line.poDetId > 0 ? String(line.poDetId) : '',
      poRmCode:             line.poRmCode        ?? '',
      poRmName:             line.poRmName        ?? '',
      poUom:                line.poUom           ?? '',
      rmOrderQty:           String(line.rmOrderQty),
      rmReceivedQty:        line.rmReceivedQty   ?? '',
      sgst:                 line.sgst            ?? '',
      cgst:                 line.cgst            ?? '',
      igst:                 line.igst            ?? '',
      receivedRate:         line.receivedRate    ?? '',
      expectedDeliveryDate: formatDate(line.expectedDeliveryDate),
      actualDeliveryDate:   formatDate(line.actualDeliveryDate),
      inspectedBy:          line.inspectedBy     ?? '',
      approvedBy:           line.approvedBy      ?? '',
      lotNumber:            line.lotNumber       ?? '',
    })),
  };

  try {
    await api.post('/api/inventory/material-receipt/save', payload);
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to save Inward Receipt.');
  }
};
