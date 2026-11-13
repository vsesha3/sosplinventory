import type { IssueQtySummary } from '../pages/raw-material/IssueQtySummary';
import { parseIssueQtySummary } from '../pages/raw-material/IssueQtySummary';

// A packing material's lot-wise issue (receiptId → qty), held until the request is saved
export interface PmIssueEntry {
  pmId:             number | null;
  pmPackingDetslId: number | null;
  lots:             Record<number, string>;
}

// A packing material as a request line — requiredQty is the number of packs
export interface PmRequestLine {
  pmId:        number;
  pmCode:      string | null;
  pmName:      string | null;
  requiredQty: number | null;
}

export interface RmRequestApiData {
  rmReqId:              number;
  rmReqDate:            string | null;
  woId:                 number | null;
  woCode:               string | null;
  createdBy:            string | null;
  createdOn:            string | null;
  lastUpdatedBy:        string | null;
  lastUpdatedOn:        string | null;
  isActive:             boolean | null;
  requestBy:            string | null;
  scheduleDate:         string | null;
  planToProdQty:        number | null;
  productionLotNumber:  string | null;
  isRmIssueCompleted:   boolean | null;
  companyId:            number | null;
  ginNo:                number | null;
  // joined fields if available
  productName?:         string | null;
  issueSummary:         IssueQtySummary;
}

export const mapRmRequest = (raw: any): RmRequestApiData => ({
  rmReqId:             raw.rmReqId             ?? 0,
  rmReqDate:           raw.rmReqDate           ?? null,
  woId:                raw.woId                != null ? Number(raw.woId)   : null,
  woCode:              raw.woCode              ?? null,
  createdBy:           raw.createdBy           ?? null,
  createdOn:           raw.createdOn           ?? null,
  lastUpdatedBy:       raw.lastUpdatedBy       ?? null,
  lastUpdatedOn:       raw.lastUpdatedOn       ?? null,
  isActive:            raw.isActive            ?? null,
  requestBy:           raw.requestBy           ?? null,
  scheduleDate:        raw.scheduleDate        ?? null,
  planToProdQty:       raw.planToProdQty       != null
    ? Number(typeof raw.planToProdQty === 'object'
        ? (raw.planToProdQty.parsedValue ?? raw.planToProdQty.source)
        : raw.planToProdQty)
    : null,
  productionLotNumber: raw.productionLotNumber ?? null,
  isRmIssueCompleted:  raw.isRmIssueCompleted  ?? null,
  companyId:           raw.companyId           != null ? Number(raw.companyId) : null,
  ginNo:               raw.ginNo               != null ? Number(raw.ginNo)     : null,
  productName:         raw.productName         ?? null,
  issueSummary:        parseIssueQtySummary(raw),
});



export interface MaterialRequestFormData {
  rmReqId?: number;
  rmReqDate: Date | null;
  scheduleDate: Date | null;
  woId: string | null;
  planToProdQty: string;
  productionLotNumber: string;
  ginNo: string;
  requestBy: string | null;
  productionPlanId: number | null;
  isRmIssueCompleted: boolean;
  rmLines?: RmMappingLine[];
  // Lot-wise Issue Qty from the stock popup: rmCode → receiptId → qty
  lotIssues?: Record<string, Record<number, string>>;
  // Packing material issues held for the request save: pmCode → { pmId, pmPackingDetslId, lots }
  pmLotIssues?: Record<string, PmIssueEntry>;
  // Packing materials saved as request lines (rm_master rows, material type PM),
  // so they get an rmReqDetlsId to issue against
  pmLines?: PmRequestLine[];
}


export interface RmMappingLine {
  woId:          number;
  woCode:        string | null;
  productId:     number | null;
  rmId:          number;
  rmCode:        string | null;
  rmName:        string | null;
  mixPercentage: number | null;
  planQty:       number | null;
  requiredQty:   number | null;
  // Saved request only (GET /api/inventory/rm-request/{rmReqId}/lines)
  rmReqDetlsId?: number | null;
  issuedQty?:    number | null;   // total already issued against this line
  balanceQty?:   number | null;   // required − issued, when the API sends it
}


export interface MaterialRequestApiData {
  rmReqId: number;
  rmReqDate: string | null;
  woId: number | null;
  requestBy: string | null;
  scheduleDate: string | null;
  planToProdQty: number | string | null;
  productionPlanId: number | null;
  productionLotNumber: string | null;
  isRmIssueCompleted: boolean | null;
  ginNo: string | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedBy?: string | null;
  updatedAt?: string | null;
}

export interface MaterialRequestDetailApiResponse {
  success: boolean;
  message: string;
  data: MaterialRequestApiData;
}



