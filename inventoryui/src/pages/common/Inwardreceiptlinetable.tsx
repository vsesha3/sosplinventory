/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Table, Text, Badge } from '@mantine/core';
import MasterTable from '../../components/common/MasterTable';
import type { ColumnDef } from '../../components/common/MasterTable';
import InwardReceiptLineEditor from './Inwardreceiptlineeditor';
import type { InwardReceiptLine } from './Inwardreceiptlineeditor';

// ── Re-export type for consumers ──────────────────────────────────────────────
export type { InwardReceiptLine };

// ── Props ─────────────────────────────────────────────────────────────────────

export interface InwardReceiptLineTableProps {
  lines:     InwardReceiptLine[];
  onChange:  (lines: InwardReceiptLine[]) => void;
  loading?:  boolean;
  readOnly?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const dash = (v: any) => (v != null && v !== '' ? String(v) : '—');

const safe = (val: string): number => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

const computeLine = (line: any) => {
  const qty      = safe(line.rmReceivedQty);
  const rate     = safe(line.receivedRate);
  const sgst     = safe(line.sgst);
  const cgst     = safe(line.cgst);
  const igst     = safe(line.igst);
  const subTotal = qty * rate;
  const taxPct   = igst > 0 ? igst : (sgst + cgst);
  const taxAmount = subTotal * taxPct / 100;
  return { subTotal, taxAmount, lineTotal: subTotal + taxAmount };
};

const fmtDate = (val: any): string => {
  if (!val) return '—';
  try {
    return new Date(val).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return String(val); }
};

// ── Component ─────────────────────────────────────────────────────────────────

const InwardReceiptLineTable: React.FC<InwardReceiptLineTableProps> = ({
  lines,
  onChange,
  loading  = false,
  readOnly = false,
}) => {
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [editorOpen, setEditorOpen]       = useState(false);
  const [editingLine, setEditingLine]     = useState<InwardReceiptLine | null>(null);
  const [editorMode, setEditorMode]       = useState<'create' | 'edit'>('edit');

  // ── Tax flags — PO-level (same logic as PurchaseOrderForm) ────────────────
  const hasIgst     = lines.some(l => safe(l.igst)  > 0);
  const hasSgstCgst = lines.some(l => safe(l.sgst) > 0 || safe(l.cgst) > 0);

  // ── Dynamic columns ───────────────────────────────────────────────────────
  // Column order: rmCode | rmName | orderQty | receivedQty | lotNo | rate
  //               | [sgst cgst | igst] | nettAmt | expectedDel | actualDel
  //               | inspectedBy | approvedBy
  const LINE_COLUMNS_ACTIVE: ColumnDef[] = [
    { key: 'poRmCode',             label: 'RM Code',           width: 110 },
    { key: 'poRmName',             label: 'RM Description',    width: 180 },
    { key: 'rmOrderQty',           label: 'Order Qty',         width: 100, align: 'right' },
    { key: 'rmReceivedQty',        label: 'Received Qty',      width: 100, align: 'right' },
    { key: 'lotNumber',            label: 'Lot No.',           width: 100 },
    { key: 'receivedRate',         label: ' Po Rate',              width: 90,  align: 'right' },
    ...(hasSgstCgst && !hasIgst ? [
      { key: 'sgst', label: 'SGST %', width: 75, align: 'right' as const },
      { key: 'cgst', label: 'CGST %', width: 75, align: 'right' as const },
    ] : []),
    ...(hasIgst ? [
      { key: 'igst', label: 'IGST %', width: 75, align: 'right' as const },
    ] : []),
    { key: 'lineTotal',            label: 'Nett Amount',       width: 110, align: 'right' },
    { key: 'expectedDeliveryDate', label: 'Expected Delivery', width: 130 },
    { key: 'actualDeliveryDate',   label: 'Actual Delivery',   width: 130 },
    { key: 'inspectedBy',          label: 'Inspected By',      width: 120 },
    { key: 'approvedBy',           label: 'Approved By',       width: 120 },
  ];

  // ── Selection ─────────────────────────────────────────────────────────────

  const lineIds  = lines.map(l => l.poDetId);
  const allSel   = lineIds.length > 0 && lineIds.every(id => selectedLines.includes(id));
  const someSel  = lineIds.some(id => selectedLines.includes(id)) && !allSel;

  const toggleAll  = () => allSel ? setSelectedLines([]) : setSelectedLines(lineIds);
  const toggleLine = (id: number) =>
    setSelectedLines(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleEdit = () => {
    if (selectedLines.length !== 1) return;
    const found = lines.find(l => l.poDetId === selectedLines[0]);
    if (found) {
      setEditingLine({ ...found });
      setEditorMode('edit');
      setEditorOpen(true);
    }
  };

  const handleDelete = () => {
    onChange(lines.filter(l => !selectedLines.includes(l.poDetId)));
    setSelectedLines([]);
  };

  const handleLineSave = (updated: InwardReceiptLine) => {
    onChange(lines.map(l => l.poDetId === updated.poDetId ? updated : l));
    setEditorOpen(false);
    setSelectedLines([]);
  };

  // ── Build rows ────────────────────────────────────────────────────────────

  const rows = lines.map(line => {
    const isSel       = selectedLines.includes(line.poDetId);
    const hasReceived = line.rmReceivedQty && parseFloat(line.rmReceivedQty) > 0;
    const { lineTotal } = computeLine(line);

    return (
      <Table.Tr key={line.poDetId} bg={isSel ? 'var(--mantine-color-blue-0)' : undefined}>

        {/* Checkbox */}
        <Table.Td>
          <input
            type="checkbox"
            checked={isSel}
            onChange={() => toggleLine(line.poDetId)}
            disabled={readOnly}
          />
        </Table.Td>

        {/* RM Code */}
        <Table.Td fw={500}>{line.poRmCode}</Table.Td>

        {/* RM Description */}
        <Table.Td>{line.poRmName}</Table.Td>

        {/* Order Qty */}
        <Table.Td ta="right">{line.rmOrderQty.toFixed(3)} {dash(line.poUom)}</Table.Td>

        {/* Received Qty */}
        <Table.Td ta="right">
          {hasReceived ? (
            <Text size="sm" fw={600} c="green">
              {parseFloat(line.rmReceivedQty).toFixed(3)} {dash(line.poUom)}
            </Text>
          ) : (
            <Text size="sm" c="dimmed">—</Text>
          )}
        </Table.Td>

        {/* Lot No */}
        <Table.Td>{dash(line.lotNumber)}</Table.Td>

        {/* Rate */}
        <Table.Td ta="right">
          {safe(line.receivedRate) > 0
            ? safe(line.receivedRate).toFixed(2)
            : <Text size="sm" c="dimmed">—</Text>}
        </Table.Td>

        {/* SGST — only if hasSgstCgst && !hasIgst */}
        {hasSgstCgst && !hasIgst && (
          <Table.Td ta="right">
            {safe(line.sgst) > 0
              ? line.sgst
              : <Text size="sm" c="dimmed">—</Text>}
          </Table.Td>
        )}

        {/* CGST — only if hasSgstCgst && !hasIgst */}
        {hasSgstCgst && !hasIgst && (
          <Table.Td ta="right">
            {safe(line.cgst) > 0
              ? line.cgst
              : <Text size="sm" c="dimmed">—</Text>}
          </Table.Td>
        )}

        {/* IGST — only if hasIgst */}
        {hasIgst && (
          <Table.Td ta="right">
            {safe(line.igst) > 0
              ? line.igst
              : <Text size="sm" c="dimmed">—</Text>}
          </Table.Td>
        )}

        {/* Nett Amount */}
        <Table.Td ta="right">
          {lineTotal > 0
            ? <Text size="sm" fw={600} c="blue">{lineTotal.toFixed(2)}</Text>
            : <Text size="sm" c="dimmed">—</Text>}
        </Table.Td>

        {/* Expected Delivery */}
        <Table.Td>{fmtDate(line.expectedDeliveryDate)}</Table.Td>

        {/* Actual Delivery */}
        <Table.Td>{fmtDate(line.actualDeliveryDate)}</Table.Td>

        {/* Inspected By */}
        <Table.Td>
          {line.inspectedBy
            ? <Badge variant="light" color="blue"  size="sm">{line.inspectedBy}</Badge>
            : <Text size="sm" c="dimmed">—</Text>}
        </Table.Td>

        {/* Approved By */}
        <Table.Td>
          {line.approvedBy
            ? <Badge variant="light" color="green" size="sm">{line.approvedBy}</Badge>
            : <Text size="sm" c="dimmed">—</Text>}
        </Table.Td>

      </Table.Tr>
    );
  });

  // ── Footer ────────────────────────────────────────────────────────────────

  const filledCount      = lines.filter(l => l.rmReceivedQty && parseFloat(l.rmReceivedQty) > 0).length;
  const totalOrderQty    = lines.reduce((s, l) => s + l.rmOrderQty, 0);
  const totalReceivedQty = lines.reduce((s, l) => s + (parseFloat(l.rmReceivedQty) || 0), 0);
  const totalLineTotal   = lines.reduce((s, l) => s + computeLine(l).lineTotal, 0);

  const footer = lines.length > 0 ? (
    <Table.Tfoot>
      <Table.Tr style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
        {/* chk */}
        <Table.Td />
        {/* RM Code — item count */}
        <Table.Td>
          <Text size="xs" fw={600}>{lines.length} item{lines.length !== 1 ? 's' : ''}</Text>
        </Table.Td>
        {/* RM Description */}
        <Table.Td />
        {/* Order Qty */}
        <Table.Td ta="right">
          <Text size="xs" fw={700}>{totalOrderQty.toFixed(3)}</Text>
        </Table.Td>
        {/* Received Qty */}
        <Table.Td ta="right">
          <Text size="xs" fw={700} c="green">{totalReceivedQty.toFixed(3)}</Text>
        </Table.Td>
        {/* Lot No */}
        <Table.Td />
        {/* Rate */}
        <Table.Td />
        {/* SGST / CGST */}
        {hasSgstCgst && !hasIgst && <Table.Td />}
        {hasSgstCgst && !hasIgst && <Table.Td />}
        {/* IGST */}
        {hasIgst && <Table.Td />}
        {/* Nett Amount */}
        <Table.Td ta="right">
          <Text size="xs" fw={700} c="blue">{totalLineTotal.toFixed(2)}</Text>
        </Table.Td>
        {/* Expected Delivery — filled count */}
        <Table.Td>
          <Text size="xs" c="dimmed">{filledCount} of {lines.length} received</Text>
        </Table.Td>
        {/* Actual, Inspected, Approved */}
        <Table.Td /><Table.Td /><Table.Td />
      </Table.Tr>
    </Table.Tfoot>
  ) : null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <MasterTable
        columns={LINE_COLUMNS_ACTIVE}
        rows={rows}
        colSpan={LINE_COLUMNS_ACTIVE.length + 1}
        totalElements={lines.length}
        loading={loading}
        page={1}
        totalPages={1}
        pageSize={lines.length || 1}
        onPageChange={() => {}}
        searchValue=""
        onSearchChange={() => {}}
        allSelected={allSel}
        someSelected={someSel}
        onToggleSelectAll={toggleAll}
        selectedCount={selectedLines.length}
        footer={footer}
        onAdd={undefined}
        onEdit={readOnly ? undefined : handleEdit}
        onDelete={readOnly ? undefined : handleDelete}
        onRefresh={undefined}
      />

      <InwardReceiptLineEditor
        opened={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleLineSave}
        line={editingLine}
        mode={editorMode}
      />
    </>
  );
};

export default InwardReceiptLineTable;