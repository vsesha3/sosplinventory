import React, { useEffect, useState } from 'react';
import {
  Paper, Box, Text, Group, Badge, Table, Loader, Center, ActionIcon, Tooltip, Divider,
} from '@mantine/core';
import { IconChevronRight, IconChevronDown, IconRefresh } from '@tabler/icons-react';
import api from '../../services/api';

// ── RM stock for a work order's product ──────────────────────────────────────
// Same endpoints as the Material Request form (new request, no rmReqId):
//   GET /api/inventory/product-rm-mapping/wo/{woId}?qty=  → RMs + required qty for the plan qty
//   GET /api/inventory/rm-stock/code/{rmCode}            → lot-wise stock per RM
// Each row expands to show its lots (same columns as the RM Stock Lot Wise popup).

interface RmRow {
  rmId:          number;
  rmCode:        string | null;
  rmName:        string | null;
  mixPercentage: number | null;
  requiredQty:   number | null;
}

interface StockLot {
  receiptId:    number;
  lotNo:        string | null;
  grnNo:        string | null;
  totalQty:     number | null;
  issuedQty:    number | null;
  remainingQty: number | null;
  receiptDate:  string | null;
  invoiceNo:    string | null;
}

export interface RmStockAvailabilityProps {
  woId: string | null;
  qty:  string;          // plan quantity — required qty is worked out for this
}

// Decimals may arrive as a number or as { source, parsedValue }
const dec = (v: any): number | null => {
  if (v == null || v === '') return null;
  const n = typeof v === 'object' ? (v.parsedValue ?? parseFloat(v.source)) : Number(v);
  return n == null || isNaN(n) ? null : n;
};

const fmt2 = (n: number | null | undefined) =>
  n == null ? '—' : n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (v: string | null) => {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d.getTime()) ? v : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const mapRm = (raw: any): RmRow => ({
  rmId:          Number(raw.rmId ?? 0),
  rmCode:        raw.rmCode != null ? String(raw.rmCode) : null,
  rmName:        raw.rmName ?? null,
  mixPercentage: dec(raw.mixPercentage),
  requiredQty:   dec(raw.requiredQty),
});

const mapLot = (raw: any): StockLot => ({
  receiptId:    Number(raw.receiptId ?? 0),
  lotNo:        raw.lotNo ?? null,
  grnNo:        raw.grnNo != null ? String(raw.grnNo) : null,
  totalQty:     dec(raw.totalQty),
  issuedQty:    dec(raw.issuedQty),
  remainingQty: dec(raw.remainingQty),
  receiptDate:  raw.receiptDate ?? null,
  invoiceNo:    raw.invoiceNo != null ? String(raw.invoiceNo) : null,
});

const available = (lots: StockLot[] | undefined) =>
  (lots ?? []).reduce((s, l) => s + Math.max(0, l.remainingQty ?? 0), 0);

// Totals across an RM's lots, from the rm-stock API (totalQty / issuedQty per lot)
const sumOf = (lots: StockLot[] | undefined, f: (l: StockLot) => number | null) =>
  (lots ?? []).reduce((s, l) => s + (f(l) ?? 0), 0);

// ── Component ─────────────────────────────────────────────────────────────────

const RmStockAvailability: React.FC<RmStockAvailabilityProps> = ({ woId, qty }) => {
  const [rms, setRms]           = useState<RmRow[]>([]);
  const [stock, setStock]       = useState<Record<string, StockLot[]>>({});
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [reloadKey, setReloadKey] = useState(0);

  const planQty = parseFloat(qty);
  const hasQty  = !isNaN(planQty) && planQty > 0;

  // Debounced so typing the quantity doesn't fire a request per keystroke
  useEffect(() => {
    if (!woId) { setRms([]); setStock({}); setError(null); return; }
    let cancelled = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/api/inventory/product-rm-mapping/wo/${woId}`, {
          params: { qty: hasQty ? planQty : 0 },
        });
        const list: RmRow[] = (Array.isArray(res.data?.data) ? res.data.data : []).map(mapRm);
        if (cancelled) return;
        setRms(list);

        // Stock per RM code, in parallel — one failure doesn't hide the others
        const codes = [...new Set(list.map(r => r.rmCode).filter((c): c is string => !!c))];
        const results = await Promise.allSettled(
          codes.map(c => api.get(`/api/inventory/rm-stock/code/${c}`)),
        );
        if (cancelled) return;
        const map: Record<string, StockLot[]> = {};
        results.forEach((r, i) => {
          if (r.status !== 'fulfilled') return;
          const d = r.value.data?.data ?? r.value.data;
          map[codes[i]] = (Array.isArray(d) ? d : d ? [d] : []).map(mapLot);
        });
        setStock(map);
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.response?.data?.message || 'Failed to load RM stock.');
          setRms([]); setStock({});
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 400);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [woId, qty, reloadKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (code: string) =>
    setExpanded(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);

  if (!woId) return null;

  // Req Qty = plan qty × mix % / 100 — same as the Material Request RM table
  // (falls back to the API's requiredQty when mix % is missing)
  const reqQty = (r: RmRow): number => {
    if (!hasQty) return 0;
    if (r.mixPercentage != null) return Math.round(planQty * r.mixPercentage) / 100;
    return r.requiredQty ?? 0;
  };

  const lotsOf   = (r: RmRow) => (r.rmCode ? stock[r.rmCode] : undefined);
  const issuedOf = (r: RmRow) => sumOf(lotsOf(r), l => l.issuedQty);

  const shortCount = rms.filter(r => {
    const req = reqQty(r);
    return req > 0 && available(lotsOf(r)) < req - 0.005;
  }).length;

  // ── Status badge per RM ───────────────────────────────────────────────────
  const badge = (color: string, text: string) =>
    <Badge size="sm" variant="light" color={color} tt="none">{text}</Badge>;

  const status = (r: RmRow) => {
    const req   = reqQty(r);
    const avail = available(lotsOf(r));
    if (r.rmCode && !(r.rmCode in stock)) return badge('gray', 'Not loaded');
    // Nothing required and nothing issued — no plan qty yet
    if (req <= 0 && issuedOf(r) <= 0) return badge('gray', avail > 0 ? 'Not planned · In stock' : 'Not planned');
    if (avail <= 0) return badge('red', 'No stock');
    if (req <= 0) return badge('blue', 'In stock');
    const short = req - avail;
    return short > 0.005 ? badge('orange', `Short by ${fmt2(short)}`) : badge('green', 'Sufficient');
  };

  // ── Lot rows (expanded) ───────────────────────────────────────────────────
  const lotTable = (lots: StockLot[]) => (
    <Box px="md" py="xs" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
      {lots.length === 0 ? (
        <Text size="xs" c="dimmed">No lots found for this RM.</Text>
      ) : (
        <Table withTableBorder withColumnBorders verticalSpacing={4} fz="xs" bg="white">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Lot No</Table.Th>
              <Table.Th>GRN No</Table.Th>
              <Table.Th ta="right">Total Qty</Table.Th>
              <Table.Th ta="right">Issued Qty</Table.Th>
              <Table.Th ta="right">Remaining Qty</Table.Th>
              <Table.Th>Receipt Date</Table.Th>
              <Table.Th>Invoice No</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {lots.map(l => (
              <Table.Tr key={l.receiptId}>
                <Table.Td>{l.lotNo ?? '—'}</Table.Td>
                <Table.Td>{l.grnNo ?? '—'}</Table.Td>
                <Table.Td ta="right">{fmt2(l.totalQty)}</Table.Td>
                <Table.Td ta="right"><Text span size="xs" c="orange.7">{fmt2(l.issuedQty)}</Text></Table.Td>
                <Table.Td ta="right"><Text span size="xs" fw={600} c="green.7">{fmt2(l.remainingQty)}</Text></Table.Td>
                <Table.Td>{fmtDate(l.receiptDate)}</Table.Td>
                <Table.Td>{l.invoiceNo ?? '—'}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Box>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box mt="md">
      <Divider
        label={
          <Group gap="xs">
            <Text size="sm" fw={500}>RM Stock Availability</Text>
            {rms.length > 0 && <Badge size="xs" variant="light" color="blue">{rms.length} RM</Badge>}
            {shortCount > 0 && <Badge size="xs" variant="light" color="orange" tt="none">{shortCount} short</Badge>}
          </Group>
        }
        labelPosition="left"
        mb="sm"
      />

      <Paper withBorder radius="sm">
        <Group justify="space-between" px="sm" py={6}
          style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
          <Text size="xs" c="dimmed">
            {hasQty
              ? 'Req Qty = Plan Qty × Mix % (same as Material Request). Click a row to see its lots.'
              : 'Enter Quantity to see the Req Qty per RM. Click a row to see its lots.'}
          </Text>
          <Tooltip label="Refresh stock">
            <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => setReloadKey(k => k + 1)}>
              <IconRefresh size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>

        {loading ? (
          <Center py="lg"><Group gap="xs"><Loader size="xs" /><Text size="xs" c="dimmed">Loading RM stock...</Text></Group></Center>
        ) : error ? (
          <Text size="xs" c="red" p="sm">{error}</Text>
        ) : rms.length === 0 ? (
          <Text size="xs" c="dimmed" ta="center" py="lg">No RM mapping found for this work order's product.</Text>
        ) : (
          <Table verticalSpacing={6} horizontalSpacing="sm" highlightOnHover>
            <Table.Thead style={{ backgroundColor: 'var(--mantine-color-gray-1)' }}>
              <Table.Tr>
                <Table.Th w={32} />
                <Table.Th><Text size="xs" fw={600}>RM Code</Text></Table.Th>
                <Table.Th><Text size="xs" fw={600}>RM Name</Text></Table.Th>
                <Table.Th ta="right"><Text size="xs" fw={600}>Mix %</Text></Table.Th>
                <Table.Th ta="right"><Text size="xs" fw={600}>Plan Qty</Text></Table.Th>
                <Table.Th ta="right"><Text size="xs" fw={600}>Req Qty</Text></Table.Th>
                <Table.Th ta="right"><Text size="xs" fw={600}>Issued Qty</Text></Table.Th>
                <Table.Th ta="right"><Text size="xs" fw={600}>Available Qty</Text></Table.Th>
                <Table.Th ta="right"><Text size="xs" fw={600}>Lots</Text></Table.Th>
                <Table.Th><Text size="xs" fw={600}>Status</Text></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rms.map(r => {
                const code  = r.rmCode ?? `id-${r.rmId}`;
                const lots  = r.rmCode ? stock[r.rmCode] : undefined;
                const open  = expanded.includes(code);
                const avail  = available(lots);
                const issued = issuedOf(r);
                const req    = reqQty(r);
                const lotCount = (lots ?? []).filter(l => (l.remainingQty ?? 0) > 0).length;
                return (
                  <React.Fragment key={code}>
                    <Table.Tr style={{ cursor: 'pointer' }} onClick={() => toggle(code)}>
                      <Table.Td>
                        {open ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
                      </Table.Td>
                      <Table.Td><Text size="xs" fw={500}>{r.rmCode ?? '—'}</Text></Table.Td>
                      <Table.Td><Text size="xs">{r.rmName ?? '—'}</Text></Table.Td>
                      <Table.Td ta="right"><Text size="xs">{fmt2(r.mixPercentage)}</Text></Table.Td>
                      <Table.Td ta="right">
                        <Text size="xs">{hasQty ? fmt2(planQty) : '—'}</Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text size="xs" fw={600} c="blue">{hasQty ? fmt2(req) : '—'}</Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text size="xs" fw={issued > 0 ? 600 : 400} c={issued > 0 ? 'orange.7' : 'dimmed'}>
                          {lots ? fmt2(issued) : '—'}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text size="xs" fw={600} c={avail > 0 ? 'green.7' : 'red'}>{fmt2(avail)}</Text>
                      </Table.Td>
                      <Table.Td ta="right"><Text size="xs">{lotCount}</Text></Table.Td>
                      <Table.Td>{status(r)}</Table.Td>
                    </Table.Tr>
                    {open && (
                      <Table.Tr>
                        <Table.Td colSpan={10} p={0}>{lotTable(lots ?? [])}</Table.Td>
                      </Table.Tr>
                    )}
                  </React.Fragment>
                );
              })}
            </Table.Tbody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default RmStockAvailability;
