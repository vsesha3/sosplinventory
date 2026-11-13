import api from '../../services/api';
import type { MaterialRequestFormData } from '../../types/MaterialRequest.types';
import { fetchReqDetlsIds, postRmIssue } from './rmIssueApi';

// ── Save a Material Request (create / update) + its held RM / PM lot issues ──
// Shared by the RM Request list and the Material Issue list — both open the same form.

export type MaterialRequestSaveResult =
  | { status: 'success'; message: string }
  | { status: 'error';   message: string };   // request saved, some issues failed

// RM Issue — one per raw material, lines = lot-wise Issue Qty.
// Only lots picked before the request existed (new request) are pending here —
// on an existing request the stock popup posts its issue straight away.
// Needs the saved request line ids (rmReqDetlsId), so runs after the request save.
// Returns the RM codes whose issue could not be saved.
const saveRmIssues = async (rmReqId: number, formData: MaterialRequestFormData): Promise<string[]> => {
  const issues = Object.entries(formData.lotIssues ?? {})
    .filter(([, lots]) => Object.keys(lots).length > 0);
  if (issues.length === 0 || !rmReqId) return [];

  let detlsIds: Map<number, number>;
  try {
    detlsIds = await fetchReqDetlsIds(rmReqId);
  } catch {
    return issues.map(([rmCode]) => rmCode);
  }

  const failed: string[] = [];
  for (const [rmCode, lots] of issues) {
    const rmId    = formData.rmLines?.find(l => l.rmCode === rmCode)?.rmId;
    const detlsId = rmId != null ? detlsIds.get(Number(rmId)) : undefined;
    if (detlsId == null) { failed.push(rmCode); continue; }

    try {
      await postRmIssue({ rmReqId, rmReqDetlsId: detlsId, issueBy: formData.requestBy, lots });
    } catch (err: any) {
      console.warn(`[saveRmIssues] ${rmCode} failed:`, err?.response?.data ?? err);
      failed.push(rmCode);
    }
  }
  return failed;
};

// PM Issue — held lot-wise packs for a new request, posted after the save.
// PM is an rm_master row saved as a request line → same rm-issue endpoint, by its line id.
// Returns the PM codes whose issue could not be saved.
const savePmIssues = async (rmReqId: number, formData: MaterialRequestFormData): Promise<string[]> => {
  const issues = Object.entries(formData.pmLotIssues ?? {})
    .filter(([, e]) => Object.keys(e.lots).length > 0);
  if (issues.length === 0 || !rmReqId) return [];

  let detlsIds: Map<number, number>;
  try {
    detlsIds = await fetchReqDetlsIds(rmReqId);
  } catch {
    return issues.map(([pmCode]) => pmCode);
  }

  const failed: string[] = [];
  for (const [pmCode, e] of issues) {
    const detlsId = e.pmId != null ? detlsIds.get(Number(e.pmId)) : undefined;
    if (detlsId == null) { failed.push(pmCode); continue; }
    try {
      await postRmIssue({ rmReqId, rmReqDetlsId: detlsId, issueBy: formData.requestBy, lots: e.lots });
    } catch (err: any) {
      console.warn(`[savePmIssues] ${pmCode} failed:`, err?.response?.data ?? err);
      failed.push(pmCode);
    }
  }
  return failed;
};

/**
 * Saves the request, then its held lot issues.
 * Throws if the request itself fails to save (form should stay open).
 */
export const saveMaterialRequest = async (
  formData: MaterialRequestFormData,
  mode: 'create' | 'update',
): Promise<MaterialRequestSaveResult> => {
  const payload = {
    rmReqId:             formData.rmReqId,
    rmReqDate:           formData.rmReqDate ?? new Date().toISOString(),
    scheduleDate:        formData.scheduleDate ?? null,
    woId:                formData.woId ? Number(formData.woId) : null,
    planToProdQty:       formData.planToProdQty ? Number(formData.planToProdQty) : null,
    productionLotNumber: formData.productionLotNumber || null,
    ginNo:               formData.ginNo || null,
    requestBy:           formData.requestBy,
    productionPlanId:    formData.productionPlanId,
    isRmIssueCompleted:  formData.isRmIssueCompleted,
    lines: [
      ...(formData.rmLines ?? []).map(line => ({
        woId:          line.woId,
        rmId:          line.rmId,
        rmCode:        line.rmCode,
        rmName:        line.rmName,
        mixPercentage: line.mixPercentage,
        planQty:       line.planQty,
        requiredQty:   line.requiredQty,
      })),
      // Packing materials (rm_master, material type PM) — required = no. of packs.
      // Skipped if the same id is already an RM line.
      ...(formData.pmLines ?? [])
        .filter(pm => !(formData.rmLines ?? []).some(l => Number(l.rmId) === pm.pmId))
        .map(pm => ({
          woId:          formData.woId ? Number(formData.woId) : null,
          rmId:          pm.pmId,
          rmCode:        pm.pmCode,
          rmName:        pm.pmName,
          mixPercentage: null,
          planQty:       formData.planToProdQty ? Number(formData.planToProdQty) : null,
          requiredQty:   pm.requiredQty,
        })),
    ],
  };

  const res = mode === 'update' && formData.rmReqId
    ? await api.put(`/api/inventory/rm-request/${formData.rmReqId}`, payload)
    : await api.post('/api/inventory/rm-request/save', payload);
  const savedReqId = formData.rmReqId ?? Number(res.data?.data);

  // Request is saved at this point — issue failures are reported, not retried,
  // so a retry can't post the same issue twice
  const failedIssues   = await saveRmIssues(savedReqId, formData);
  const failedPmIssues = await savePmIssues(savedReqId, formData);

  if (failedIssues.length > 0 || failedPmIssues.length > 0) {
    return {
      status: 'error',
      message: [
        'Material Request saved, but',
        failedIssues.length   > 0 ? `RM issue failed for: ${failedIssues.join(', ')}` : '',
        failedPmIssues.length > 0 ? `PM issue failed for: ${failedPmIssues.join(', ')}` : '',
      ].filter(Boolean).join(' '),
    };
  }
  return {
    status: 'success',
    message: mode === 'update'
      ? 'Material Request updated successfully!'
      : 'Material Request created successfully!',
  };
};
