import React, { useEffect, useState } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button, Grid, Stack, Loader, Center, Alert,
} from '@mantine/core';
import type { DateValue } from '@mantine/dates';
import { IconPackageImport, IconInfoCircle } from '@tabler/icons-react';
import dayjs from 'dayjs';
import api from '../../services/api';
import FormHeader from '../common/Formheader';
import { FormDatePicker } from '../../components/common/FormDatePicker';
import { FormTextInput } from '../../components/common/FormTextInput';
import { FormSelect } from '../../components/common/FormSelect';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import type { DropDownOption, DropDownApiResponse } from '../../types/common.types';

// ── Production Entry — finished goods produced against a production plan ─────
// Product and produced qty come from GET /api/inventory/production-plan/{id}/capacity.
// Only "Validated By" is editable; everything else is read-only.

// Matches SosProductionOutputRequest (POST /api/inventory/production-plan/production-output)
export interface ProductionEntryFormData {
  productionPlanId: number;
  productionLotNo:  string;
  productionDate:   string;          // LocalDateTime: YYYY-MM-DDTHH:mm:ss
  producedQty:      number | null;
  remarks:          string | null;
  createdBy:        string | null;   // "Validated By"
}

export interface ProductionEntryFormProps {
  opened:           boolean;
  onClose:          () => void;
  onSave?:          (data: ProductionEntryFormData) => void;
  saving?:          boolean;
  productionPlanId: number | null;
  woCode?:          string | null;   // header context only
}

interface Capacity {
  productId:             number | null;
  productName:           string;
  productCode:           string;
  rmProductionCapacity:  number | null;
  pmProductionCapacity:  number | null;
  productProduced:       number | null;
}

// BigDecimal may arrive as a number, a string, or { source, parsedValue }
const toNum = (v: any): number | null => {
  if (v == null) return null;
  if (typeof v === 'number') return v;
  if (typeof v === 'object') {
    const n = v.parsedValue ?? (v.source != null ? Number(v.source) : null);
    return n != null && !isNaN(n) ? Number(n) : null;
  }
  const n = Number(v);
  return isNaN(n) ? null : n;
};

const fmtQty = (n: number | null) => (n != null ? n.toFixed(2) : '—');

const ProductionEntryForm: React.FC<ProductionEntryFormProps> = ({
  opened, onClose, onSave, saving = false, productionPlanId, woCode,
}) => {
  const [loading, setLoading]       = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [capacity, setCapacity]     = useState<Capacity | null>(null);
  const [employees, setEmployees]   = useState<DropDownOption[]>([]);

  const [productionDate, setProductionDate] = useState<DateValue>(new Date());
  const [validatedBy, setValidatedBy]       = useState<string | null>(null);
  const [productionLotNo, setProductionLotNo] = useState('');
  const [remarks, setRemarks]               = useState('');

  const [confirmOpen, setConfirmOpen]           = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // ── Load capacity + employees ─────────────────────────────────────────────

  useEffect(() => {
    if (!opened) {
      setCapacity(null); setFetchError(null); setValidatedBy(null);
      setProductionLotNo(''); setRemarks('');
      setValidationErrors([]);
      return;
    }
    if (productionPlanId == null) return;

    setProductionDate(new Date());
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const [capRes, empRes] = await Promise.all([
          api.get(`/api/inventory/production-plan/${productionPlanId}/capacity`),
          api.get<DropDownApiResponse>('/api/inventory/employees/dropdown'),
        ]);
        if (cancelled) return;

        // Endpoint returns the projection directly; also accept an ApiResponse wrapper
        const c = capRes.data?.data ?? capRes.data ?? {};
        setCapacity({
          productId:            c.productId ?? null,
          productName:          c.productName ?? '',
          productCode:          c.productCode ?? '',
          rmProductionCapacity: toNum(c.rmProductionCapacity),
          pmProductionCapacity: toNum(c.pmProductionCapacity),
          productProduced:      toNum(c.productProduced),
        });
        setEmployees((empRes.data?.data ?? []).filter(o => o.label != null && o.value != null));
      } catch (err: any) {
        if (!cancelled) {
          setFetchError(err?.response?.data?.message || 'Failed to load production details.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [opened, productionPlanId]);

  // ── Validation / submit ───────────────────────────────────────────────────

  const validate = (): string[] => {
    const errors: string[] = [];
    if (!capacity)                                   errors.push('Production details are not loaded');
    if (!productionDate)                             errors.push('Production Date is required');
    if (capacity && (capacity.productProduced ?? 0) <= 0)
                                                     errors.push('Produced Quantity must be greater than 0');
    if (!productionLotNo.trim())                     errors.push('Production Lot No is required');
    if (!validatedBy)                              errors.push('Validated By is required');
    return errors;
  };

  const handleSubmit = () => {
    setValidationErrors(validate());
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (productionPlanId == null || !capacity) return;
    onSave?.({
      productionPlanId,
      productionLotNo: productionLotNo.trim(),
      // Date is today; time is the moment of saving
      productionDate:  dayjs(productionDate)
        .hour(dayjs().hour()).minute(dayjs().minute()).second(dayjs().second())
        .format('YYYY-MM-DDTHH:mm:ss'),
      producedQty:     capacity.productProduced,
      remarks:         remarks.trim() || null,
      createdBy:       validatedBy,
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={null}
        size="55%"
        padding={0}
        radius="md"
        withCloseButton={false}
        zIndex={300}
        styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden' } }}
      >
        <Paper withBorder radius="md"
          style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

          <FormHeader
            title={`Finished Goods Entry — Plan #${productionPlanId ?? ''}${woCode ? ` (${woCode})` : ''}`}
            icon={<IconPackageImport size={18} color="white" />}
            color="#4a6fa5"
            badge="New Entry"
            badgeColor="green"
            onClose={onClose}
          />

          {loading ? (
            <Center py={60} style={{ flex: 1 }}>
              <Stack align="center" gap="sm">
                <Loader size="md" />
                <Text size="sm" c="dimmed">Loading production details...</Text>
              </Stack>
            </Center>
          ) : (
            <Box style={{ flex: 1, overflowY: 'auto' }} p="lg">
              {fetchError && (
                <Alert color="red" variant="light" mb="md" p="xs">
                  <Text size="xs">{fetchError}</Text>
                </Alert>
              )}

              <Paper withBorder p="md" radius="sm" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <Grid columns={12} gutter="sm">
                  <Grid.Col span={4}>
                    <FormDatePicker
                      label="Production Date"
                      value={productionDate}
                      onChange={() => { }}
                      required
                      readOnly
                    />
                  </Grid.Col>
                  <Grid.Col span={8}>
                    <FormTextInput
                      label="Product Name"
                      value={capacity
                        ? `${capacity.productCode ? `${capacity.productCode} — ` : ''}${capacity.productName}`
                        : ''}
                      onChange={() => { }}
                      readOnly
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Produced Quantity"
                      value={capacity ? fmtQty(capacity.productProduced) : ''}
                      onChange={() => { }}
                      readOnly
                    />
                  </Grid.Col>
                  <Grid.Col span={8}>
                    <FormSelect
                      label="Validated By"
                      value={validatedBy}
                      onChange={setValidatedBy}
                      data={employees}
                      placeholder="Select employee"
                      required
                      searchable
                      disabled={!capacity}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Production Lot No"
                      value={productionLotNo}
                      onChange={e => setProductionLotNo(e.target.value)}
                      placeholder="e.g. 2611"
                      required
                      disabled={!capacity}
                    />
                  </Grid.Col>
                  <Grid.Col span={8}>
                    <FormTextInput
                      label="Remarks"
                      value={remarks}
                      onChange={e => setRemarks(e.target.value)}
                      placeholder="Optional"
                      disabled={!capacity}
                    />
                  </Grid.Col>
                </Grid>
              </Paper>

              {capacity && (
                <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light" mt="md" p="xs">
                  <Text size="xs">
                    Production capacity from issued material — RM: <b>{fmtQty(capacity.rmProductionCapacity)}</b>
                    {' · '}PM: <b>{fmtQty(capacity.pmProductionCapacity)}</b>
                  </Text>
                </Alert>
              )}
            </Box>
          )}

          <Box px="lg" py="sm"
            style={{ borderTop: '1px solid var(--mantine-color-gray-3)', backgroundColor: 'var(--mantine-color-body)', flexShrink: 0 }}>
            <Group justify="flex-end" gap="sm">
              <Button variant="light" size="sm" color="red" onClick={onClose}>Cancel</Button>
              <Button size="sm" color="blue" loading={saving}
                disabled={loading || !capacity}
                onClick={handleSubmit}>
                Save
              </Button>
            </Group>
          </Box>
        </Paper>
      </Modal>

      <ConfirmDialog
        opened={confirmOpen}
        onClose={() => { setConfirmOpen(false); setValidationErrors([]); }}
        onConfirm={handleConfirm}
        message={`Save finished goods entry of ${fmtQty(capacity?.productProduced ?? null)} for ${capacity?.productName ?? 'this product'}?`}
        confirmLabel="Save"
        errors={validationErrors}
        zIndex={350}
      />
    </>
  );
};

export default ProductionEntryForm;
