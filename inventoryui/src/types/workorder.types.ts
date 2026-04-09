// ── Work Order with details (child of Sales Order) ────────────────────────────

export interface WorkOrderDetailData {
  woId:         number;
  poId:         number;
  plant:        string | null;
  qty:          number | null;
  perUnitRate:  number | null;
  // ── From product master ──
  productId:    number | null;
  productCode:  string | null;
  productName:  string | null;
  // ── From PM master ──   
  pmId:         number | null;
  pmName:       string | null;
  // ── Calculated ──
  totalAmount:  number | null;
}

export const mapWorkOrderDetail = (raw: any): WorkOrderDetailData => ({
  woId:         raw.woId         ?? 0,
  poId:         raw.poId         ?? 0,
  plant:        raw.plant        ?? null,
  qty:          raw.qty          != null ? Number(raw.qty)          : null,
  perUnitRate:  raw.perUnitRate  != null ? Number(raw.perUnitRate)  : null,
  productId:    raw.productId    != null ? Number(raw.productId)    : null,
  productCode:  raw.productCode  ?? null,
  productName:  raw.productName  ?? null,
  pmId:         raw.pmId         != null ? Number(raw.pmId)         : null,
  pmName:       raw.pmName       ?? null,
  totalAmount:  raw.totalAmount  != null ? Number(raw.totalAmount)  : null,
});

export const fetchWorkOrdersByPo = async (
  apiClient: any,
  poId: number | string
): Promise<WorkOrderDetailData[]> => {
  const res = await apiClient.get(`/api/inventory/work-order/details/po/${poId}`);
  const d   = res.data?.data;
  const arr = Array.isArray(d) ? d : [];
  return arr.map(mapWorkOrderDetail);
};


export interface WorkOrderApiData {
  woId:        number;
  poId:        number;
  plant:       string | null;
  productId:   number | null;
  qty:         number | null;
  perUnitRate: number | null;
  woCode:      string | null;
  pmId:        number | null;
  lineItem:    string | null;
}

export const mapWorkOrder = (raw: any): WorkOrderApiData => ({
  woId:        raw.woId        ?? 0,
  poId:        raw.poId        ?? 0,
  plant:       raw.plant       ?? null,
  productId:   raw.productId   != null ? Number(raw.productId)   : null,
  qty:         raw.qty         != null ? Number(raw.qty)         : null,
  perUnitRate: raw.perUnitRate != null ? Number(raw.perUnitRate) : null,
  woCode:      raw.woCode      ?? null,
  pmId:        raw.pmId        != null ? Number(raw.pmId)        : null,
  lineItem:    raw.lineItem    ?? null,
});