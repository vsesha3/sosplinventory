import api from '../../services/api';

// Lot-wise Issue Qty for one raw material, keyed by receiptId (the lot)
export type LotQtyMap = Record<number, string>;

// rmId → rmReqDetlsId for a saved Material Request
export const fetchReqDetlsIds = async (rmReqId: number): Promise<Map<number, number>> => {
  const res = await api.get(`/api/inventory/rm-request/${rmReqId}/lines`);
  const lines: any[] = res.data?.data ?? [];
  const map = new Map<number, number>();
  lines.forEach(d => {
    if (d.rmId != null && d.rmReqDetlsId != null) map.set(Number(d.rmId), Number(d.rmReqDetlsId));
  });
  return map;
};

const pad = (n: number) => String(n).padStart(2, '0');

// POST /api/inventory/rm-issue/save — one issue per request line, one detail per lot
export const postRmIssue = async (params: {
  rmReqId:      number;
  rmReqDetlsId: number;
  issueBy:      string | null;
  lots:         LotQtyMap;
}) => {
  const now = new Date();
  const payload = {
    rmIssueId:    null,
    issueDate:    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    issueShift:   null,
    issueTime:    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
    rmReqDetlsId: String(params.rmReqDetlsId),
    receivedBy:   null,
    issueBy:      params.issueBy,
    rmReqId:      String(params.rmReqId),
    lines: Object.entries(params.lots).map(([receiptId, qty]) => ({
      rmIssueDetailsId: null,
      rmReceiptId:      receiptId,
      rmReqDetlsId:     String(params.rmReqDetlsId),
      issueQty:         qty,
      remark:           null,
    })),
  };
  const res = await api.post('/api/inventory/rm-issue/save', payload);
  return res.data?.data;   // rmIssueId
};

// Packing materials live in rm_master too (told apart by material type), so a PM
// issue uses this same endpoint — saved as a request line, issued via postRmIssue.
