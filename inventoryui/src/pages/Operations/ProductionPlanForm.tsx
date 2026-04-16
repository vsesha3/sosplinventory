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
  value:       string;
  label:       string;
  quantity?:   string | null;
  productName?: string | null;
  productCode?: string | null;
  poId?:       string | null;
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
        const [vesselRes] = await Promise.all([
          api.get(' /api/misc/vessels/dropdown').catch(() => ({ data: { data: [] } })),
         
        ]);
        setVesselOptions(vesselRes.data.data ?? []);
       
        if (mode === 'update' && productionPlanId) {
          const res = await api.get(`/api/inventory/production-plan/${productionPlanId}`);
          const d   = res.data.data;
          console.log('🔍 Single Plan API Response:', d);           // ← full object
  console.log('productName  :', d.productName);             // ← check field name
  console.log('sapCode      :', d.sapCode);                 // ← check field name
  console.log('productCode  :', d.productCode); 
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

const handleWoChange = (value: string | null) => {
  if (!value) {
    setForm(prev => ({ ...prev, woId: null, productName: '', sapCode: '' }));
    return;
  }

  const selected = woOptions.find(o => o.value === value);

  setForm(prev => ({
    ...prev,
    woId:        value,
    productName: selected?.productName ?? '',
    sapCode:     selected?.productCode ?? '',
    remainingQty: selected?.quantity    ?? '0',
   
  }));
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



  // ── Keep this for use in validateForm / confirmLabel / etc. ──────────────────
/* const dateValid =
  form.productionFromDate && form.productionToDate
    ? new Date(form.productionFromDate) <= new Date(form.productionToDate)
    : true; */

// ── Replace the old useEffect + populateDropDownForWorkOrder with this ────────
useEffect(() => {
  if (!form.productionFromDate || !form.productionToDate) return;

  const isValid =
    new Date(form.productionFromDate) <= new Date(form.productionToDate);

  if (!isValid) {
    setValidationErrors(prev => [
      ...prev.filter(e => e !== 'From Date must be before To Date'),
      'From Date must be before To Date',
    ]);
    setWoOptions([]);
    return;
  }

  // Clear the date-order error
  setValidationErrors(prev =>
    prev.filter(e => e !== 'From Date must be before To Date'),
  );

  // Populate WO dropdown
  const fromDate = new Date(form.productionFromDate).toISOString().split('T')[0];
  const toDate   = new Date(form.productionToDate).toISOString().split('T')[0];

  let cancelled = false; // prevent stale setState if dates change rapidly

  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/api/inventory/work-order/dropdown?fromDate=${fromDate}&toDate=${toDate}`,
      );
      if (!cancelled) setWoOptions(res.data.data ?? []);
    } catch {
      if (!cancelled) setWoOptions([]);
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  fetchWorkOrders();

  return () => { cancelled = true; }; // cleanup on rapid date changes

}, [form.productionFromDate, form.productionToDate]);



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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const qty = e.target.value;
                          const selected = woOptions.find(o => o.value === form.woId);
                          const available = parseFloat(selected?.quantity ?? '0');
                          const remaining = available - parseFloat(qty || '0');

                          setForm(prev => ({
                            ...prev,
                            qty: qty,
                            remainingQty: isNaN(remaining) ? '0' : String(Math.max(0, remaining)),
                          }));
                        }}
                        placeholder="0"
                        required
                      />
                    </Grid.Col>
                  <Grid.Col span={6}>
                   
                    <FormTextInput
                      label="Remaining Qty (text)"
                      value={form.remainingQty} 
                      onChange={() => {}}
                      placeholder="Auto-filled from Work Order"
                      readOnly
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