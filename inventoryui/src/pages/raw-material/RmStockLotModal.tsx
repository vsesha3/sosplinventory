import React, { useState, useEffect } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button, Badge, Stack, Table,
  Loader, Center, TextInput, ActionIcon, Tooltip,
} from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RmStockLine {
  receiptId:    number;
  lotNo:        string | null;
  rmCode:       string | null;
  rmName:       string | null;
  totalQty:     number | null;
  perUnitRate:  number | null;
  issuedQty:    number | null;
  remainingQty: number | null;
  receiptDate:  string | null;
  grnNo:        string | null;
  invoiceNo:    string | null;
}

// Issue qty entered per lot, keyed by receiptId
export type LotIssueMap = Record<number, string>;

export interface RmStockLotModalProps {
  opened:       boolean;
  onClose:      () => void;
  // May post the issue — a rejected promise keeps the popup open and shows the error
  onSave:       (issues: LotIssueMap) => void | Promise<void>;
  saveHint?:    string | null;    // shown above the footer, e.g. when the issue is deferred
  rmCode:       string | null;
  rmName:       string | null;
  requiredQty:  number | null;
  issuedQty?:   number | null;    // already issued against this request line (saved request)
  lots:         RmStockLine[];
  loading?:     boolean;
  issues?:      LotIssueMap;    // previously saved issue qty for this RM
  onRefresh?:   () => void;
  readOnly?:    boolean;
  // 'PM' = packing material (same stock endpoint, labels say PM). Default 'RM'.
  itemType?:    'RM' | 'PM';
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const safe = (val: string | undefined): number => {
  const n = parseFloat(val ?? '');
  return isNaN(n) ? 0 : n;
};

// Quantities: always 2 decimals — 100 → "100.00", 50.5 → "50.50"
const fmtQty = (v: number | null | undefined): string =>
  v == null || isNaN(v) ? '—' : v.toLocaleString('en-IN', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });

const fmtDate = (val: string | null): string => {
  if (!val) return '—';
  const d = new Date(val);
  return isNaN(d.getTime()) ? val : d.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const summaryBox = {
  padding: '6px 10px',
  backgroundColor: 'var(--mantine-color-gray-0)',
  borderRadius: 4,
  border: '1px solid var(--mantine-color-gray-3)',
};

// ── Component ─────────────────────────────────────────────────────────────────

const RmStockLotModal: React.FC<RmStockLotModalProps> = ({
  opened,
  onClose,
  onSave,
  rmCode,
  rmName,
  requiredQty,
  issuedQty,
  lots,
  loading = false,
  issues,
  onRefresh,
  readOnly = false,
  saveHint,
  itemType = 'RM',
}) => {
  const kind = itemType;   // "RM" / "PM" in labels
  const [issueQty, setIssueQty]                 = useState<LotIssueMap>({});
  const [confirmOpen, setConfirmOpen]           = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [saving, setSaving]                     = useState(false);
  const [saveError, setSaveError]               = useState<string | null>(null);

  // ── Load ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!opened) {
      setValidationErrors([]);
      setSaveError(null);
      return;
    }
    setIssueQty(issues ? { ...issues } : {});
  }, [opened, issues]);

  // Still to issue before this entry: required − already issued
  const openQty = requiredQty != null ? requiredQty - (issuedQty ?? 0) : null;

  // Single lot and nothing entered yet → prefill with what's still to issue
  useEffect(() => {
    if (!opened || loading || lots.length !== 1 || openQty == null || openQty <= 0) return;
    if (issues && Object.keys(issues).length > 0) return;
    const lot = lots[0];
    const qty = Math.min(openQty, lot.remainingQty ?? openQty);
    if (qty > 0) setIssueQty({ [lot.receiptId]: qty.toFixed(2) });
  }, [opened, loading, lots, openQty, issues]);

  // ── Computed ──────────────────────────────────────────────────────────────

  const totalIssue   = lots.reduce((s, l) => s + safe(issueQty[l.receiptId]), 0);
  const totalRemain  = lots.reduce((s, l) => s + (l.remainingQty ?? 0), 0);
  const balanceQty   = openQty != null ? openQty - totalIssue : null;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleIssueChange = (receiptId: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setIssueQty(prev => ({ ...prev, [receiptId]: value }));
      setValidationErrors([]);
    };

  const validate = (): string[] => {
    const errors: string[] = [];
    lots.forEach(l => {
      const raw = issueQty[l.receiptId];
      if (!raw) return;
      const qty = parseFloat(raw);
      const lot = l.lotNo ?? `#${l.receiptId}`;
      if (isNaN(qty) || qty < 0)
        errors.push(`Lot ${lot}: Issue Qty must be a valid number`);
      else if (l.remainingQty != null && qty > l.remainingQty)
        errors.push(`Lot ${lot}: Issue Qty cannot exceed Remaining Qty (${fmtQty(l.remainingQty)})`);
    });
    if (totalIssue <= 0)
      errors.push('Enter Issue Qty for at least one lot');
    if (openQty != null && totalIssue > openQty + 0.005)
      errors.push(issuedQty
        ? `Total Issue Qty (${fmtQty(totalIssue)}) cannot exceed the balance to issue (${fmtQty(openQty)}) — ${fmtQty(issuedQty)} of ${fmtQty(requiredQty)} already issued`
        : `Total Issue Qty (${fmtQty(totalIssue)}) cannot exceed Required Qty (${fmtQty(requiredQty)})`);
    return errors;
  };

  const handleSaveClick = () => {
    setValidationErrors(validate());
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    // Keep only lots with a qty entered
    const cleaned: LotIssueMap = {};
    lots.forEach(l => {
      if (safe(issueQty[l.receiptId]) > 0) cleaned[l.receiptId] = issueQty[l.receiptId];
    });
    setConfirmOpen(false);
    setSaving(true);
    setSaveError(null);
    try {
      await onSave(cleaned);
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || err?.message || 'Failed to save RM issue.');
    } finally {
      setSaving(false);
    }
  };

  // ── Rows ──────────────────────────────────────────────────────────────────

  const rows = lots.map(l => {
    const qty     = safe(issueQty[l.receiptId]);
    const over    = l.remainingQty != null && qty > l.remainingQty;
    const noStock = (l.remainingQty ?? 0) <= 0;
    return (
      <Table.Tr key={l.receiptId} bg={qty > 0 ? 'var(--mantine-color-blue-0)' : undefined}>
        <Table.Td><Text size="xs" fw={500}>{l.lotNo ?? '—'}</Text></Table.Td>
        <Table.Td><Text size="xs">{l.grnNo ?? '—'}</Text></Table.Td>
        <Table.Td ta="right"><Text size="xs" fw={500}>{fmtQty(l.totalQty)}</Text></Table.Td>
        <Table.Td ta="right"><Text size="xs" c="orange">{fmtQty(l.issuedQty)}</Text></Table.Td>
        <Table.Td ta="right">
          <Text size="xs" fw={600} c={noStock ? 'red' : 'green'}>{fmtQty(l.remainingQty)}</Text>
        </Table.Td>
        <Table.Td><Text size="xs">{fmtDate(l.receiptDate)}</Text></Table.Td>
        <Table.Td><Text size="xs">{l.invoiceNo ?? '—'}</Text></Table.Td>
        <Table.Td>
          <TextInput
            size="xs"
            value={issueQty[l.receiptId] ?? ''}
            onChange={handleIssueChange(l.receiptId)}
            placeholder="0.00"
            disabled={readOnly || noStock}
            error={over}
            styles={{ input: { textAlign: 'right' } }}
          />
        </Table.Td>
      </Table.Tr>
    );
  });

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={null}
        size="xl"
        padding={0}
        radius="md"
        withCloseButton={false}
        zIndex={300}
        styles={{
          body: {
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        }}
      >
        <Paper withBorder radius="md"
          style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>

          {/* ── Header ── */}
          <Box px="lg" py="sm"
            style={{
              backgroundColor: '#2c6e49',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexShrink: 0,
            }}
          >
            <Group gap="sm">
              <Text fw={700} size="sm" c="white">{kind} Stock Lot Wise Selection</Text>
              {rmCode && (
                <Badge variant="filled" size="sm"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  {rmCode}
                </Badge>
              )}
            </Group>
            {onRefresh && (
              <Tooltip label="Refresh stock" position="left">
                <ActionIcon variant="subtle" color="white" onClick={onRefresh}>
                  <IconRefresh size={16} />
                </ActionIcon>
              </Tooltip>
            )}
          </Box>

          {/* ── Body ── */}
          <Box p="lg" style={{ flex: 1, overflowY: 'auto' }}>

            {/* ── RM info ── */}
            <Paper withBorder p="sm" mb="md" radius="sm"
              style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
              <Group gap="xl">
                <Stack gap={2}>
                  <Text size="xs" c="dimmed">{kind} Code</Text>
                  <Text size="sm" fw={600}>{rmCode || '—'}</Text>
                </Stack>
                <Stack gap={2}>
                  <Text size="xs" c="dimmed">{kind} Name</Text>
                  <Text size="sm" fw={600}>{rmName || '—'}</Text>
                </Stack>
                <Stack gap={2}>
                  <Text size="xs" c="dimmed">{kind === 'PM' ? 'Required Packs' : 'Required Qty'}</Text>
                  <Text size="sm" fw={600} c="blue">{fmtQty(requiredQty)}</Text>
                </Stack>
                {issuedQty != null && (
                  <Stack gap={2}>
                    <Text size="xs" c="dimmed">Already Issued</Text>
                    <Text size="sm" fw={600} c="orange">{fmtQty(issuedQty)}</Text>
                  </Stack>
                )}
                <Stack gap={2}>
                  <Text size="xs" c="dimmed">Available Qty</Text>
                  <Text size="sm" fw={600} c="green">{fmtQty(totalRemain)}</Text>
                </Stack>
                <Stack gap={2}>
                  <Text size="xs" c="dimmed">Lots</Text>
                  <Text size="sm" fw={600}>{lots.length}</Text>
                </Stack>
              </Group>
            </Paper>

            {/* ── Lot table ── */}
            {loading ? (
              <Center py={40}>
                <Stack align="center" gap="xs">
                  <Loader size="sm" />
                  <Text size="xs" c="dimmed">Loading stock...</Text>
                </Stack>
              </Center>
            ) : lots.length === 0 ? (
              <Text size="xs" c="dimmed" ta="center" py="md">
                No stock found for {kind}: {rmCode}
              </Text>
            ) : (
              <Table withTableBorder withColumnBorders striped highlightOnHover verticalSpacing={4}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Lot No</Table.Th>
                    <Table.Th>GRN No</Table.Th>
                    <Table.Th ta="right">Total Qty</Table.Th>
                    <Table.Th ta="right">Issued Qty</Table.Th>
                    <Table.Th ta="right">Remaining Qty</Table.Th>
                    <Table.Th>Receipt Date</Table.Th>
                    <Table.Th>Invoice No</Table.Th>
                    <Table.Th w={120} ta="right">Issue Qty</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
                <Table.Tfoot>
                  <Table.Tr style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                    <Table.Td colSpan={4}>
                      <Text size="xs" fw={600}>{lots.length} lot{lots.length !== 1 ? 's' : ''}</Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="xs" fw={700} c="green">{fmtQty(totalRemain)}</Text>
                    </Table.Td>
                    <Table.Td colSpan={2} />
                    <Table.Td ta="right">
                      <Text size="xs" fw={700} c="blue">{fmtQty(totalIssue)}</Text>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tfoot>
              </Table>
            )}

            {/* ── Issue summary ── */}
            <Group grow mt="md">
              <Stack gap={4}>
                <Text size="xs" c="dimmed">Required Qty</Text>
                <Text size="sm" fw={600} ta="right" style={summaryBox}>{fmtQty(requiredQty)}</Text>
              </Stack>
              <Stack gap={4}>
                <Text size="xs" c="dimmed">Total Issue Qty</Text>
                <Text size="sm" fw={700} ta="right" c="blue"
                  style={{ ...summaryBox, backgroundColor: 'var(--mantine-color-blue-0)', border: '1px solid var(--mantine-color-blue-3)' }}>
                  {fmtQty(totalIssue)}
                </Text>
              </Stack>
              <Stack gap={4}>
                <Text size="xs" c="dimmed">Balance to Issue</Text>
                <Text size="sm" fw={600} ta="right" style={summaryBox}
                  c={balanceQty != null && balanceQty < -0.005 ? 'red' : balanceQty === 0 ? 'green' : 'orange'}>
                  {fmtQty(balanceQty)}
                </Text>
              </Stack>
            </Group>

            {saveHint && !readOnly && (
              <Text size="xs" c="dimmed" mt="sm">{saveHint}</Text>
            )}
            {saveError && (
              <Text size="xs" c="red" mt="sm">{saveError}</Text>
            )}

          </Box>

          {/* ── Footer ── */}
          <Box px="lg" py="sm"
            style={{
              borderTop: '1px solid var(--mantine-color-gray-3)',
              backgroundColor: 'var(--mantine-color-body)',
              flexShrink: 0,
            }}
          >
            <Group justify="flex-end">
              <Button variant="default" size="sm" onClick={onClose} disabled={saving}>
                {readOnly ? 'Close' : 'Cancel'}
              </Button>
              {!readOnly && (
                <Button size="sm" color="green" onClick={handleSaveClick}
                  loading={saving} disabled={loading || lots.length === 0}>
                  Save
                </Button>
              )}
            </Group>
          </Box>

        </Paper>
      </Modal>

      <ConfirmDialog
        opened={confirmOpen}
        onClose={() => { setConfirmOpen(false); setValidationErrors([]); }}
        onConfirm={handleConfirm}
        message={`Are you sure you want to issue ${fmtQty(totalIssue)} of ${rmName ?? rmCode ?? `this ${kind}`}?`}
        confirmLabel="Save"
        errors={validationErrors}
        zIndex={350}
      />
    </>
  );
};

export default RmStockLotModal;
