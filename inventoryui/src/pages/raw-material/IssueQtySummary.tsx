import React from 'react';
import { Badge, Stack, Text } from '@mantine/core';

// ── Pending RM / PM qty on a request row ─────────────────────────────────────
// Accepts either shape the API returns:
//   • flat     → pendingRM / pendingPM, plus totalRM / totalPM (requested)
//   • detailed → rmIssueQtySummary: [{ materialType, requestedQty, issuedQty, pendingQty }]

export interface IssueQtyTotals {
  requestedQty: number | null;   // null when the API sends pending only
  issuedQty:    number | null;
  pendingQty:   number;
}

export interface IssueQtySummary {
  rm: IssueQtyTotals | null;
  pm: IssueQtyTotals | null;
}

// Decimals may arrive as a number or as { source, parsedValue }
const num = (v: any): number | null => {
  if (v == null || v === '') return null;
  const n = typeof v === 'object' ? (v.parsedValue ?? Number(v.source)) : Number(v);
  return isNaN(Number(n)) ? null : Number(n);
};

/** Pending totals per material type from a request row; null when not available. */
export const parseIssueQtySummary = (row: any): IssueQtySummary => {
  const out: IssueQtySummary = { rm: null, pm: null };
  const list = row?.rmIssueQtySummary;

  if (Array.isArray(list)) {
    for (const s of list) {
      const key = String(s?.materialType ?? '').toUpperCase() === 'PM' ? 'pm' : 'rm';
      const prev = out[key] ?? { requestedQty: 0, issuedQty: 0, pendingQty: 0 };
      out[key] = {
        requestedQty: (prev.requestedQty ?? 0) + (num(s.requestedQty) ?? 0),
        issuedQty:    (prev.issuedQty    ?? 0) + (num(s.issuedQty)    ?? 0),
        pendingQty:   prev.pendingQty          + (num(s.pendingQty)   ?? 0),
      };
    }
    return out;
  }

  // Flat: pendingRM / pendingPM, with totalRM / totalPM as the requested qty when sent
  const flat = (pending: any, total: any): IssueQtyTotals | null => {
    const p = num(pending);
    const t = num(total);
    if (p == null && t == null) return null;
    return {
      requestedQty: t,
      issuedQty:    t != null && p != null ? t - p : null,
      pendingQty:   p ?? t ?? 0,
    };
  };
  // Getter casing decides the JSON name (getTotalPm → "totalPm"), so accept both spellings
  out.rm = flat(row?.pendingRM ?? row?.pendingRm, row?.totalRM ?? row?.totalRm);
  out.pm = flat(row?.pendingPM ?? row?.pendingPm, row?.totalPM ?? row?.totalPm);
  return out;
};

const fmt2 = (n: number) =>
  n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Table cell: pending qty (orange), "of requested" when known, badge when fully issued. */
export const PendingQtyCell: React.FC<{ totals: IssueQtyTotals | null; unit: string }> = ({ totals, unit }) => {
  if (!totals) return <Text size="xs" c="dimmed">—</Text>;

  const nothingPending = totals.pendingQty <= 0.005;

  // Requested qty known → can tell "fully issued" from "no lines of this type"
  if (totals.requestedQty != null) {
    if (totals.requestedQty <= 0) return <Text size="xs" c="dimmed">—</Text>;
    if (nothingPending) return <Badge variant="light" color="green" size="sm" tt="none">Fully issued</Badge>;
    return (
      <Stack gap={0} align="flex-end">
        <Text size="xs" fw={600} c="orange.8">{fmt2(totals.pendingQty)} {unit}</Text>
        <Text size="10px" c="dimmed">of {fmt2(totals.requestedQty)}</Text>
      </Stack>
    );
  }

  // Pending only
  return nothingPending
    ? <Text size="xs" c="dimmed">0.00</Text>
    : <Text size="xs" fw={600} c="orange.8">{fmt2(totals.pendingQty)} {unit}</Text>;
};
