import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button, Grid, Badge, Stack, Loader, Center,
  Divider, Table, Select, TextInput, NumberInput, ActionIcon, Tooltip, Alert, ScrollArea,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import type { DateValue } from '@mantine/dates';
import { IconBuildingWarehouse, IconPlus, IconTrash, IconInfoCircle } from '@tabler/icons-react';
import dayjs from 'dayjs';
import api from '../../../services/api';
import FormHeader from '../../common/Formheader';
import { FormTextInput } from '../../../components/common/FormTextInput';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';

// ── Opening Stock — stock carried over from the legacy application ──────────
// Same shell as the Material Inward entry form (header panel + line items + footer).
// One line = one lot of one material: Material → Material Type / UOM (auto),
// Previous Lot No, Actual Date & Time of Stock Entry, Qty Carried Over, Transfer Rate / Qty.

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OpeningStockLine {
  key:              number;          // local row key only
  rmId:             number | null;
  rmCode:           string;
  rmName:           string;
  materialType:     string | null;   // RM / PM / MI — from rm_master
  uomName:          string;
  previousLotNo:    string;
  stockEntryDate:   DateValue;       // actual date & time of stock entry
  qtyCarriedOver:   number | '';
  transferRate:     number | '';     // per qty
}

export interface OpeningStockFormData {
  referenceNo: string;
  remarks:     string;
  lines:       OpeningStockLine[];
}

interface RmOption {
  rmId:         number;
  rmCode:       string;
  rmName:       string;
  materialType: string | null;
  uomName:      string;
}

export interface OpeningStockFormProps {
  opened:   boolean;
  onClose:  () => void;
  onSave?:  (data: OpeningStockFormData) => void;
  saving?:  boolean;
  // Pre-fill the first line with this material (e.g. the row selected in the RM master)
  initialRmId?: number | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const MATERIAL_TYPE_LABELS: Record<string, string> = {
  RM: 'Raw Material',
  PM: 'Packing Material',
  MI: 'Miscellaneous',
};

const MATERIAL_TYPE_COLORS: Record<string, string> = { RM: 'blue', PM: 'grape', MI: 'gray' };

const num = (v: number | '') => (typeof v === 'number' && !isNaN(v) ? v : 0);

const fmt2 = (n: number) =>
  n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

let keySeq = 1;

const emptyLine = (stockEntryDate: DateValue = null): OpeningStockLine => ({
  key:            keySeq++,
  rmId:           null,
  rmCode:         '',
  rmName:         '',
  materialType:   null,
  uomName:        '',
  previousLotNo:  '',
  stockEntryDate,
  qtyCarriedOver: '',
  transferRate:   '',
});

const applyMaterial = (line: OpeningStockLine, rm: RmOption | undefined): OpeningStockLine => ({
  ...line,
  rmId:         rm?.rmId ?? null,
  rmCode:       rm?.rmCode ?? '',
  rmName:       rm?.rmName ?? '',
  materialType: rm?.materialType ?? null,
  uomName:      rm?.uomName ?? '',
});

// ── Component ─────────────────────────────────────────────────────────────────

const OpeningStockForm: React.FC<OpeningStockFormProps> = ({
  opened, onClose, onSave, saving = false, initialRmId = null,
}) => {
  const [materials, setMaterials]   = useState<RmOption[]>([]);
  const [loading, setLoading]       = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [referenceNo, setReferenceNo] = useState('');
  const [remarks, setRemarks]         = useState('');
  const [lines, setLines]             = useState<OpeningStockLine[]>([]);

  const [confirmOpen, setConfirmOpen]           = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // ── Load materials (RM master list carries type + UOM, so no lookup per line) ──

  useEffect(() => {
    if (!opened) {
      setReferenceNo(''); setRemarks(''); setLines([]);
      setFetchError(null); setValidationErrors([]);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/rm', {
          params: { page: 0, size: 5000, sortBy: 'rmName', sortDir: 'asc' },
        });
        const list: RmOption[] = (res.data?.data?.content ?? []).map((r: any) => ({
          rmId:         Number(r.rmId),
          rmCode:       r.rmCode != null ? String(r.rmCode) : '',
          rmName:       r.rmName ?? '',
          materialType: r.materialType ?? null,
          uomName:      r.uomName ?? '',
        }));
        setMaterials(list);

        const first = emptyLine(new Date());
        const pre = initialRmId != null ? list.find(m => m.rmId === initialRmId) : undefined;
        setLines([pre ? applyMaterial(first, pre) : first]);
      } catch {
        setFetchError('Failed to load materials. Please close and try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [opened]); // eslint-disable-line react-hooks/exhaustive-deps

  const materialOptions = useMemo(
    () => materials.map(m => ({
      value: String(m.rmId),
      label: `${m.rmCode} — ${m.rmName}`,
    })),
    [materials],
  );

  // ── Line helpers ──────────────────────────────────────────────────────────

  const updateLine = (key: number, patch: Partial<OpeningStockLine>) =>
    setLines(prev => prev.map(l => (l.key === key ? { ...l, ...patch } : l)));

  const handleMaterialChange = (key: number, value: string | null) => {
    const rm = materials.find(m => String(m.rmId) === value);
    setLines(prev => prev.map(l => (l.key === key ? applyMaterial(l, rm) : l)));
  };

  // New line copies the previous line's date & time (legacy entries are usually one cut-over date)
  const addLine = () =>
    setLines(prev => [...prev, emptyLine(prev.length ? prev[prev.length - 1].stockEntryDate : new Date())]);

  const removeLine = (key: number) => setLines(prev => prev.filter(l => l.key !== key));

  // ── Totals ────────────────────────────────────────────────────────────────

  const lineValue  = (l: OpeningStockLine) => num(l.qtyCarriedOver) * num(l.transferRate);
  const totalValue = lines.reduce((s, l) => s + lineValue(l), 0);
  const filled     = lines.filter(l => l.rmId != null && num(l.qtyCarriedOver) > 0).length;

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = (): string[] => {
    const errors: string[] = [];
    if (lines.length === 0) errors.push('Add at least one item');

    const seen = new Set<string>();
    lines.forEach((l, i) => {
      const row = `Line ${i + 1}${l.rmName ? ` (${l.rmName})` : ''}`;
      if (l.rmId == null)               errors.push(`${row}: Material is required`);
      if (!l.previousLotNo.trim())      errors.push(`${row}: Previous Lot No is required`);
      if (!l.stockEntryDate)            errors.push(`${row}: Actual Date & Time of Stock Entry is required`);
      if (num(l.qtyCarriedOver) <= 0)   errors.push(`${row}: Qty Carried Over must be greater than 0`);
      if (l.transferRate === '' || num(l.transferRate) < 0)
                                        errors.push(`${row}: Transfer Rate / Qty is required`);

      if (l.rmId != null && l.previousLotNo.trim()) {
        const k = `${l.rmId}|${l.previousLotNo.trim().toUpperCase()}`;
        if (seen.has(k)) errors.push(`${row}: Lot ${l.previousLotNo.trim()} is entered twice for this material`);
        seen.add(k);
      }
    });
    return errors;
  };

  const handleSubmit = () => {
    setValidationErrors(validate());
    setConfirmOpen(true);
  };

  // ── Rows ──────────────────────────────────────────────────────────────────

  const rows = lines.map((l, idx) => (
    <Table.Tr key={l.key}>
      <Table.Td ta="center"><Text size="xs" c="dimmed">{idx + 1}</Text></Table.Td>

      {/* Material */}
      <Table.Td style={{ minWidth: 260 }}>
        <Select
          size="xs"
          placeholder="Search code or name"
          data={materialOptions}
          value={l.rmId != null ? String(l.rmId) : null}
          onChange={v => handleMaterialChange(l.key, v)}
          searchable
          clearable
          limit={50}
          nothingFoundMessage="No material found"
          comboboxProps={{ withinPortal: true, zIndex: 9999 }}
        />
      </Table.Td>

      {/* Material Type — auto */}
      <Table.Td>
        {l.materialType
          ? <Badge size="sm" variant="light" tt="none" color={MATERIAL_TYPE_COLORS[l.materialType] ?? 'gray'}>
              {MATERIAL_TYPE_LABELS[l.materialType] ?? l.materialType}
            </Badge>
          : <Text size="xs" c="dimmed">—</Text>}
      </Table.Td>

      {/* UOM — auto */}
      <Table.Td><Text size="xs">{l.uomName || '—'}</Text></Table.Td>

      {/* Previous Lot No */}
      <Table.Td style={{ minWidth: 150 }}>
        <TextInput
          size="xs"
          placeholder="Legacy lot no"
          value={l.previousLotNo}
          onChange={e => updateLine(l.key, { previousLotNo: e.currentTarget.value })}
        />
      </Table.Td>

      {/* Actual Date & Time of Stock Entry */}
      <Table.Td style={{ minWidth: 190 }}>
        <DateTimePicker
          size="xs"
          placeholder="DD-MMM-YYYY HH:mm"
          valueFormat="DD-MMM-YYYY HH:mm"
          value={l.stockEntryDate}
          onChange={v => updateLine(l.key, { stockEntryDate: v })}
          maxDate={new Date()}
          clearable
          popoverProps={{ withinPortal: true, zIndex: 9999 }}
        />
      </Table.Td>

      {/* Qty Carried Over */}
      <Table.Td style={{ minWidth: 130 }}>
        <NumberInput
          size="xs"
          placeholder="0.00"
          value={l.qtyCarriedOver}
          onChange={v => updateLine(l.key, { qtyCarriedOver: v === '' ? '' : Number(v) })}
          min={0}
          decimalScale={3}
          hideControls
          rightSection={l.uomName ? <Text size="10px" c="dimmed" pr={4}>{l.uomName}</Text> : undefined}
          rightSectionWidth={l.uomName ? 44 : undefined}
          styles={{ input: { textAlign: 'right' } }}
        />
      </Table.Td>

      {/* Transfer Rate / Qty */}
      <Table.Td style={{ minWidth: 120 }}>
        <NumberInput
          size="xs"
          placeholder="0.00"
          value={l.transferRate}
          onChange={v => updateLine(l.key, { transferRate: v === '' ? '' : Number(v) })}
          min={0}
          decimalScale={2}
          hideControls
          leftSection={<Text size="xs" c="dimmed">₹</Text>}
          styles={{ input: { textAlign: 'right' } }}
        />
      </Table.Td>

      {/* Value — computed */}
      <Table.Td ta="right">
        {lineValue(l) > 0
          ? <Text size="xs" fw={600} c="blue">₹{fmt2(lineValue(l))}</Text>
          : <Text size="xs" c="dimmed">—</Text>}
      </Table.Td>

      <Table.Td>
        <Tooltip label="Remove line">
          <ActionIcon variant="subtle" color="red" size="sm" onClick={() => removeLine(l.key)}>
            <IconTrash size={14} />
          </ActionIcon>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={null}
        size="90%"
        padding={0}
        radius="md"
        withCloseButton={false}
        zIndex={300}
        styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden' } }}
      >
        <Paper withBorder radius="md"
          style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

          {/* ── Header ── */}
          <FormHeader
            title="Opening Stock Entry — Carried Over from Legacy"
            icon={<IconBuildingWarehouse size={18} color="white" />}
            color="#4a6fa5"
            badge="New Entry"
            badgeColor="green"
            onClose={onClose}
          />

          {/* ── Body ── */}
          {loading ? (
            <Center py={80} style={{ flex: 1 }}>
              <Stack align="center" gap="sm">
                <Loader size="md" />
                <Text size="sm" c="dimmed">Loading materials...</Text>
              </Stack>
            </Center>
          ) : (
            <Box style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }} p="lg">

              {fetchError && <Text size="xs" c="red" mb="sm">{fetchError}</Text>}

              <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light" mb="md" p="xs">
                <Text size="xs">
                  Enter stock balances brought over from the legacy application — one line per lot.
                  Material Type and UOM fill in automatically from the Raw Material Master.
                </Text>
              </Alert>

              <Paper withBorder p="md" mb="md" radius="sm"
                style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <Grid columns={12} gutter="sm">
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Legacy Reference No."
                      value={referenceNo}
                      onChange={e => setReferenceNo(e.target.value)}
                      placeholder="e.g. legacy stock statement no."
                    />
                  </Grid.Col>
                  <Grid.Col span={8}>
                    <FormTextInput
                      label="Remarks"
                      value={remarks}
                      onChange={e => setRemarks(e.target.value)}
                      placeholder="Optional"
                    />
                  </Grid.Col>
                </Grid>
              </Paper>

              {/* ── Line Items ── */}
              <Divider
                label={
                  <Group gap="xs">
                    <Text size="sm" fw={500}>Opening Stock Items</Text>
                    {lines.length > 0 && (
                      <Badge size="xs" variant="light" color="blue">
                        {lines.length} item{lines.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </Group>
                }
                labelPosition="left"
                mb="sm"
              />

              <Group justify="flex-end" mb="xs">
                <Button size="xs" leftSection={<IconPlus size={14} />} onClick={addLine}>
                  Add Line
                </Button>
              </Group>

              <Paper withBorder radius="sm">
                <ScrollArea type="auto">
                  <Table verticalSpacing={6} horizontalSpacing="xs" striped withColumnBorders>
                    <Table.Thead style={{ backgroundColor: 'var(--mantine-color-gray-1)' }}>
                      <Table.Tr>
                        <Table.Th w={36} ta="center"><Text size="xs" fw={600}>#</Text></Table.Th>
                        <Table.Th><Text size="xs" fw={600}><Text span c="red">* </Text>Material</Text></Table.Th>
                        <Table.Th><Text size="xs" fw={600}>Material Type</Text></Table.Th>
                        <Table.Th><Text size="xs" fw={600}>UOM</Text></Table.Th>
                        <Table.Th><Text size="xs" fw={600}><Text span c="red">* </Text>Previous Lot No</Text></Table.Th>
                        <Table.Th><Text size="xs" fw={600}><Text span c="red">* </Text>Actual Date & Time of Stock Entry</Text></Table.Th>
                        <Table.Th ta="right"><Text size="xs" fw={600}><Text span c="red">* </Text>Qty Carried Over</Text></Table.Th>
                        <Table.Th ta="right"><Text size="xs" fw={600}><Text span c="red">* </Text>Transfer Rate / Qty</Text></Table.Th>
                        <Table.Th ta="right"><Text size="xs" fw={600}>Value</Text></Table.Th>
                        <Table.Th w={40} />
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {rows.length > 0 ? rows : (
                        <Table.Tr>
                          <Table.Td colSpan={10}>
                            <Text size="sm" c="dimmed" ta="center" py="lg">
                              No items yet — use Add Line to enter opening stock.
                            </Text>
                          </Table.Td>
                        </Table.Tr>
                      )}
                    </Table.Tbody>
                    {lines.length > 0 && (
                      <Table.Tfoot>
                        <Table.Tr style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                          <Table.Td colSpan={8}>
                            <Text size="xs" fw={600}>Total</Text>
                          </Table.Td>
                          <Table.Td ta="right">
                            <Text size="xs" fw={700} c="blue">₹{fmt2(totalValue)}</Text>
                          </Table.Td>
                          <Table.Td />
                        </Table.Tr>
                      </Table.Tfoot>
                    )}
                  </Table>
                </ScrollArea>
              </Paper>
            </Box>
          )}

          {/* ── Footer ── */}
          <Box px="lg" py="sm"
            style={{ borderTop: '1px solid var(--mantine-color-gray-3)', backgroundColor: 'var(--mantine-color-body)', flexShrink: 0 }}>
            <Group justify="space-between" align="center">
              <Stack gap={2}>
                <Text size="xs" c="dimmed">
                  {lines.length > 0 ? `${filled} of ${lines.length} lines with qty` : 'No items'}
                </Text>
                {totalValue > 0 && (
                  <Text size="xs" fw={700} c="blue">Total Opening Stock Value: ₹{fmt2(totalValue)}</Text>
                )}
              </Stack>
              <Group gap="sm">
                <Button variant="light" size="sm" color="red" onClick={onClose}>Cancel</Button>
                <Button size="sm" color="blue" disabled={lines.length === 0 || loading} loading={saving}
                  onClick={handleSubmit}>
                  Submit
                </Button>
              </Group>
            </Group>
          </Box>
        </Paper>
      </Modal>

      <ConfirmDialog
        opened={confirmOpen}
        onClose={() => { setConfirmOpen(false); setValidationErrors([]); }}
        onConfirm={() => onSave?.({ referenceNo, remarks, lines })}
        message={`Save opening stock for ${lines.length} line${lines.length !== 1 ? 's' : ''} (total ₹${fmt2(totalValue)})?`}
        confirmLabel="Submit"
        errors={validationErrors}
        zIndex={350}
      />
    </>
  );
};

export default OpeningStockForm;

// Format a line's date & time for the API (LocalDateTime-friendly)
export const toApiDateTime = (v: DateValue): string | null =>
  v ? dayjs(v).format('YYYY-MM-DDTHH:mm:ss') : null;
