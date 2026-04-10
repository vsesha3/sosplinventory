/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button,
  Grid,  Stack, Loader, Center
} from '@mantine/core';
import { IconClipboardList } from '@tabler/icons-react';
import { FormTextInput }  from '../../components/common/FormTextInput';
import { FormSelect }     from '../../components/common/FormSelect';
import { ConfirmDialog }  from '../../components/common/ConfirmDialog';
import FormHeader         from '../common/Formheader';
import api from '../../services/api';
import type { WorkOrderApiData } from '../../types/workorder.types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DropDownOption {
  value: string;
  label: string;
}

interface DropDownApiResponse {
  success: boolean;
  message: string;
  data:    DropDownOption[];
}

export interface WorkOrderFormData {
  woId:        number | null;
  poId:        number | null;
  plant:       string | null;
  productId:   string | null;   // string for Select
  qty:         string;
  perUnitRate: string;
  woCode:      string;
  pmId:        string | null;   // string for Select
  lineItem:    string;
}

export interface WorkOrderFormProps {
  opened:   boolean;
  onClose:  () => void;
  onSave?:  (data: WorkOrderFormData) => void;
  woId?:    number | null;
  poId?:    number | null;
  mode?:    'create' | 'update';
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const defaultForm: WorkOrderFormData = {
  woId:        null,
  poId:        null,
  plant:       null,
  productId:   null,
  qty:         '',
  perUnitRate: '',
  woCode:      '',
  pmId:        null,
  lineItem:    '',
};

// ── Mapper: API → Form ────────────────────────────────────────────────────────

// ── Mapper: API → Form ────────────────────────────────────────────────────────

const mapApiToForm = (raw: WorkOrderApiData, pmOptions: DropDownOption[]): WorkOrderFormData => {
  // Find the matching pmOption value using both pmId and productId
  const matchedPm = pmOptions.find(option => {
    const [pmPart, productPart] = option.value.split('_');
    return (
      pmPart      === String(raw.pmId)      &&
      productPart === String(raw.productId)
    );
  });

  return {
    woId:        raw.woId,
    poId:        raw.poId,
    plant:       raw.plant       ?? null,
    productId:   raw.productId   != null ? String(raw.productId)   : null,
    qty:         raw.qty         != null ? String(raw.qty)         : '',
    perUnitRate: raw.perUnitRate != null ? String(raw.perUnitRate) : '',
    woCode:      raw.woCode      ?? '',
    pmId:        matchedPm?.value ?? null,   // "421_983" instead of just "421"
    lineItem:    raw.lineItem    ?? '',
  };
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const safe = (val: string): number => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

// ── Component ─────────────────────────────────────────────────────────────────

const WorkOrderForm: React.FC<WorkOrderFormProps> = ({
  opened,
  onClose,
  onSave,
  woId  = null,
  poId  = null,
  mode  = 'create',
}) => {

  const [form, setForm]             = useState<WorkOrderFormData>({ ...defaultForm });
  const [loading, setLoading]       = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen]           = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // ── Dropdowns ─────────────────────────────────────────────────────────────
  const [productOptions, setProductOptions] = useState<DropDownOption[]>([]);
  const [pmOptions, setPmOptions]           = useState<DropDownOption[]>([]);
  const [plantOptions, setPlantOptions]     = useState<DropDownOption[]>([]);

  // ── Computed ──────────────────────────────────────────────────────────────
  const qty         = safe(form.qty);
  const perUnitRate = safe(form.perUnitRate);
  const totalAmount = qty * perUnitRate;

  // ── Load ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!opened) {
      setForm({ ...defaultForm });
      setFetchError(null);
      setValidationErrors([]);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        // Load all dropdowns in parallel
        const [productRes, pmRes, plantRes] = await Promise.all([
          api.get<DropDownApiResponse>('/api/product/dropdown')
            .catch(() => ({ data: { data: [] } })),
          api.get<DropDownApiResponse>('/api/inventory/work-order/pm-details/dropdown')
            .catch(() => ({ data: { data: [] } })),
          api.get<DropDownApiResponse>('/api/inventory/plant/dropdown')
            .catch(() => ({ data: { data: [] } })),
        ]);

        setProductOptions(productRes.data.data ?? []);
        setPmOptions(pmRes.data.data ?? []);
        setPlantOptions(plantRes.data.data ?? []);

        // Load existing record in update mode
        if (mode === 'update' && woId) {
          const res = await api.get(`/api/inventory/work-order/${woId}`);
          const data: WorkOrderApiData = res.data.data;
          const fetchedPmOptions = pmRes.data.data ?? [];
          setForm(mapApiToForm(data, fetchedPmOptions));
        } else if (poId) {
          // Pre-fill poId for create mode
          setForm(prev => ({ ...prev, poId }));
        }
      } catch {
        setFetchError('Failed to load form data. Please close and try again.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [opened]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Form helpers ──────────────────────────────────────────────────────────

  const setStr = (field: keyof WorkOrderFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const setSelect = (field: keyof WorkOrderFormData) =>
    (value: string | null) =>
      setForm(prev => ({ ...prev, [field]: value }));

  // ── Validation ────────────────────────────────────────────────────────────

  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!form.productId)                    errors.push('Product is required');
    if (!form.qty || safe(form.qty) <= 0)   errors.push('Quantity must be greater than 0');
    if (!form.perUnitRate || safe(form.perUnitRate) <= 0)
                                            errors.push('Rate must be greater than 0');
    return errors;
  };

  const confirmLabel = mode === 'update' ? 'Update' : 'Save';

  // ── Title ─────────────────────────────────────────────────────────────────

  const headerTitle = mode === 'update' && form.woId
    ? `Edit Work Order — WO ID: ${form.woId}`
    : `New Work Order${poId ? ` — PO: ${poId}` : ''}`;

    // When productId changes, find matching pmOption and set pmId
const handleProductChange = (value:any) => {
    setForm(prev => ({ ...prev, productId: value }));

    // Find the pmOption where product_id part (after '_') matches selected productId
    const matchedPm = pmOptions.find(option => {
        const productPart = option.value.split('_')[1]; // extract 983 from "421_983"
        return productPart === String(value);
    });

    if (matchedPm) {
        setForm(prev => ({ ...prev, pmId: matchedPm.value })); // sets "421_983"
    } else {
        setForm(prev => ({ ...prev, pmId: '' })); // reset if no match
    }
};

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
        zIndex={300}
        styles={{
          body: {
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh',
            overflow: 'hidden',
          },
        }}
      >
        <Paper withBorder radius="md"
          style={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh',
          }}>

          {/* ── Header ── */}
          <FormHeader
            title={headerTitle}
            icon={<IconClipboardList size={18} color="white" />}
            color="#2c6e49"
            badge={mode === 'update' ? 'Edit Mode' : 'New'}
            badgeColor={mode === 'update' ? 'orange' : 'green'}
            onClose={onClose}
          />

          {/* ── Body ── */}
          {loading ? (
            <Center py={80} style={{ flex: 1 }}>
              <Stack align="center" gap="sm">
                <Loader size="md" />
                <Text size="sm" c="dimmed">Loading...</Text>
              </Stack>
            </Center>
          ) : (
            <Box style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }} p="lg">

              {fetchError && (
                <Text size="xs" c="red" mb="sm">{fetchError}</Text>
              )}

              {/* ── Info panel ── */}
              {(form.woId || form.poId) && (
                <Paper withBorder p="sm" mb="md" radius="sm"
                  style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                  <Group gap="xl">
                    {form.woId && (
                      <Stack gap={2}>
                        <Text size="xs" c="dimmed">WO Id</Text>
                        <Text size="sm" fw={600}>{form.woId}</Text>
                      </Stack>
                    )}
                    {form.poId && (
                      <Stack gap={2}>
                        <Text size="xs" c="dimmed">PO Id</Text>
                        <Text size="sm" fw={600}>{form.poId}</Text>
                      </Stack>
                    )}
                  </Group>
                </Paper>
              )}

              <Paper withBorder p="md" radius="sm"
                style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <Grid columns={12} gutter="sm">

                  {/* ── Row 1: WO Code | Line Item ── */}
                  <Grid.Col span={6}>
                    <FormTextInput
                      label="WO Code"
                      value={form.woCode}
                      onChange={setStr('woCode')}
                      placeholder="Enter WO code"
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <FormTextInput
                      label="Line Item"
                      value={form.lineItem}
                      onChange={setStr('lineItem')}
                      placeholder="Enter line item"
                    />
                  </Grid.Col>

                  {/* ── Row 2: Product | Plant ── */}
                  <Grid.Col span={6}>
                    <FormSelect
                      label="* Product"
                      value={form.productId}
                      onChange={handleProductChange}
                      data={productOptions}
                      placeholder="--------Select----------"
                      required
                      searchable
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <FormSelect
                      label="Plant"
                      value={form.plant}
                      onChange={setSelect('plant')}
                      data={plantOptions}
                      placeholder="--------Select----------"
                      searchable
                    />
                  </Grid.Col>

                  {/* ── Row 3: PM | empty ── */}
                  <Grid.Col span={6}>
                    <FormSelect
                      label="PM"
                      value={form.pmId}
                      onChange={setSelect('pmId')}
                      data={pmOptions}
                      placeholder="--------Select----------"
                      searchable
                    />
                  </Grid.Col>
                  <Grid.Col span={6} />

                  {/* ── Row 4: Qty | Rate ── */}
                  <Grid.Col span={6}>
                    <FormTextInput
                      label="* Quantity"
                      value={form.qty}
                      onChange={setStr('qty')}
                      placeholder="0.00"
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <FormTextInput
                      label="* Per Unit Rate"
                      value={form.perUnitRate}
                      onChange={setStr('perUnitRate')}
                      placeholder="0.00"
                      required
                    />
                  </Grid.Col>

                </Grid>
              </Paper>

              {/* ── Computed total ── */}
              {totalAmount > 0 && (
                <Paper withBorder p="sm" mt="md" radius="sm"
                  style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}>
                  <Group justify="space-between">
                    <Text size="sm" fw={500} c="dimmed">
                      Total Amount ({form.qty} × {form.perUnitRate})
                    </Text>
                    <Text size="sm" fw={700} c="blue">
                      ₹ {totalAmount.toFixed(2)}
                    </Text>
                  </Group>
                </Paper>
              )}

            </Box>
          )}

          {/* ── Footer — always pinned ── */}
          <Box px="lg" py="sm"
            style={{
              borderTop: '1px solid var(--mantine-color-gray-3)',
              backgroundColor: 'var(--mantine-color-body)',
              flexShrink: 0,
            }}
          >
            <Group justify="flex-end" gap="sm">
              <Button variant="default" size="sm" onClick={onClose}>Cancel</Button>
              <Button size="sm" color="green"
                onClick={() => {
                  const errors = validateForm();
                  setValidationErrors(errors);
                  setConfirmOpen(true);
                }}>
                {confirmLabel}
              </Button>
            </Group>
          </Box>

        </Paper>
      </Modal>

      <ConfirmDialog
        opened={confirmOpen}
        onClose={() => { setConfirmOpen(false); setValidationErrors([]); }}
        onConfirm={() => {
          onSave?.({ ...form });
          setConfirmOpen(false);
          onClose();
        }}
        message={`Are you sure you want to ${confirmLabel.toLowerCase()} this Work Order?`}
        confirmLabel={confirmLabel}
        errors={validationErrors}
        zIndex={350}
      />
    </>
  );
};

export default WorkOrderForm;