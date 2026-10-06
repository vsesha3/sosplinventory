/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button,
  Grid,  Stack, Loader, Center, Tooltip, ActionIcon, MultiSelect
} from '@mantine/core';
import { IconClipboardList, IconPlus } from '@tabler/icons-react';
import { FormTextInput }  from '../../components/common/FormTextInput';
import { FormSelect }     from '../../components/common/FormSelect';
import { ConfirmDialog }  from '../../components/common/ConfirmDialog';
import FormHeader         from '../common/Formheader';
import QuickAddModal      from '../../components/common/QuickAddModal';
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
  uomId:       string | null;   // from product master
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
  uomId:       null,
  qty:         '',
  perUnitRate: '',
  woCode:      '',
  pmId:        null,
  lineItem:    '',
};

// ── Mapper: API → Form ────────────────────────────────────────────────────────

const mapApiToForm = (raw: WorkOrderApiData): WorkOrderFormData => {
  return {
    woId:        raw.woId,
    poId:        raw.poId,
    plant:       raw.plant       ?? null,
    productId:   raw.productId   != null ? String(raw.productId)   : null,
    uomId:       raw.uomId       != null ? String(raw.uomId)       : null,
    qty:        raw.qty         != null ? String(raw.qty)         : '',
    perUnitRate: raw.perUnitRate != null ? String(raw.perUnitRate) : '',
    woCode:      raw.woCode      ?? '',
    pmId:        raw.pmId        != null ? String(raw.pmId)        : null,
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
  const [uomOptions, setUomOptions]         = useState<DropDownOption[]>([]);
  const [plantOptions, setPlantOptions]     = useState<DropDownOption[]>([]);

  // ── QuickAdd: Plant ───────────────────────────────────────────────────────
  const [addPlantOpen, setAddPlantOpen] = useState(false);
  const [newPlantName, setNewPlantName] = useState('');
  const [quickSaving, setQuickSaving]   = useState(false);

  // PM list associated with the selected product (null = no product selected)
  const [productPmOptions, setProductPmOptions] = useState<DropDownOption[] | null>(null);
  const [pmLoading, setPmLoading]               = useState(false);

  // Latest selected product — ignores stale responses
  const latestProductRef = useRef<string | null>(null);

  // ── Product details: uomId (/api/product) + PM list (product-pm-list_{id}) ──
  // PM and UOM are not editable — both follow the selected product.
  // pmId saved = the WO's existing PM if still associated (edit), else the first PM.
  // setUom=false keeps the WO's own uomId (edit mode).
  const loadProductDetails = async (
    productId: string | null,
    keepPmId: number | string | null = null,
    setUom = true,
  ) => {
    latestProductRef.current = productId;
    if (!productId) {
      setProductPmOptions(null);
      setPmLoading(false);
      return;
    }

    setPmLoading(true);
    try {
      const [productRes, pmRes] = await Promise.all([
        api.get(`/api/product/${productId}`).catch(() => null),
        api.get<DropDownApiResponse>(`/api/dropdown/product-pm-list_${productId}`)
          .catch(() => ({ data: { data: [] as DropDownOption[] } })),
      ]);
      if (latestProductRef.current !== productId) return;   // product changed meanwhile

      const product = productRes ? (productRes.data?.data ?? productRes.data) : null;
      const options: DropDownOption[] = (pmRes.data.data ?? [])
        .filter(o => o != null && o.value != null)
        .map(o => ({ value: String(o.value), label: o.label ?? '-' }));

      const kept = keepPmId != null
        ? options.find(o => o.value === String(keepPmId))
        : undefined;

      const productUomId = product?.uomId != null ? String(product.uomId) : null;

      setProductPmOptions(options);
      setForm(prev => ({
        ...prev,
        uomId: setUom ? productUomId : (prev.uomId ?? productUomId),
        pmId:  kept?.value ?? options[0]?.value ?? null,
      }));
    } finally {
      if (latestProductRef.current === productId) setPmLoading(false);
    }
  };

  // ── Computed ──────────────────────────────────────────────────────────────
  const qty         = safe(form.qty);
  const perUnitRate = safe(form.perUnitRate);
  const totalAmount = qty * perUnitRate;

  // ── Load ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!opened) {
      latestProductRef.current = null;
      setProductPmOptions(null);
      setPmLoading(false);
      setForm({ ...defaultForm });
      setFetchError(null);
      setValidationErrors([]);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        // Load all dropdowns in parallel
        const [productRes, uomRes, plantRes] = await Promise.all([
          api.get<DropDownApiResponse>('/api/dropdown/product')
            .catch(() => ({ data: { data: [] } })),
          api.get<DropDownApiResponse>('/api/dropdown/uom')
            .catch(() => ({ data: { data: [] } })),
          api.get<DropDownApiResponse>('/api/dropdown/plant-name')
            .catch(() => ({ data: { data: [] } })),
        ]);

        setProductOptions(productRes.data.data ?? []);
        setUomOptions(
          (uomRes.data.data ?? []).map(o => ({
            value: String(o.value),
            label: String(o.label ?? '').split('~')[0].trim(),
          }))
        );
        setPlantOptions(plantRes.data.data ?? []);

        // Load existing record in update mode
        if (mode === 'update' && woId) {
          const res = await api.get(`/api/inventory/work-order/${woId}`);
          const data: WorkOrderApiData = res.data.data;
          setForm(mapApiToForm(data));
          if (data.productId != null) {
            await loadProductDetails(String(data.productId), data.pmId, false);
          }
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

  // ── QuickAdd handlers ─────────────────────────────────────────────────────

  const handleAddPlant = async () => {
    const name = newPlantName.trim();
    if (!name) return;
    setQuickSaving(true);
    try {
      const res = await api.post('/api/inventory/misc-master', {
        miscCode: 'PLANT',
        miscName: name,
        isActive: true,
      });
      const created = res.data?.data ?? res.data;
      const createdId = created?.miscId ?? created?.id ?? null;

      // Refresh plant dropdown
      const plantRes = await api.get<DropDownApiResponse>('/api/dropdown/plant-name')
        .catch(() => ({ data: { data: [] as DropDownOption[] } }));
      let updated: DropDownOption[] = (plantRes.data.data ?? [])
        .map(o => ({ value: String(o.value), label: String(o.label ?? '-') }));

      // Auto-select the new plant — by returned id first, then by name
      let match = (createdId != null ? updated.find(o => o.value === String(createdId)) : undefined)
        ?? updated.find(o => o.label.trim().toLowerCase() === name.toLowerCase());

      // Not in the refreshed list yet — add it so the Select can show it
      if (!match && createdId != null) {
        match = { value: String(createdId), label: created?.miscName ?? name };
        updated = [...updated, match];
      }

      setPlantOptions(updated);
      if (match) {
        const plant = match.value;
        setForm(prev => ({ ...prev, plant }));
      }
      setNewPlantName('');
      setAddPlantOpen(false);
    } catch (err: any) {
      console.error('[handleAddPlant] Failed:', err?.response?.data ?? err);
      setFetchError(
        err?.response?.data?.message || 'Failed to add Plant. Please try again.'
      );
    } finally {
      setQuickSaving(false);
    }
  };

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
    if (form.perUnitRate.trim() && (isNaN(Number(form.perUnitRate)) || Number(form.perUnitRate) < 0))
                                            errors.push('Average Rate must be a valid number');
    return errors;
  };

  const confirmLabel = mode === 'update' ? 'Update' : 'Save';

  // ── Title ─────────────────────────────────────────────────────────────────

  const headerTitle = mode === 'update' && form.woId
    ? `Edit Work Order — WO ID: ${form.woId}`
    : `New Work Order${poId ? ` — PO: ${poId}` : ''}`;

  // When productId changes, fetch the product's uomId and its PM list
  const handleProductChange = (value: string | null) => {
    setForm(prev => ({ ...prev, productId: value, uomId: null, pmId: null }));
    loadProductDetails(value);
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

              <Paper withBorder p="md" radius="sm"
                style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <Grid columns={12} gutter="sm">

                  {/* ── Row 1: Work Order ID | Product ── */}
                  <Grid.Col span={6}>
                    <FormTextInput
                      label="Work Order ID"
                      value={form.woId != null ? String(form.woId) : ''}
                      onChange={() => {}}
                      placeholder="Auto generated"
                      readOnly
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <FormSelect
                      label="Product"
                      value={form.productId}
                      onChange={handleProductChange}
                      data={productOptions}
                      placeholder="--------Select----------"
                      required
                      searchable
                    />
                  </Grid.Col>

                  {/* ── Row 2: Plant | WO Code ── */}
                  <Grid.Col span={6}>
                    <Group gap="xs" align="flex-end">
                      <Box style={{ flex: 1 }}>
                        <FormSelect
                          label="Plant"
                          value={form.plant}
                          onChange={setSelect('plant')}
                          data={plantOptions}
                          placeholder="--------Select----------"
                          searchable
                        />
                      </Box>
                      <Tooltip label="Add new Plant" position="top">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          size="lg"
                          mb={1}
                          onClick={() => { setNewPlantName(''); setAddPlantOpen(true); }}
                        >
                          <IconPlus size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <FormTextInput
                      label="WO Code"
                      value={form.woCode}
                      onChange={setStr('woCode')}
                      placeholder="Enter WO code"
                    />
                  </Grid.Col>

                  {/* ── Row 3: Line Item | UOM (from product, not editable) ── */}
                  <Grid.Col span={6}>
                    <FormTextInput
                      label="Line Item"
                      value={form.lineItem}
                      onChange={setStr('lineItem')}
                      placeholder="Enter line item"
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <FormSelect
                      label="UOM"
                      value={form.uomId}
                      onChange={() => {}}
                      data={uomOptions}
                      placeholder={
                        pmLoading          ? 'Loading...'
                        : !form.productId  ? 'Select a product first'
                        : 'No UOM for this product'
                      }
                      disabled
                    />
                  </Grid.Col>

                  {/* ── Row 4: PM — all packing materials of the product, not editable ── */}
                  <Grid.Col span={12}>
                    <MultiSelect
                      label={
                        (productPmOptions?.length ?? 0) > 1
                          ? `PM (Packing Material) — ${productPmOptions!.length} items`
                          : 'PM (Packing Material)'
                      }
                      data={productPmOptions ?? []}
                      value={(productPmOptions ?? []).map(o => o.value)}
                      placeholder={
                        pmLoading                         ? 'Loading...'
                        : !form.productId                 ? 'Select a product first'
                        : productPmOptions?.length === 0  ? 'No PM associated with this product'
                        : undefined
                      }
                      size="sm"
                      disabled
                    />
                  </Grid.Col>

                  {/* ── Row 5: Qty | Average Rate ── */}
                  <Grid.Col span={6}>
                    <FormTextInput
                      label="Quantity"
                      value={form.qty}
                      onChange={setStr('qty')}
                      placeholder="0.00"
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <FormTextInput
                      label="Average Rate"
                      value={form.perUnitRate}
                      onChange={setStr('perUnitRate')}
                      placeholder="0.00"
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

      {/* ── QuickAdd: Plant ── */}
      <QuickAddModal
        opened={addPlantOpen}
        onClose={() => setAddPlantOpen(false)}
        title="Add Plant"
        label="Plant Name"
        value={newPlantName}
        onChange={setNewPlantName}
        onSave={handleAddPlant}
        saving={quickSaving}
      />
    </>
  );
};

export default WorkOrderForm;