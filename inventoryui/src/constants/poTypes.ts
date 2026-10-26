// ── PO types ─────────────────────────────────────────────────────────────────
// Single source for PO type options across the app.
// value  = code stored by the API / saved on POs (RAW_MATERIAL …) — do not change
// label  = proper-case text shown to users
// prefix = PO number prefix (RM/0001/…)

export interface PoTypeOption {
  value:  string;
  label:  string;
  prefix: string;
}

export const PO_TYPE_OPTIONS: PoTypeOption[] = [
  { value: 'RAW_MATERIAL',     label: 'Raw Material',     prefix: 'RM'   },
  { value: 'PACKING_MATERIAL', label: 'Packing Material', prefix: 'PM'   },
  { value: 'CAPITAL_GOODS',    label: 'Capital Goods',    prefix: 'CG'   },
  { value: 'MISCELLANEOUS',    label: 'Miscellaneous',    prefix: 'MISC' },
];

export const PO_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  PO_TYPE_OPTIONS.map(o => [o.value, o.label])
);

// Normalise for matching: "RAW_MATERIAL", "Raw Material", "RawMaterial" → "rawmaterial"
const norm = (v: string) => v.replace(/[\s_-]/g, '').toLowerCase();

// Proper-case label for any spelling of a PO type; unknown values are returned as-is
export const poTypeLabel = (v: string | null | undefined): string => {
  if (!v) return '';
  const match = PO_TYPE_OPTIONS.find(o => norm(o.value) === norm(v) || norm(o.label) === norm(v));
  return match?.label ?? v;
};
