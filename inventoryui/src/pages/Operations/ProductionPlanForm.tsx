/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button,
  Grid,  Stack, Loader, Center,
} from '@mantine/core';
import { IconCalendarStats } from '@tabler/icons-react';
import { FormTextInput }  from '../../components/common/FormTextInput';
import { FormSelect }     from '../../components/common/FormSelect';
import { FormDatePicker } from '../../components/common/FormDatePicker';
import { ConfirmDialog }  from '../../components/common/ConfirmDialog';
import FormHeader         from '../common/Formheader';
import api from '../../services/api';
import type { DateValue } from '@mantine/dates';
import type { ProductionPlanFormData } from '../../types/production.types';
import { defaultProductionPlanForm, mapSingleApiToForm } from '../../types/production.types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DropDownOption {
  value: string;
  label: string;
}

export interface ProductionPlanFormProps {
  opened:              boolean;
  onClose:             () => void;
  onSave?:             (data: ProductionPlanFormData) => void;
  productionPlanId?:   number | null;
  mode?:               'create' | 'update';
}

// ── Component ─────────────────────────────────────────────────────────────────

const ProductionPlanForm: React.FC<ProductionPlanFormProps> = ({
  opened,
  onClose,
  onSave,
  productionPlanId = null,
  mode             = 'create',
}) => {

  const [form, setForm]             = useState<ProductionPlanFormData>({ ...defaultProductionPlanForm });
  const [loading, setLoading]       = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen]           = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // ── Dropdowns ─────────────────────────────────────────────────────────────
  const [vesselOptions, setVesselOptions] = useState<DropDownOption[]>([]);
  const [woOptions, setWoOptions]         = useState<DropDownOption[]>([]);

  // Remaining qty options — 0 to 10
  const remainingQtyOptions = Array.from({ length: 11 }, (_, i) => ({
    value: String(i),
    label: String(i),
  }));

  // ── Load ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!opened) {
      setForm({ ...defaultProductionPlanForm });
      setFetchError(null);
      setValidationErrors([]);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const [vesselRes, woRes] = await Promise.all([
          api.get('/api/inventory/vessel/dropdown').catch(() => ({ data: { data: [] } })),
          api.get('/api/inventory/work-order/dropdown').catch(() => ({ data: { data: [] } })),
        ]);
        setVesselOptions(vesselRes.data.data ?? []);
        setWoOptions(woRes.data.data ?? []);

        if (mode === 'update' && productionPlanId) {
          const res = await api.get(`/api/inventory/production-plan/${productionPlanId}`);
          const d   = res.data.data;
          setForm(mapSingleApiToForm(d));
        }
      } catch {
        setFetchError('Failed to load form data. Please close and try again.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [opened]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-fill product details when WO changes ─────────────────────────────

  const handleWoChange = async (value: string | null) => {
    setForm(prev => ({ ...prev, woId: value, productName: '', sapCode: '' }));
    if (!value) return;
    try {
      const res = await api.get(`/api/inventory/work-order/${value}`);
      const d   = res.data.data;
      setForm(prev => ({
        ...prev,
        woId:        value,
        productName: d.productName ?? '',
        sapCode:     d.productCode ?? d.sapCode ?? '',
      }));
    } catch {
      // non-critical — just leave blank
    }
  };

  // ── Form helpers ──────────────────────────────────────────────────────────

  const setStr = (field: keyof ProductionPlanFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const setDate = (field: keyof ProductionPlanFormData) =>
    (value: DateValue) =>
      setForm(prev => ({ ...prev, [field]: value }));

  const setSelect = (field: keyof ProductionPlanFormData) =>
    (value: string | null) =>
      setForm(prev => ({ ...prev, [field]: value }));

  // ── Validation ────────────────────────────────────────────────────────────

  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!form.productionFromDate)           errors.push('From Date is required');
    if (!form.productionToDate)             errors.push('To Date is required');
    if (!form.vesselId)                     errors.push('Vessel is required');
    if (!form.woId)                         errors.push('Work Order is required');
    if (!form.qty || parseFloat(form.qty) <= 0)
                                            errors.push('Quantity must be greater than 0');
    return errors;
  };

  const confirmLabel = mode === 'update' ? 'Update' : 'Save';

  const headerTitle = mode === 'update' && form.productionPlanId
    ? `Edit Production Plan — #${form.productionPlanId}`
    : 'New Production Plan';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={null}
        size="60%"
        padding={0}
        radius="md"
        withCloseButton={false}
        zIndex={200}
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
          style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

          {/* ── Header ── */}
          <FormHeader
            title={headerTitle}
            icon={<IconCalendarStats size={18} color="white" />}
            color="#4a6fa5"
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

              {fetchError && <Text size="xs" c="red" mb="sm">{fetchError}</Text>}

              <Paper withBorder p="md" radius="sm"
                style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <Grid columns={12} gutter="sm">

                  {/* ── Row 1: From Date | To Date ── */}
                  <Grid.Col span={6}>
                    <FormDatePicker
                      label="* From Date"
                      value={form.productionFromDate}
                      onChange={setDate('productionFromDate')}
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <FormDatePicker
                      label="* To Date"
                      value={form.productionToDate}
                      onChange={setDate('productionToDate')}
                      required
                    />
                  </Grid.Col>

                  {/* ── Row 2: Vessels | Work Order Code ── */}
                  <Grid.Col span={6}>
                    <FormSelect
                      label="* Vessels"
                      value={form.vesselId}
                      onChange={setSelect('vesselId')}
                      data={vesselOptions}
                      placeholder="--------Select----------"
                      required
                      searchable
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <FormSelect
                      label="* Work Order Code"
                      value={form.woId}
                      onChange={handleWoChange}
                      data={woOptions}
                      placeholder="--------Select----------"
                      required
                      searchable
                    />
                  </Grid.Col>

                  {/* ── Row 3: Product (readonly) | SAP Code (readonly) ── */}
                  <Grid.Col span={6}>
                    <FormTextInput
                      label="Product"
                      value={form.productName}
                      onChange={() => {}}
                      placeholder="Auto-filled from Work Order"
                      readOnly
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <FormTextInput
                      label="SAP Code"
                      value={form.sapCode}
                      onChange={() => {}}
                      placeholder="Auto-filled from Work Order"
                      readOnly
                    />
                  </Grid.Col>

                  {/* ── Row 4: Quantity | Remaining Qty ── */}
                  <Grid.Col span={6}>
                    <FormTextInput
                      label="* Quantity"
                      value={form.qty}
                      onChange={setStr('qty')}
                      placeholder="0"
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <FormSelect
                      label="Remaining Qty"
                      value={form.remainingQty}
                      onChange={setSelect('remainingQty')}
                      data={remainingQtyOptions}
                      placeholder="0"
                    />
                  </Grid.Col>

                  {/* ── Row 5: Plan / COA Reference ── */}
                  <Grid.Col span={12}>
                    <FormTextInput
                      label="Plan / COA Reference"
                      value={form.coaReference}
                      onChange={setStr('coaReference')}
                      placeholder="e.g. MARCH - 5 / 2026"
                    />
                  </Grid.Col>

                </Grid>
              </Paper>

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
              <Button size="sm" color="blue"
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
        message={`Are you sure you want to ${confirmLabel.toLowerCase()} this Production Plan?`}
        confirmLabel={confirmLabel}
        errors={validationErrors}
        zIndex={250}
      />
    </>
  );
};

export default ProductionPlanForm;