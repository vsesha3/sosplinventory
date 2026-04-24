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
  planToProdQty:       raw.planToProdQty       != null ? Number(raw.planToProdQty) : null,
  productionLotNumber: raw.productionLotNumber ?? null,
  isRmIssueCompleted:  raw.isRmIssueCompleted  ?? null,
  companyId:           raw.companyId           != null ? Number(raw.companyId) : null,
  ginNo:               raw.ginNo               != null ? Number(raw.ginNo)     : null,
  productName:         raw.productName         ?? null,
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



