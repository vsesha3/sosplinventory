/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button,
  Grid, Stack, Loader, Center,
} from '@mantine/core';
import { IconPackage } from '@tabler/icons-react';
import { FormTextInput } from '../../../components/common/FormTextInput';
import { FormSelect }    from '../../../components/common/FormSelect';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import FormHeader        from '../../common/Formheader';
import api from '../../../services/api';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DropDownOption {
  value: string;
  label: string;
}

export interface PackingMaterialFormData {
  id?:        number | null;
  pmCode:     string;
  sapCode:    string;
  pmName:     string;
  pmSize:     string;
  uomId:      string | null;
  tareWgt:    string;
  fgLotCode:  string;
  pmGroupId:  string | null;
  hNhId:      string | null;
  avgRate:    string;
  gstRate:    string;
  packSize:   string;
  capacity:   string;
}

export interface PackingMaterialFormProps {
  opened:  boolean;
  onClose: () => void;
  onSave?: (data: PackingMaterialFormData) => void;
  pmId?:   number | null;
  mode?:   'create' | 'update';
}

// ── Default form ──────────────────────────────────────────────────────────────

const defaultForm: PackingMaterialFormData = {
  id:        null,
  pmCode:    '',
  sapCode:   '',
  pmName:    '',
  pmSize:    '',
  uomId:     null,
  tareWgt:   '',
  fgLotCode: '',
  pmGroupId: null,
  hNhId:     null,
  avgRate:   '',
  gstRate:   '',
  packSize:  '',
  capacity:  '',
};

// ── Validation ────────────────────────────────────────────────────────────────

const validateForm = (form: PackingMaterialFormData): string[] => {
  const errors: string[] = [];

  if (!form.pmCode.trim())
    errors.push('PM Code is required');

  if (!form.pmName.trim())
    errors.push('PM Name is required');

  if (!form.pmSize || parseFloat(form.pmSize) <= 0)
    errors.push('PM Size is required and must be greater than 0');

  if (!form.uomId)
    errors.push('UOM is required');

  if (!form.fgLotCode.trim())
    errors.push('FG Lot Code is required');

  if (!form.avgRate || parseFloat(form.avgRate) <= 0)
    errors.push('Avg Rate is required and must be greater than 0');

  if (form.gstRate && isNaN(parseFloat(form.gstRate)))
    errors.push('GST % must be a valid number');

  if (form.packSize && isNaN(parseFloat(form.packSize)))
    errors.push('Pack Size must be a valid number');

  if (form.capacity && isNaN(parseFloat(form.capacity)))
    errors.push('Capacity must be a valid number');

  return errors;
};

// ── Component ─────────────────────────────────────────────────────────────────

const PackingMaterialForm: React.FC<PackingMaterialFormProps> = ({
  opened,
  onClose,
  onSave,
  pmId = null,
  mode = 'create',
}) => {

  const [form,        setForm]        = useState<PackingMaterialFormData>({ ...defaultForm });
  const [loading,     setLoading]     = useState(false);
  const [fetchError,  setFetchError]  = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [uomOptions,   setUomOptions]   = useState<DropDownOption[]>([]);
  const [groupOptions, setGroupOptions] = useState<DropDownOption[]>([]);
  const [hNhOptions,   setHNhOptions]   = useState<DropDownOption[]>([]);

  // ── Filter helper ─────────────────────────────────────────────────────────

  const clean = (arr: any[]): DropDownOption[] =>
    (arr ?? []).filter(o => o.label != null && o.value != null);

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
        const [uomRes, groupRes, hNhRes] = await Promise.all([
          api.get('/api/uom/dropdown').catch(() => ({ data: { data: [] } })),
          api.get('/api/pm/dropdownPmGroup').catch(() => ({ data: { data: [] } })),
          api.get('/api/hnh/dropdown').catch(() => ({ data: { data: [] } })),
        ]);

        setUomOptions(clean(uomRes.data.data));
        setGroupOptions(clean(groupRes.data.data));
        setHNhOptions(clean(hNhRes.data.data));

        if (mode === 'update' && pmId) {
          const res = await api.get(`/api/pm/${pmId}`);
          const d   = res.data.data ?? res.data;
          setForm({
            id:        d.pmId      ?? null,
            pmCode:    d.pmCode    != null ? String(d.pmCode)    : '',
            sapCode:   d.sapCode   ?? '',
            pmName:    d.pmName    ?? '',
            pmSize:    d.pmSize    != null ? String(d.pmSize)    : '',
            uomId:     d.uomId     != null ? String(d.uomId)     : null,
            tareWgt:   d.tareWgt   != null ? String(d.tareWgt)   : '',
            fgLotCode: d.fgLotCode != null ? String(d.fgLotCode) : '',
            pmGroupId: d.pmGroupId != null ? String(d.pmGroupId) : null,
            hNhId:     d.hNhId     != null ? String(d.hNhId)     : null,
            avgRate:   d.avgRate   != null
              ? String(typeof d.avgRate === 'object'
                  ? (d.avgRate.parsedValue ?? d.avgRate.source ?? '')
                  : d.avgRate)
              : '',
            gstRate:   d.gstRate   != null ? String(d.gstRate)  : '',
            packSize:  d.packSize  != null ? String(d.packSize) : '',
            capacity:  d.capacity  != null ? String(d.capacity) : '',
          });
        }
      } catch {
        setFetchError('Failed to load form data. Please close and try again.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [opened]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helpers ───────────────────────────────────────────────────────────────

  const setStr = (field: keyof PackingMaterialFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      if (validationErrors.length > 0) setValidationErrors([]);
    };

  const setSelect = (field: keyof PackingMaterialFormData) =>
    (value: string | null) => {
      setForm(prev => ({ ...prev, [field]: value }));
      if (validationErrors.length > 0) setValidationErrors([]);
    };

  const handleSubmitClick = () => {
    const errors = validateForm(form);
    setValidationErrors(errors);
    if (errors.length === 0) setConfirmOpen(true);
  };

  const confirmLabel = mode === 'update' ? 'Update' : 'Submit';
  const headerTitle  = mode === 'update' && form.id
    ? `Edit Packing Material — ${form.pmName || `#${pmId}`}`
    : 'New Packing Material';

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
            icon={<IconPackage size={18} color="white" />}
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

                  {/* ── Row 1: PM Code | SAP Code ── */}
                  <Grid.Col span={6}>
                    <FormTextInput
                      label="* PM Code"
                      value={form.pmCode}
                      onChange={setStr('pmCode')}
                      placeholder="e.g. 100"
                      required
                      readOnly={mode === 'update'}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <FormTextInput
                      label="SAP Code"
                      value={form.sapCode}
                      onChange={setStr('sapCode')}
                      placeholder="SAP Code"
                    />
                  </Grid.Col>

                  {/* ── Row 2: PM Name (full width) ── */}
                  <Grid.Col span={12}>
                    <FormTextInput
                      label="* PM Name"
                      value={form.pmName}
                      onChange={setStr('pmName')}
                      placeholder="Packing material name"
                      required
                    />
                  </Grid.Col>

                  {/* ── Row 3: PM Size | UOM ── */}
                  <Grid.Col span={6}>
                    <FormTextInput
                      label="* PM Size"
                      value={form.pmSize}
                      onChange={setStr('pmSize')}
                      placeholder="e.g. 10"
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <FormSelect
                      label="* UOM"
                      value={form.uomId}
                      onChange={setSelect('uomId')}
                      data={uomOptions}
                      placeholder="----Select----"
                      required
                      searchable
                    />
                  </Grid.Col>

                  {/* ── Row 4: Tare Wgt | FG Lot Code ── */}
                  <Grid.Col span={6}>
                    <FormTextInput
                      label="Tare Wgt"
                      value={form.tareWgt}
                      onChange={setStr('tareWgt')}
                      placeholder="0.00"
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <FormTextInput
                      label="* FG Lot Code"
                      value={form.fgLotCode}
                      onChange={setStr('fgLotCode')}
                      placeholder="e.g. 0"
                      required
                    />
                  </Grid.Col>

                  {/* ── Row 5: PM Group Name | H/NH ── */}
                  <Grid.Col span={6}>
                    <FormSelect
                      label="PM Group Name"
                      value={form.pmGroupId}
                      onChange={setSelect('pmGroupId')}
                      data={groupOptions}
                      placeholder="--SELECT--"
                      searchable
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <FormSelect
                      label="H/NH"
                      value={form.hNhId}
                      onChange={setSelect('hNhId')}
                      data={hNhOptions}
                      placeholder="-----Select------"
                      searchable
                    />
                  </Grid.Col>

                  {/* ── Row 6: Avg Rate | GST % | spacer ── */}
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="* Avg Rate"
                      value={form.avgRate}
                      onChange={setStr('avgRate')}
                      placeholder="0.00"
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="GST %"
                      value={form.gstRate}
                      onChange={setStr('gstRate')}
                      placeholder="0.00"
                    />
                  </Grid.Col>
                  <Grid.Col span={4} />

                  {/* ── Row 7: Pack Size | Capacity | spacer ── */}
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Pack Size"
                      value={form.packSize}
                      onChange={setStr('packSize')}
                      placeholder="0"
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Capacity"
                      value={form.capacity}
                      onChange={setStr('capacity')}
                      placeholder="0"
                    />
                  </Grid.Col>
                  <Grid.Col span={4} />

                </Grid>
              </Paper>

            </Box>
          )}

          {/* ── Footer ── */}
          <Box px="lg" py="sm"
            style={{
              borderTop: '1px solid var(--mantine-color-gray-3)',
              backgroundColor: 'var(--mantine-color-body)',
              flexShrink: 0,
            }}>
            <Group justify="flex-end" gap="sm">
              <Button variant="default" size="sm" onClick={onClose}>Cancel</Button>
              <Button size="sm" color="blue" onClick={handleSubmitClick}>
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
        message={`Are you sure you want to ${confirmLabel.toLowerCase()} this Packing Material?`}
        confirmLabel={confirmLabel}
        errors={validationErrors}
        zIndex={250}
      />
    </>
  );
};

export default PackingMaterialForm;