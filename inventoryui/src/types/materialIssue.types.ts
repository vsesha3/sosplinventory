// ── Material Issue — list row ─────────────────────────────────────────────────
// GET /api/inventory/rm-request/viewForIssue (paged) → SosRmRequestView

import type { IssueQtySummary } from '../pages/raw-material/IssueQtySummary';
import { parseIssueQtySummary } from '../pages/raw-material/IssueQtySummary';

export interface MaterialIssueViewRow {
  rmReqId:             number;
  productionLotNumber: string | null;
  rmReqDate:           string | null;
  scheduleDate:        string | null;
  productId:           number | null;
  productName:         string | null;
  woCode:              string | null;
  planToProdQty:       number | null;
  requestBy:           string | null;
  requestedByName:     string | null;
  ginNo:               string | null;
  issueSummary:        IssueQtySummary;
}

// Decimals may arrive as a number or as { source, parsedValue }
const toNum = (v: any): number | null => {
  if (v == null || v === '') return null;
  if (typeof v === 'object') {
    const n = v.parsedValue ?? (v.source != null ? Number(v.source) : null);
    return n != null && !isNaN(Number(n)) ? Number(n) : null;
  }
  const n = Number(v);
  return isNaN(n) ? null : n;
};

export const mapMaterialIssueViewRow = (raw: any): MaterialIssueViewRow => ({
  rmReqId:             Number(raw.rmReqId),
  productionLotNumber: raw.productionLotNumber ?? null,
  rmReqDate:           raw.rmReqDate           ?? null,
  scheduleDate:        raw.scheduleDate        ?? null,
  productId:           raw.productId != null ? Number(raw.productId) : null,
  productName:         raw.productName         ?? null,
  woCode:              raw.woCode              ?? null,
  planToProdQty:       toNum(raw.planToProdQty),
  requestBy:           raw.requestBy != null && raw.requestBy !== '' ? String(raw.requestBy) : null,
  requestedByName:     raw.requestedByName     ?? null,
  ginNo:               raw.ginNo != null && raw.ginNo !== '' ? String(raw.ginNo) : null,
  issueSummary:        parseIssueQtySummary(raw),
});
