/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button,
  Grid, Badge, Stack, Divider,
} from '@mantine/core';
import { FormTextInput } from '../../components/common/FormTextInput';
import { FormDatePicker } from '../../components/common/FormDatePicker';
import { FormSelect }     from '../../components/common/FormSelect';
import { ConfirmDialog }  from '../../components/common/ConfirmDialog';
import type { DateValue } from '@mantine/dates';
import api from '../../services/api';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DropDownOption {
  value: string;
  label: string;
}

export interface InwardReceiptLine {
  poDetId:              number;
  poRmCode:             string;
  poRmName:             string;
  poUom:                string | null;
  rmOrderQty:           number;
  // ── Received fields ──
  rmReceivedQty:        string;
  receivedRate:         string;
  sgst:                 string;
  cgst:                 string;
  igst:                 string;
  // ── Delivery / inspection ──
  lotNumber:            string;
  expectedDeliveryDate: DateValue;
  actualDeliveryDate:   DateValue;
  inspectedBy:          string;
  approvedBy:           string;
}

export interface InwardReceiptLineEditorProps {
  opened:  boolean;
  onClose: () => void;
  onSave:  (line: InwardReceiptLine) => void;
  line?:   InwardReceiptLine | null;
  mode?:   'create' | 'edit';
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const defaultLine: InwardReceiptLine = {
  poDetId:              0,
  poRmCode:             '',
  poRmName:             '',
  poUom:                null,
  rmOrderQty:           0,
  rmReceivedQty:        '',
  receivedRate:         '',
  sgst:                 '',
  cgst:                 '',
  igst:                 '',
  lotNumber:            '',
  expectedDeliveryDate: null,
  actualDeliveryDate:   null,
  inspectedBy:          '',
  approvedBy:           '',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const safe = (val: string): number => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

// ── Validation ────────────────────────────────────────────────────────────────

const validate = (line: InwardReceiptLine): string[] => {
  const errors: string[] = [];
  if (!line.rmReceivedQty || parseFloat(line.rmReceivedQty) <= 0)
    errors.push('Received Quantity must be greater than 0');
  if (!line.receivedRate || parseFloat(line.receivedRate) <= 0)
    errors.push('Rate must be greater than 0');
  if (!line.expectedDeliveryDate)
    errors.push('Expected Delivery Date is required');
  if (!line.actualDeliveryDate)
    errors.push('Actual Delivery Date is required');
  return errors;
};

// ── Component ─────────────────────────────────────────────────────────────────

const InwardReceiptLineEditor: React.FC<InwardReceiptLineEditorProps> = ({
  opened,
  onClose,
  onSave,
  line,
  mode = 'edit',
}) => {
  const [form, setForm]                         = useState<InwardReceiptLine>({ ...defaultLine });
  const [confirmOpen, setConfirmOpen]           = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [employeeOptions, setEmployeeOptions]   = useState<DropDownOption[]>([]);

  // ── Computed tax values ───────────────────────────────────────────────────

  const qty      = safe(form.rmReceivedQty);
  const rate     = safe(form.receivedRate);
  const sgstPct  = safe(form.sgst);
  const cgstPct  = safe(form.cgst);
  const igstPct  = safe(form.igst);
  const subTotal  = qty * rate;
  const taxPct    = igstPct > 0 ? igstPct : (sgstPct + cgstPct);
  const taxAmount = subTotal * taxPct / 100;
  const lineTotal = subTotal + taxAmount;

  // ── Load ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!opened) {
      setValidationErrors([]);
      return;
    }
    setForm(line ? { ...line } : { ...defaultLine });
    api.get('/api/inventory/employees/dropdown')
      .then(res => setEmployeeOptions(res.data.data ?? []))
      .catch(() => setEmployeeOptions([]));
  }, [opened, line]);

  // ── Form helpers ──────────────────────────────────────────────────────────

 const setStr = (field: keyof InwardReceiptLine) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;  // ← was e.currentTarget.value
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const setDate = (field: keyof InwardReceiptLine) =>
    (value: DateValue) =>
      setForm(prev => ({ ...prev, [field]: value }));

  const setSelect = (field: keyof InwardReceiptLine) =>
    (value: string | null) =>
      setForm(prev => ({ ...prev, [field]: value ?? '' }));

  // SGST ↔ CGST mirror, clears IGST
  const handleSgstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, sgst: value, cgst: value, igst: '' }));
  };

  const handleCgstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, cgst: value, sgst: value, igst: '' }));
  };

  // IGST clears SGST/CGST
  const handleIgstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, igst: value, sgst: '', cgst: '' }));
  };

  const handleSaveClick = () => {
    const errors = validate(form);
    setValidationErrors(errors);
    setConfirmOpen(true);
  };

  const confirmLabel = mode === 'edit' ? 'Update' : 'Save';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={null}
        size="lg"
        padding={0}
        radius="md"
        withCloseButton={false}
        zIndex={350}
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
          style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

          {/* ── Header ── */}
          <Box px="lg" py="sm"
            style={{
              backgroundColor: '#2c6e49',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexShrink: 0,
            }}
          >
            <Group gap="sm">
              <Text fw={700} size="sm" c="white">
                {mode === 'edit' ? 'Edit Inward Receipt Line' : 'Add Inward Receipt Line'}
              </Text>
              {form.poRmCode && (
                <Badge variant="filled" size="sm"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  {form.poRmCode}
                </Badge>
              )}
            </Group>
          </Box>

          {/* ── Body ── */}
          <Box p="lg">

            {/* ── RM Info readonly panel ── */}
            <Paper withBorder p="sm" mb="md" radius="sm"
              style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
              <Group gap="xl">
                <Stack gap={2}>
                  <Text size="xs" c="dimmed">RM Code</Text>
                  <Text size="sm" fw={600}>{form.poRmCode || '—'}</Text>
                </Stack>
                <Stack gap={2}>
                  <Text size="xs" c="dimmed">RM Name</Text>
                  <Text size="sm" fw={600}>{form.poRmName || '—'}</Text>
                </Stack>
                <Stack gap={2}>
                  <Text size="xs" c="dimmed">UOM</Text>
                  <Text size="sm" fw={600}>{form.poUom || '—'}</Text>
                </Stack>
                <Stack gap={2}>
                  <Text size="xs" c="dimmed">PO Order Qty</Text>
                  <Text size="sm" fw={600}>{form.rmOrderQty.toFixed(3)}</Text>
                </Stack>
              </Group>
            </Paper>

            {/* ── Row 1: Received Qty | Rate ── */}
            <Grid gutter="md" mb="md">
              <Grid.Col span={6}>
                <FormTextInput
                  label="Received Quantity"
                  value={form.rmReceivedQty}
                  onChange={setStr('rmReceivedQty')}
                  placeholder="0.000"
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <FormTextInput
                  label="Rate / Amount"
                  value={form.receivedRate}
                  onChange={setStr('receivedRate')}
                  placeholder="0.00"
                  required
                />
              </Grid.Col>
            </Grid>

            {/* ── Row 2: SGST | CGST | IGST ── */}
            <Grid gutter="md" mb="md">
              <Grid.Col span={4}>
                <FormTextInput
                  label="SGST %"
                  value={form.sgst}
                  onChange={handleSgstChange}
                  placeholder="0.00"
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <FormTextInput
                  label="CGST %"
                  value={form.cgst}
                  onChange={handleCgstChange}
                  placeholder="0.00"
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <FormTextInput
                  label="IGST %"
                  value={form.igst}
                  onChange={handleIgstChange}
                  placeholder="0.00"
                />
              </Grid.Col>
            </Grid>

            {/* ── Tax Summary ── */}
            <Divider mb="md" />
            <Grid gutter="md" mb="md">
              <Grid.Col span={3}>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed">Sub Total</Text>
                  <Text size="sm" fw={600} ta="right"
                    style={{ padding: '6px 10px', backgroundColor: 'var(--mantine-color-gray-0)', borderRadius: 4, border: '1px solid var(--mantine-color-gray-3)' }}>
                    {subTotal > 0 ? subTotal.toFixed(2) : '—'}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={3}>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed">
                    Tax ({igstPct > 0 ? `IGST ${igstPct}%` : sgstPct > 0 ? `SGST+CGST ${sgstPct + cgstPct}%` : '0%'})
                  </Text>
                  <Text size="sm" fw={600} ta="right" c={taxAmount > 0 ? 'orange' : undefined}
                    style={{ padding: '6px 10px', backgroundColor: 'var(--mantine-color-gray-0)', borderRadius: 4, border: '1px solid var(--mantine-color-gray-3)' }}>
                    {taxAmount > 0 ? taxAmount.toFixed(2) : '—'}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={3}>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed">Tax %</Text>
                  <Text size="sm" fw={600} ta="right"
                    style={{ padding: '6px 10px', backgroundColor: 'var(--mantine-color-gray-0)', borderRadius: 4, border: '1px solid var(--mantine-color-gray-3)' }}>
                    {taxPct > 0 ? `${taxPct}%` : '—'}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={3}>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed">Line Total</Text>
                  <Text size="sm" fw={700} ta="right" c="blue"
                    style={{ padding: '6px 10px', backgroundColor: 'var(--mantine-color-blue-0)', borderRadius: 4, border: '1px solid var(--mantine-color-blue-3)' }}>
                    {lineTotal > 0 ? lineTotal.toFixed(2) : '—'}
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>

            <Divider mb="md" />

            {/* ── Row 3: Expected | Actual Delivery ── */}
            <Grid gutter="md" mb="md">
              <Grid.Col span={6}>
                <FormDatePicker
                  label="Expected Delivery Date"
                  value={form.expectedDeliveryDate}
                  onChange={setDate('expectedDeliveryDate')}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <FormDatePicker
                  label="Actual Delivery Date"
                  value={form.actualDeliveryDate}
                  onChange={setDate('actualDeliveryDate')}
                  required
                />
              </Grid.Col>
            </Grid>

            {/* ── Row 4: Inspected By | Approved By ── */}
            <Grid gutter="md">
              <Grid.Col span={6}>
                <FormSelect
                  label="Inspected By"
                  value={form.inspectedBy || null}
                  onChange={setSelect('inspectedBy')}
                  data={employeeOptions}
                  placeholder="Select employee"
                  searchable
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <FormSelect
                  label="Approved By"
                  value={form.approvedBy || null}
                  onChange={setSelect('approvedBy')}
                  data={employeeOptions}
                  placeholder="Select employee"
                  searchable
                />
              </Grid.Col>
            </Grid>

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
              <Button variant="default" size="sm" onClick={onClose}>Cancel</Button>
              <Button size="sm" color="green" onClick={handleSaveClick}>
                {confirmLabel}
              </Button>
            </Group>
          </Box>

        </Paper>
      </Modal>

      <ConfirmDialog
        opened={confirmOpen}
        onClose={() => { setConfirmOpen(false); setValidationErrors([]); }}
        onConfirm={() => { onSave(form); setConfirmOpen(false); }}
        message={`Are you sure you want to ${confirmLabel.toLowerCase()} this receipt line?`}
        confirmLabel={confirmLabel}
        errors={validationErrors}
        zIndex={400}
      />
    </>
  );
};

export default InwardReceiptLineEditor;