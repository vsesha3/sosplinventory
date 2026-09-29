/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button,
  Grid, Stack, Loader, Center, Table, ActionIcon,
  Badge, Tooltip
} from '@mantine/core';
import { IconPackage, IconPlus, IconTrash } from '@tabler/icons-react';
import { FormTextInput } from '../../../components/common/FormTextInput';
import { FormSelect } from '../../../components/common/FormSelect';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import FormHeader from '../../common/Formheader';
import api from '../../../services/api';
import QuickAddModal from '../../../components/common/QuickAddModal';
// ── Types ─────────────────────────────────────────────────────────────────────

interface DropDownOption {
  value: string;
  label: string;
}

export interface RmMappingRow {
  pmRmDetslId: number | null;
  rowId: string;        // local key for React
  rmId: string | null;
  rmCode: string;
  mixPercentage: string;
}

export interface PmMappingRow {
  pmPackingDetslId: number | null;
  rowId: string;        // local key for React
  pmId: string | null;
}

export interface ProductMasterFormData {
  id?: number | null;
  productCode: string;
  sapCode: string;
  productCodePrefix: string;
  productName: string;
  brandName: string;
  uomId: string | null;
  fgLotCode: string;
  productGroupId: string | null;
  capacity: string;
  packingType: string;
  rate: string;
  gstRate: string;
  testId: string | null;
  testCode: string | null;
  conversionCost: string;
  rmMappings: RmMappingRow[];   // RM section
  pmMappings: PmMappingRow[];   // PM section
}

export interface ProductMasterFormProps {
  opened: boolean;
  onClose: () => void;
  onSave?: (data: ProductMasterFormData) => void;
  productId?: number | null;
  mode?: 'create' | 'update';
}

// ── Default form ──────────────────────────────────────────────────────────────

const defaultForm: ProductMasterFormData = {
  id: null,
  productCode: '',
  sapCode: '',
  productCodePrefix: '',
  productName: '',
  brandName: '',
  uomId: null,
  fgLotCode: '',
  productGroupId: null,
  capacity: '',
  packingType: '',
  rate: '',
  gstRate: '',
  testId: null,
  testCode: null,
  conversionCost: '',
  rmMappings: [],
  pmMappings: [],
};

const newRow = (): RmMappingRow => ({
  rowId: crypto.randomUUID(),
  rmId: null,
  rmCode: '',
  mixPercentage: '',
  pmRmDetslId: null
});

const newPmRow = (): PmMappingRow => ({
  rowId: crypto.randomUUID(),
  pmId: null,
  pmPackingDetslId: null,
});

// ── Validation ────────────────────────────────────────────────────────────────

const validateForm = (form: ProductMasterFormData): string[] => {
  const errors: string[] = [];

  if (!form.productName.trim())
    errors.push('Product Name is required');

  if (!form.uomId)
    errors.push('UOM is required');

  if (!form.fgLotCode.trim())
    errors.push('FG Lot Code is required');

  if (!form.rate || parseFloat(form.rate) <= 0)
    errors.push('Rate is required and must be greater than 0');

  if (!form.testId)
    errors.push('Test Name is required');

  if (form.gstRate && isNaN(parseFloat(form.gstRate)))
    errors.push('GST % must be a valid number');

  if (form.capacity && isNaN(parseFloat(form.capacity)))
    errors.push('Capacity must be a valid number');

  if (form.conversionCost && isNaN(parseFloat(form.conversionCost)))
    errors.push('Conversion Cost must be a valid number');

  // RM mapping validation
  for (const row of form.rmMappings) {
    if (!row.rmId)
      errors.push('All RM mapping rows must have a Raw Material selected');
    if (!row.mixPercentage || isNaN(parseFloat(row.mixPercentage)))
      errors.push('All RM mapping rows must have a valid Percentage');
    if (row.mixPercentage && parseFloat(row.mixPercentage) <= 0)
      errors.push('RM Percentage must be greater than 0');
  }

  // PM mapping validation
  if (form.pmMappings.some(row => !row.pmId))
    errors.push('All Packing Material rows must have a Packing Material selected');

  return errors;
};

// ── Component ─────────────────────────────────────────────────────────────────

const ProductMasterForm: React.FC<ProductMasterFormProps> = ({
  opened,
  onClose,
  onSave,
  productId = null,
  mode = 'create',
}) => {

  const [form, setForm] = useState<ProductMasterFormData>({ ...defaultForm });
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Dropdowns
  const [uomOptions, setUomOptions] = useState<DropDownOption[]>([]);
  const [groupOptions, setGroupOptions] = useState<DropDownOption[]>([]);
  const [testOptions, setTestOptions] = useState<DropDownOption[]>([]);
  const [testCodeOpts, setTestCodeOpts] = useState<DropDownOption[]>([]);
  const [rmOptions, setRmOptions] = useState<DropDownOption[]>([]);
  const [pmOptions,setPmOptions] = useState<DropDownOption[]>([]);
  const [brandOptions, setBrandOptions] = useState<DropDownOption[]>([]);
  const [quickSaving, setQuickSaving] = useState(false);

  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newTestName, setNewTestName] = useState('');
  const [addTestNameOpen, setAddTestNameOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [addBrandOpen, setAddBrandOpen] = useState(false);
  const [newUomName, setNewUomName] = useState('');
  const [addUomOpen, setAddUomOpen] = useState(false);
  // ── Filter helper ─────────────────────────────────────────────────────────

  // Same clean function used across all master forms
  // API standard response: { value, label, quantity, productName, ... }
  const clean = (data: any[]): DropDownOption[] => {
    if (!data || !Array.isArray(data)) return [];
    return data
      .filter(item => item != null && item.value != null)
      .map(item => ({
        value: String(item.value),
        label: item.label ?? '-',
      }));
  };

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
        const [uomRes, groupRes, testRes, rmRes, pmRes, brandRes] = await Promise.all([
          api.get('/api/dropdown/uom')
            .catch(() => ({ data: { data: [] } })),
          api.get('/api/dropdown/product-group')
            .catch(() => ({ data: { data: [] } })),
          api.get('/api/dropdown/test-master')
            .catch(() => ({ data: { data: [] } })),
          api.get('/api/dropdown/rm')
            .catch(() => ({ data: { data: [] } })),
          api.get('/api/dropdown/packing-master')
            .catch(() => ({ data: { data: [] } })),
          api.get('/api/dropdown/brand-name')
            .catch(() => ({ data: { data: [] } })),
        ]);

        setUomOptions(clean(uomRes.data.data));
        setGroupOptions(clean(groupRes.data.data));
        setTestOptions(clean(testRes.data.data));
        setTestCodeOpts([]);
        setRmOptions(clean(rmRes.data.data));
        setPmOptions(clean(pmRes.data.data));
        setBrandOptions(clean(brandRes.data.data));

        if (mode === 'update' && productId) {

          // ── Fetch product, RM and PM mappings in parallel ─────────
          const [productRes, rmMappingRes, pmMappingRes] = await Promise.all([
            api.get(`/api/product/${productId}`),
            api.get(`/api/product/rm-details/${productId}`)
              .catch(() => ({ data: { data: [] } })),
            api.get(`/api/inventory/work-order/pm-details/product/${productId}`)
              .catch(() => ({ data: { data: [] } })),
          ]);

          const d = productRes.data.data ?? productRes.data;

          // ── Map RM mappings from new endpoint ─────────────────────
          const extractPct = (v: any): string => {
            if (v == null) return '';
            if (typeof v === 'object') return String(v.parsedValue ?? v.source ?? '');
            return String(v);
          };

          const rmMappings: RmMappingRow[] = (
            rmMappingRes.data.data ?? []
          ).map((m: any) => {
            const rmIdStr = m.rmId != null ? String(m.rmId) : null;
            return {
              pmRmDetslId: m.pmRmDetslId ?? null,
              rowId: crypto.randomUUID(),
              rmId: rmIdStr,     // matches rmOptions value — enables auto-select
              rmCode: rmIdStr ?? '',
              mixPercentage: extractPct(m.mixPercentage),
            };
          });

          const pmMappings: PmMappingRow[] = (
            pmMappingRes.data.data ?? []
          ).map((m: any) => ({
            pmPackingDetslId: m.pmPackingDetslId ?? null,
            rowId: crypto.randomUUID(),
            pmId: m.pmId != null ? String(m.pmId) : null,   // matches pmOptions value
          }));
          setForm({
            id: d.productId ?? null,
            // Product Code = productId from API
            productCode: d.productId != null
              ? String(d.productId) : '',
            sapCode: d.sapCode ?? '',
            productCodePrefix: d.productCodePrefix ?? '',
            productName: d.productName ?? '',
            brandName: d.brandName ?? '',
            uomId: d.uomId != null
              ? String(d.uomId) : null,
            fgLotCode: d.fgLotCode != null
              ? String(d.fgLotCode) : '',
            productGroupId: d.productGroupId != null
              ? String(d.productGroupId) : null,
            capacity: d.capacity != null
              ? String(d.capacity) : '',
            packingType: d.packingType ?? '',
            rate: d.rate != null
              ? String(typeof d.rate === 'object'
                ? (d.rate.parsedValue
                  ?? d.rate.source ?? '')
                : d.rate)
              : '',
            gstRate: d.gstRate != null
              ? String(d.gstRate) : '',
            testId: d.testId != null
              ? String(d.testId) : null,
            testCode: d.testCode != null
              ? String(d.testCode) : null,
            conversionCost: d.conversionCost != null
              ? String(d.conversionCost) : '',
            rmMappings,
            pmMappings,
          });
        }
      } catch {
        setFetchError(
          'Failed to load form data. Please close and try again.');
      } finally {
        setLoading(false);
      }
    };

    load();


  }, [opened]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Form helpers ──────────────────────────────────────────────────────────

  const setStr = (field: keyof ProductMasterFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      if (validationErrors.length > 0) setValidationErrors([]);
    };

  const setSelect = (field: keyof ProductMasterFormData) =>
    (value: string | null) => {
      setForm(prev => ({ ...prev, [field]: value }));
      if (validationErrors.length > 0) setValidationErrors([]);
    };

  // ── RM mapping helpers ────────────────────────────────────────────────────

  const addRmRow = () => {
    setForm(prev => ({ ...prev, rmMappings: [...prev.rmMappings, newRow()] }));
  };

  const removeRmRow = (rowId: string) => {
    setForm(prev => ({
      ...prev,
      rmMappings: prev.rmMappings.filter(r => r.rowId !== rowId),
    }));
  };

  const updateRmRow = (rowId: string, field: keyof RmMappingRow, value: string | null) => {
    setForm(prev => ({
      ...prev,
      rmMappings: prev.rmMappings.map(r => {
        if (r.rowId !== rowId) return r;
        if (field === 'rmId') {
          // value = rm_id (e.g. "54"), label = rm_name (e.g. "Acrylic Acid")
          //const opt = rmOptions.find(o => o.value === value);
          return { ...r, rmId: value, rmCode: value ?? '' };
        }
        return { ...r, [field]: value ?? '' };
      }),
    }));
  };

  // ── PM mapping helpers ────────────────────────────────────────────────────

  const addPmRow = () => {
    setForm(prev => ({ ...prev, pmMappings: [...prev.pmMappings, newPmRow()] }));
  };

  const removePmRow = (rowId: string) => {
    setForm(prev => ({
      ...prev,
      pmMappings: prev.pmMappings.filter(r => r.rowId !== rowId),
    }));
  };

  const updatePmRow = (rowId: string, value: string | null) => {
    setForm(prev => ({
      ...prev,
      pmMappings: prev.pmMappings.map(r =>
        r.rowId === rowId ? { ...r, pmId: value } : r),
    }));
    if (validationErrors.length > 0) setValidationErrors([]);
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmitClick = () => {
    const errors = validateForm(form);
    setValidationErrors(errors);
    if (errors.length === 0) setConfirmOpen(true);
  };

  const confirmLabel = mode === 'update' ? 'Update' : 'Submit';
  const headerTitle = mode === 'update' && form.id
    ? `Edit Product — ${form.productName || `#${productId}`}`
    : 'New Product';

  // Total percentage
  const totalPct = form.rmMappings.reduce(
    (s, r) => s + (parseFloat(r.mixPercentage) || 0), 0
  );

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) return;
    setQuickSaving(true);
    try {
      const res = await api.post('/api/productgroup', { groupName: newGroupName.trim() });
      const created = res.data?.data ?? res.data;
      // Refresh group dropdown
      const groupRes = await api.get('/api/dropdown/product-group');
      
      const updated = clean(groupRes.data.data);
      setGroupOptions(updated);
      // Auto-select the new group
      if (created?.productGroupId != null) {
        setForm(prev => ({ ...prev, productGroupId: String(created.productGroupId) }));
      } else {
        // fallback: find by name
        const match = updated.find(o => o.label === newGroupName.trim());
        if (match) setForm(prev => ({ ...prev, productGroupId: match.value }));
      }
      setNewGroupName('');
      setAddGroupOpen(false);
    } catch (err: any) {

      setFetchError(
        err?.response?.data?.message || 'Failed to add RM Group. Please try again.'
      );

      // silently fail — user can still select manually
    } finally {
      setQuickSaving(false);
    }
  };

  const handleAddTestName = async () => {
    if (!newTestName.trim()) return;
    setQuickSaving(true);
    try {
      const res = await api.post('/api/inventory/test-master', { testName: newTestName.trim() });
      const created = res.data?.data ?? res.data;
      // Refresh UOM dropdown (used for both UOM and Pack UOM)
      const uomRes = await api.get('/api/dropdown/test-master');
      const updated = clean(uomRes.data.data);
      setTestOptions(updated);
      // Auto-select the new UOM
      if (created?.testId != null) {
        setForm(prev => ({ ...prev, testId: String(created.testId) }));
      } else {
        const match = updated.find(o => o.label === newTestName.trim());
        if (match) setForm(prev => ({ ...prev, testId: match.value }));
      }
      setNewTestName('');
      setAddTestNameOpen(false);
    } catch (err: any) {
      console.error('[handleAddUom] Failed:', err?.response?.data ?? err);
      setFetchError(
        err?.response?.data?.message || 'Failed to add UOM. Please try again.'
      );
    } finally {
      setQuickSaving(false);
    }
  };

  const handleAddUom = async () => {
    if (!newUomName.trim()) return;
    setQuickSaving(true);
    try {
      const res = await api.post('/api/uom', { uomName: newUomName.trim() });
      const created = res.data?.data ?? res.data;
      // Refresh UOM dropdown
      const uomRes = await api.get('/api/dropdown/uom');
      const updated = clean(uomRes.data.data);
      setUomOptions(updated);
      // Auto-select the new UOM
      if (created?.id != null) {
        setForm(prev => ({ ...prev, uomId: String(created.id) }));
      } else {
        const match = updated.find(o => o.label === newUomName.trim());
        if (match) setForm(prev => ({ ...prev, uomId: match.value }));
      }
      setNewUomName('');
      setAddUomOpen(false);
    } catch (err: any) {
      console.error('[handleAddUom] Failed:', err?.response?.data ?? err);
      setFetchError(
        err?.response?.data?.message || 'Failed to add UOM. Please try again.'
      );
    } finally {
      setQuickSaving(false);
    }
  };

  const handleAddBrand = async () => {
    const name = newBrandName.trim();
    if (!name) return;
    setQuickSaving(true);
    try {
      await api.post('/api/brand', { brandName: name, activeFlag: true });
      // Refresh brand dropdown
      const brandRes = await api.get('/api/dropdown/brand-name');
      setBrandOptions(clean(brandRes.data.data));
      // Product stores brand by name — auto-select the new brand
      setForm(prev => ({ ...prev, brandName: name }));
      setNewBrandName('');
      setAddBrandOpen(false);
    } catch (err: any) {
      console.error('[handleAddBrand] Failed:', err?.response?.data ?? err);
      setFetchError(
        err?.response?.data?.message || 'Failed to add Brand. Please try again.'
      );
    } finally {
      setQuickSaving(false);
    }
  };

  // Product stores brand_name (text), so map the name to/from the dropdown option
  const selectedBrandValue =
    brandOptions.find(o => o.label === form.brandName)?.value ?? null;

  const handleBrandChange = (value: string | null) => {
    const opt = brandOptions.find(o => o.value === value);
    setForm(prev => ({ ...prev, brandName: opt?.label ?? '' }));
    if (validationErrors.length > 0) setValidationErrors([]);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={null}
        size="75%"
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
            color="#3d6b4f"
            badge={mode === 'update' ? 'Edit Mode' : 'New'}
            badgeColor={mode === 'update' ? 'orange' : 'green'}
            onClose={onClose}
          />

          {/* ── Scrollable body ── */}
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

              {/* ── Section 1: Product Header ── */}
              <Paper withBorder p="md" radius="sm" mb="md"
                style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>

                <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb="sm">
                  Product Details
                </Text>

                <Grid columns={12} gutter="sm">

                  {/* Row 1: Product Code | SAP Code */}
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Product Code"
                      value={form.productCode}
                      onChange={() => { }}
                      placeholder="Auto-generated"
                      readOnly
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Product Code Prefix"
                      value={form.productCodePrefix}
                      onChange={setStr('productCodePrefix')}
                      placeholder="e.g. LC BINDER"
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="SAP Code"
                      value={form.sapCode}
                      onChange={setStr('sapCode')}
                      placeholder="SAP Code"
                    />
                  </Grid.Col>

                  {/* Row 2: Product Name | Brand Name */}
                  <Grid.Col span={8}>
                    <FormTextInput
                      label="* Product Name"
                      value={form.productName}
                      onChange={setStr('productName')}
                      placeholder="Product name"
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Group gap="xs" align="flex-end">
                      <Box style={{ flex: 1 }}>
                        <FormSelect
                          label="Brand Name"
                          value={selectedBrandValue}
                          onChange={handleBrandChange}
                          data={brandOptions}
                          placeholder="--SELECT--"
                          searchable
                        />
                      </Box>
                      <Tooltip label="Add new Brand" position="top">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          size="lg"
                          mb={1}
                          onClick={() => { setNewBrandName(''); setAddBrandOpen(true); }}
                        >
                          <IconPlus size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Grid.Col>

                  {/* Row 3: UOM | FG Lot Code | Product Group */}
                  <Grid.Col span={4}>
                    <Group gap="xs" align="flex-end">
                      <Box style={{ flex: 1 }}>
                        <FormSelect
                          label="* UOM"
                          value={form.uomId}
                          onChange={setSelect('uomId')}
                          data={uomOptions}
                          placeholder="----Select----"
                          required
                          searchable
                        />
                      </Box>
                      <Tooltip label="Add new UOM" position="top">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          size="lg"
                          mb={1}
                          onClick={() => { setNewUomName(''); setAddUomOpen(true); }}
                        >
                          <IconPlus size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="* FG Lot Code"
                      value={form.fgLotCode}
                      onChange={setStr('fgLotCode')}
                      placeholder="e.g. PI"
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Group gap="xs" align="flex-end">
                      <Box style={{ flex: 1 }}>
                        <FormSelect
                          label="Product Group Name"
                          value={form.productGroupId}
                          onChange={setSelect('productGroupId')}
                          data={groupOptions}
                          placeholder="--SELECT--"
                          searchable
                        />
                      </Box>
                      <Tooltip label="Add new RM Group" position="top">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          size="lg"
                          mb={1}
                          onClick={() => { setNewGroupName(''); setAddGroupOpen(true); }}
                        >
                          <IconPlus size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Grid.Col>

                  {/* Row 4: Capacity | Packing Type */}
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Capacity"
                      value={form.capacity}
                      onChange={setStr('capacity')}
                      placeholder="e.g. 30"
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Packing Type"
                      value={form.packingType}
                      onChange={setStr('packingType')}
                      placeholder="e.g. Carboy"
                    />
                  </Grid.Col>
                  <Grid.Col span={4} />

                  {/* Row 5: Rate | GST % | Conversion Cost */}
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="* Rate"
                      value={form.rate}
                      onChange={setStr('rate')}
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
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Conversion Cost"
                      value={form.conversionCost}
                      onChange={setStr('conversionCost')}
                      placeholder="0.00"
                    />
                  </Grid.Col>

                  {/* Row 6: Test Name | Test Code */}
                  <Grid.Col span={6}>
                    <Group gap="xs" align="flex-end">
                      <Box style={{ flex: 1 }}>
                        <FormSelect
                          label="* Test Name"
                          value={form.testId}
                          onChange={setSelect('testId')}
                          data={testOptions}
                          placeholder="--SELECT--"
                          required
                          searchable
                        />
                      </Box>

                      <Tooltip label="Add new Lab Test" position="top">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          size="lg"
                          mb={1}
                          onClick={() => { setNewTestName(''); setAddTestNameOpen(true); }}
                        >
                          <IconPlus size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={6}>

                    <FormSelect
                      label="Test Code"
                      value={form.testCode}
                      onChange={setSelect('testCode')}
                      data={testCodeOpts}
                      placeholder=""
                      searchable
                    />

                  </Grid.Col>

                </Grid>
              </Paper>

              {/* ── Sections 2 & 3: RM + PM side by side ── */}
              <Grid columns={12} gutter="md">

                {/* ── Left: RM Mapping ── */}
                <Grid.Col span={6}>
                  <Paper withBorder p="md" radius="sm" h="100%"
                    style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>

                    <Group justify="space-between" mb="sm">
                      <Group gap="sm">
                        <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                          Product RM Details
                        </Text>
                        {form.rmMappings.length > 0 && (
                          <Badge size="xs" variant="light" color="blue">
                            {form.rmMappings.length} row{form.rmMappings.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                        {totalPct > 0 && (
                          <Badge
                            size="xs"
                            variant="light"
                            color={Math.abs(totalPct - 100) < 0.01 ? 'green' : 'orange'}
                          >
                            Total: {totalPct.toFixed(2)}%
                          </Badge>
                        )}
                      </Group>
                      <Button
                        size="xs"
                        variant="light"
                        leftSection={<IconPlus size={12} />}
                        onClick={addRmRow}
                      >
                        Add Row
                      </Button>
                    </Group>

                    {form.rmMappings.length === 0 ? (
                      <Box py="xl"
                        style={{
                          textAlign: 'center',
                          border: '1.5px dashed var(--mantine-color-gray-3)',
                          borderRadius: 8,
                        }}
                      >
                        <Text size="sm" c="dimmed">No RM mappings added yet</Text>
                        <Button
                          size="xs" variant="subtle"
                          leftSection={<IconPlus size={12} />}
                          mt="xs" onClick={addRmRow}
                        >
                          Add first row
                        </Button>
                      </Box>
                    ) : (
                      <Table highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th style={{ width: '60%' }}>Raw Material</Table.Th>
                            <Table.Th style={{ width: '30%' }}>Percentage (%)</Table.Th>
                            <Table.Th style={{ width: '10%' }}></Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {form.rmMappings.map(row => (
                            <Table.Tr key={row.rowId}>
                              <Table.Td>
                                <FormSelect
                                  label=""
                                  value={row.rmId}
                                  onChange={val => updateRmRow(row.rowId, 'rmId', val)}
                                  data={rmOptions}
                                  placeholder="Select raw material"
                                  searchable
                                />
                              </Table.Td>
                              <Table.Td>
                                <FormTextInput
                                  label=""
                                  value={row.mixPercentage}
                                  onChange={e => updateRmRow(row.rowId, 'mixPercentage', e.target.value)}
                                  placeholder="0.00"
                                />
                              </Table.Td>
                              <Table.Td>
                                <ActionIcon size="sm" color="red" variant="subtle"
                                  onClick={() => removeRmRow(row.rowId)}>
                                  <IconTrash size={14} />
                                </ActionIcon>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    )}

                    {form.rmMappings.length > 0 && (
                      <Text size="xs" c="dimmed" mt="xs">
                        Percentages represent the mix ratio for this product.
                        {Math.abs(totalPct - 100) < 0.01
                          ? ' ✓ Total is 100%'
                          : ` Total is ${totalPct.toFixed(2)}% — does not need to equal 100%.`}
                      </Text>
                    )}

                  </Paper>
                </Grid.Col>

                {/* ── Right: PM Mapping ── */}
                <Grid.Col span={6}>
                  <Paper withBorder p="md" radius="sm" h="100%"
                    style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>

                    <Group justify="space-between" mb="sm">
                      <Group gap="sm">
                        <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                          Packing Material Details
                        </Text>
                        {form.pmMappings.length > 0 && (
                          <Badge size="xs" variant="light" color="blue">
                            {form.pmMappings.length} row{form.pmMappings.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </Group>
                      <Button
                        size="xs"
                        variant="light"
                        leftSection={<IconPlus size={12} />}
                        onClick={addPmRow}
                      >
                        Add Row
                      </Button>
                    </Group>

                    {form.pmMappings.length === 0 ? (
                      <Box py="xl"
                        style={{
                          textAlign: 'center',
                          border: '1.5px dashed var(--mantine-color-gray-3)',
                          borderRadius: 8,
                        }}
                      >
                        <Text size="sm" c="dimmed">No packing materials added yet</Text>
                        <Button
                          size="xs" variant="subtle"
                          leftSection={<IconPlus size={12} />}
                          mt="xs" onClick={addPmRow}
                        >
                          Add first row
                        </Button>
                      </Box>
                    ) : (
                      <Table highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th style={{ width: '90%' }}>Packing Material Name</Table.Th>
                            <Table.Th style={{ width: '10%' }}></Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {form.pmMappings.map(row => (
                            <Table.Tr key={row.rowId}>
                              <Table.Td>
                                <FormSelect
                                  label=""
                                  value={row.pmId}
                                  onChange={val => updatePmRow(row.rowId, val)}
                                  data={pmOptions}
                                  placeholder="Select packing material"
                                  searchable
                                />
                              </Table.Td>
                              <Table.Td>
                                <ActionIcon size="sm" color="red" variant="subtle"
                                  onClick={() => removePmRow(row.rowId)}>
                                  <IconTrash size={14} />
                                </ActionIcon>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    )}

                  </Paper>
                </Grid.Col>

              </Grid>

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
        message={`Are you sure you want to ${confirmLabel.toLowerCase()} this Product?`}
        confirmLabel={confirmLabel}
        errors={validationErrors}
        zIndex={250}
      />
      <QuickAddModal
        opened={addGroupOpen}
        onClose={() => setAddGroupOpen(false)}
        title="Add RM Group"
        label="Group Name"
        value={newGroupName}
        onChange={setNewGroupName}
        onSave={handleAddGroup}
        saving={quickSaving}
      />

      <QuickAddModal
        opened={addTestNameOpen}
        onClose={() => setAddTestNameOpen(false)}
        title="Add Lab Test Name"
        label="Lab Test Name"
        value={newTestName}
        onChange={setNewTestName}
        onSave={handleAddTestName}
        saving={quickSaving}
      />

      <QuickAddModal
        opened={addUomOpen}
        onClose={() => setAddUomOpen(false)}
        title="Add UOM"
        label="UOM Name"
        value={newUomName}
        onChange={setNewUomName}
        onSave={handleAddUom}
        saving={quickSaving}
      />

      <QuickAddModal
        opened={addBrandOpen}
        onClose={() => setAddBrandOpen(false)}
        title="Add Brand"
        label="Brand Name"
        value={newBrandName}
        onChange={setNewBrandName}
        onSave={handleAddBrand}
        saving={quickSaving}
      />

    </>
  );
};

export default ProductMasterForm;