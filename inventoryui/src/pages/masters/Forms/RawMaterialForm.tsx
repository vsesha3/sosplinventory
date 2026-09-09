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

export interface RawMaterialFormData {
  id?:        number | null;
  rmCode:     string;
  sapCode:    string;
  rmName:     string;
  uomId:      string | null;
  rmGroupId:  string | null;
  hNhId:      string | null;
  avgRate:    string;
  gstRate:    string;
  packUomId:  string | null;
  packSize:   string;
  capacity:   string;
  testId:     string | null;
  testCode:   string;
}

export interface RawMaterialFormProps {
  opened:  boolean;
  onClose: () => void;
  onSave?: (data: RawMaterialFormData) => void;
  rmId?:   number | null;
  mode?:   'create' | 'update';
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const defaultForm: RawMaterialFormData = {
  id:         null,
  rmCode:     '',
  sapCode:    '',
  rmName:     '',
  uomId:      null,
  rmGroupId:  null,
  hNhId:      null,
  avgRate:    '',
  gstRate:    '',
  packUomId:  null,
  packSize:   '',
  capacity:   '',
  testId:     null,
  testCode:   '',
};

// ── Validation ────────────────────────────────────────────────────────────────

const toNum = (val: string): number => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

const validateForm = (form: RawMaterialFormData): string[] => {
  const errors: string[] = [];

  if (!form.rmName.trim())
    errors.push('RM Name is required');

  if (!form.uomId)
    errors.push('UOM is required');

  if (!form.avgRate || toNum(form.avgRate) <= 0)
    errors.push('Avg Rate is required and must be greater than 0');

  if (!form.testId)
    errors.push('Test Name is required');

  if (form.gstRate && isNaN(parseFloat(form.gstRate)))
    errors.push('GST % must be a valid number');

  if (form.packSize && isNaN(parseFloat(form.packSize)))
    errors.push('Pack Size must be a valid number');

  if (form.capacity && isNaN(parseFloat(form.capacity)))
    errors.push('Capacity must be a valid number');

  if (form.packSize && parseFloat(form.packSize) > 0 && !form.packUomId)
    errors.push('Pack UOM is required when Pack Size is entered');

  return errors;
};

// ── Component ─────────────────────────────────────────────────────────────────

const RawMaterialForm: React.FC<RawMaterialFormProps> = ({
  opened,
  onClose,
  onSave,
  rmId = null,
  mode = 'create',
}) => {

  const [form, setForm]             = useState<RawMaterialFormData>({ ...defaultForm });
  const [loading, setLoading]       = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen]           = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [uomOptions, setUomOptions]         = useState<DropDownOption[]>([]);
  const [groupOptions, setGroupOptions]     = useState<DropDownOption[]>([]);
  const [hNhOptions, setHNhOptions]         = useState<DropDownOption[]>([]);
  const [packUomOptions, setPackUomOptions] = useState<DropDownOption[]>([]);
  const [testOptions, setTestOptions]       = useState<DropDownOption[]>([]);
  const [testCodeOptions, setTestCodeOptions] = useState<DropDownOption[]>([]);

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
        const [uomRes, groupRes, testRes] = await Promise.all([
          api.get('/api/uom/dropdown').catch(() => ({ data: { data: [] } })),
          api.get('/api/rm/dropdownRmGroup').catch(() => ({ data: { data: [] } })),
          api.get('/api/inventory/test-master/dropdown').catch(() => ({ data: { data: [] } })),
        ]);

        setUomOptions(clean(uomRes.data.data));
        setGroupOptions(clean(groupRes.data.data));
        setTestOptions(clean(testRes.data.data));
        setPackUomOptions(clean(uomRes.data.data));  // reuse UOM list

        if (mode === 'update' && rmId) {
          const res = await api.get(`/api/rm/${rmId}`);
          const d   = res.data.data ?? res.data;
          setForm({
            id:        d.id        ?? null,
            rmCode:    d.rmCode    != null ? String(d.rmCode)    : '',
            sapCode:   d.sapCode   ?? '',
            rmName:    d.rmName    ?? '',
            uomId:     d.uomId     != null ? String(d.uomId)     : null,
            rmGroupId: d.rmGroupId != null ? String(d.rmGroupId) : null,
            hNhId:     d.hNhId     != null ? String(d.hNhId)     : null,
            avgRate:   d.avgRate   != null ? String(d.avgRate)   : '',
            gstRate:   d.gstRate   != null ? String(d.gstRate)   : '',
            packUomId: d.packUomId != null ? String(d.packUomId) : null,
            packSize:  d.packSize  != null ? String(d.packSize)  : '',
            capacity:  d.capacity  != null ? String(d.capacity)  : '',
            testId:    d.testId    != null ? String(d.testId)    : null,
            testCode:  d.testCode  != null ? String(d.testCode)  : '',
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

  const setStr = (field: keyof RawMaterialFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      if (validationErrors.length > 0) setValidationErrors([]);
    };

  const setSelect = (field: keyof RawMaterialFormData) =>
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
    ? `Edit Raw Material — ${form.rmName || `#${rmId}`}`
    : 'New Raw Material';

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

  {/* ── Row 1: Code | SAP Code ── */}
  <Grid.Col span={6}>
    <FormTextInput
      label="Code"
      value={form.rmCode}
      onChange={setStr('rmCode')}
      placeholder="Auto-generated"
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

  {/* ── Row 2: Name ── */}
  <Grid.Col span={12}>
    <FormTextInput
      label="* Name"
      value={form.rmName}
      onChange={setStr('rmName')}
      placeholder="Raw material name"
      required
    />
  </Grid.Col>
   <Grid.Col span={6}>
    <FormSelect
      label="RM Group Name"
      value={form.rmGroupId}
      onChange={setSelect('rmGroupId')}
      data={groupOptions}
      placeholder="--SELECT--"
      searchable
    />
  </Grid.Col>

  {/* ── Row 3: UOM | RM Group ── */}
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
 

  {/* ── Row 4: H/NH | Avg Rate | GST % ── */}
  <Grid.Col span={4}>
    <FormSelect
      label="H/NH"
      value={form.hNhId}
      onChange={setSelect('hNhId')}
      data={hNhOptions}
      placeholder="-----Select------"
      searchable
    />
  </Grid.Col>
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

  {/* ── Row 5: Pack UOM | Pack Size | Capacity ── */}
  <Grid.Col span={4}>
    <FormSelect
      label="Pack UOM"
      value={form.packUomId}
      onChange={setSelect('packUomId')}
      data={packUomOptions}
      placeholder="-----Select------"
      searchable
    />
  </Grid.Col>
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

  {/* ── Row 6: Test Name | Test Code ── */}
  <Grid.Col span={6}>
    <FormSelect
      label="* Test Name"
      value={form.testId}
      onChange={setSelect('testId')}
      data={testOptions}
      placeholder="--SELECT--"
      required
      searchable
    />
  </Grid.Col>
  <Grid.Col span={6}>
    <FormSelect
      label="Test Code"
      value={form.testCode || null}
      onChange={setSelect('testCode')}
      data={testCodeOptions}
      placeholder=""
      searchable
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
        message={`Are you sure you want to ${confirmLabel.toLowerCase()} this Raw Material?`}
        confirmLabel={confirmLabel}
        errors={validationErrors}
        zIndex={250}
      />
    </>
  );
};

export default RawMaterialForm;