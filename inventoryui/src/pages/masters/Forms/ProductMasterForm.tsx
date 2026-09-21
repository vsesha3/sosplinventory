/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button,
  Grid, Stack, Loader, Center, Table, ActionIcon,
  Badge,
} from '@mantine/core';
import { IconPackage, IconPlus, IconTrash } from '@tabler/icons-react';
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

export interface RmMappingRow {
  rowId:       string;        // local key for React
  rmId:        string | null;
  rmCode:      string;
  percentage:  string;
}

export interface ProductMasterFormData {
  id?:              number | null;
  productCode:      string;
  sapCode:          string;
  productCodePrefix:string;
  productName:      string;
  brandName:        string;
  uomId:            string | null;
  fgLotCode:        string;
  productGroupId:   string | null;
  capacity:         string;
  packingType:      string;
  rate:             string;
  gstRate:          string;
  testId:           string | null;
  testCode:         string | null;
  conversionCost:   string;
  rmMappings:       RmMappingRow[];   // RM section
  pmMappings:       RmMappingRow[];   // PM section (future)
}

export interface ProductMasterFormProps {
  opened:   boolean;
  onClose:  () => void;
  onSave?:  (data: ProductMasterFormData) => void;
  productId?: number | null;
  mode?:    'create' | 'update';
}

// ── Default form ──────────────────────────────────────────────────────────────

const defaultForm: ProductMasterFormData = {
  id:               null,
  productCode:      '',
  sapCode:          '',
  productCodePrefix:'',
  productName:      '',
  brandName:        '',
  uomId:            null,
  fgLotCode:        '',
  productGroupId:   null,
  capacity:         '',
  packingType:      '',
  rate:             '',
  gstRate:          '',
  testId:           null,
  testCode:         null,
  conversionCost:   '',
  rmMappings:       [],
  pmMappings:       [],
};

const newRow = (): RmMappingRow => ({
  rowId:      crypto.randomUUID(),
  rmId:       null,
  rmCode:     '',
  percentage: '',
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
    if (!row.percentage || isNaN(parseFloat(row.percentage)))
      errors.push('All RM mapping rows must have a valid Percentage');
    if (row.percentage && parseFloat(row.percentage) <= 0)
      errors.push('RM Percentage must be greater than 0');
  }

  return errors;
};

// ── Component ─────────────────────────────────────────────────────────────────

const ProductMasterForm: React.FC<ProductMasterFormProps> = ({
  opened,
  onClose,
  onSave,
  productId = null,
  mode      = 'create',
}) => {

  const [form,        setForm]        = useState<ProductMasterFormData>({ ...defaultForm });
  const [loading,     setLoading]     = useState(false);
  const [fetchError,  setFetchError]  = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Dropdowns
  const [uomOptions,     setUomOptions]     = useState<DropDownOption[]>([]);
  const [groupOptions,   setGroupOptions]   = useState<DropDownOption[]>([]);
  const [testOptions,    setTestOptions]    = useState<DropDownOption[]>([]);
  const [testCodeOpts,   setTestCodeOpts]   = useState<DropDownOption[]>([]);
  const [rmOptions,      setRmOptions]      = useState<DropDownOption[]>([]);

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
        const [uomRes, groupRes, testRes, rmRes] = await Promise.all([
            api.get('/api/dropdown/uom')
                .catch(() => ({ data: { data: [] } })),
            api.get('/api/dropdown/product-group')
                .catch(() => ({ data: { data: [] } })),
            api.get('/api/dropdown/test-master')
                .catch(() => ({ data: { data: [] } })),
            api.get('/api/dropdown/rm')
                .catch(() => ({ data: { data: [] } })),
        ]);

        setUomOptions(clean(uomRes.data.data));
        setGroupOptions(clean(groupRes.data.data));
        setTestOptions(clean(testRes.data.data));
        setRmOptions(clean(rmRes.data.data));

        if (mode === 'update' && productId) {

            // ── Fetch product and RM mappings in parallel ─────────────
            const [productRes, rmMappingRes] = await Promise.all([
                api.get(`/api/product/${productId}`),
                api.get(`/api/product/rm-details/${productId}`)
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
                rowId:      crypto.randomUUID(),
                rmId:       rmIdStr,     // matches rmOptions value — enables auto-select
                rmCode:     rmIdStr ?? '',
                percentage: extractPct(m.mixPercentage),
              };
            });
            setForm({
                id:                d.productId         ?? null,
                productCode:       d.productCode       != null
                                        ? String(d.productCode)       : '',
                sapCode:           d.sapCode           ?? '',
                productCodePrefix: d.productCodePrefix ?? '',
                productName:       d.productName       ?? '',
                brandName:         d.brandName         ?? '',
                uomId:             d.uomId             != null
                                        ? String(d.uomId)             : null,
                fgLotCode:         d.fgLotCode         != null
                                        ? String(d.fgLotCode)         : '',
                productGroupId:    d.productGroupId    != null
                                        ? String(d.productGroupId)    : null,
                capacity:          d.capacity          != null
                                        ? String(d.capacity)          : '',
                packingType:       d.packingType       ?? '',
                rate:              d.rate              != null
                                        ? String(typeof d.rate === 'object'
                                            ? (d.rate.parsedValue
                                                ?? d.rate.source ?? '')
                                            : d.rate)
                                        : '',
                gstRate:           d.gstRate           != null
                                        ? String(d.gstRate)           : '',
                testId:            d.testId            != null
                                        ? String(d.testId)            : null,
                testCode:          d.testCode          != null
                                        ? String(d.testCode)          : null,
                conversionCost:    d.conversionCost    != null
                                        ? String(d.conversionCost)    : '',
                rmMappings,
                pmMappings: [],         // ← PM section future
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
          const opt = rmOptions.find(o => o.value === value);
          return { ...r, rmId: value, rmCode: value ?? '' };
        }
        return { ...r, [field]: value ?? '' };
      }),
    }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmitClick = () => {
    const errors = validateForm(form);
    setValidationErrors(errors);
    if (errors.length === 0) setConfirmOpen(true);
  };

  const confirmLabel = mode === 'update' ? 'Update' : 'Submit';
  const headerTitle  = mode === 'update' && form.id
    ? `Edit Product — ${form.productName || `#${productId}`}`
    : 'New Product';

  // Total percentage
  const totalPct = form.rmMappings.reduce(
    (s, r) => s + (parseFloat(r.percentage) || 0), 0
  );

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
                      onChange={setStr('productCode')}
                      placeholder="Auto-generated"
                      readOnly={mode === 'update'}
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
                    <FormTextInput
                      label="Brand Name"
                      value={form.brandName}
                      onChange={setStr('brandName')}
                      placeholder="Brand name"
                    />
                  </Grid.Col>

                  {/* Row 3: UOM | FG Lot Code | Product Group */}
                  <Grid.Col span={4}>
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
                    <FormSelect
                      label="Product Group Name"
                      value={form.productGroupId}
                      onChange={setSelect('productGroupId')}
                      data={groupOptions}
                      placeholder="--SELECT--"
                      searchable
                    />
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
                      value={form.testCode}
                      onChange={setSelect('testCode')}
                      data={testCodeOpts}
                      placeholder=""
                      searchable
                    />
                  </Grid.Col>

                </Grid>
              </Paper>

              {/* ── Section 2: RM Mapping Sub-table ── */}
              <Paper withBorder p="md" radius="sm" mb="md"
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
                  <Box
                    py="xl"
                    style={{
                      textAlign: 'center',
                      border: '1.5px dashed var(--mantine-color-gray-3)',
                      borderRadius: 8,
                    }}
                  >
                    <Text size="sm" c="dimmed">No RM mappings added yet</Text>
                    <Button
                      size="xs"
                      variant="subtle"
                      leftSection={<IconPlus size={12} />}
                      mt="xs"
                      onClick={addRmRow}
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

                          {/* Raw Material dropdown — value=rmId, label=rmName from options */}
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

                          {/* Percentage */}
                          <Table.Td>
                            <FormTextInput
                              label=""
                              value={row.percentage}
                              onChange={e =>
                                updateRmRow(row.rowId, 'percentage', e.target.value)
                              }
                              placeholder="0.00"
                            />
                          </Table.Td>

                          {/* Delete */}
                          <Table.Td>
                            <ActionIcon
                              size="sm"
                              color="red"
                              variant="subtle"
                              onClick={() => removeRmRow(row.rowId)}
                            >
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

              {/* ── Section 3: PM Details (placeholder for future) ── */}
              <Paper withBorder p="md" radius="sm"
                style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>

                <Group justify="space-between" mb="sm">
                  <Group gap="sm">
                    <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                      Packing Material Details
                    </Text>
                    <Badge size="xs" variant="light" color="gray">Coming soon</Badge>
                  </Group>
                  <Button size="xs" variant="light" leftSection={<IconPlus size={12} />} disabled>
                    Add Row
                  </Button>
                </Group>

                <Box
                  py="xl"
                  style={{
                    textAlign: 'center',
                    border: '1.5px dashed var(--mantine-color-gray-3)',
                    borderRadius: 8,
                  }}
                >
                  <Text size="sm" c="dimmed">
                    Packing material mapping will be configured here
                  </Text>
                </Box>

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
        message={`Are you sure you want to ${confirmLabel.toLowerCase()} this Product?`}
        confirmLabel={confirmLabel}
        errors={validationErrors}
        zIndex={250}
      />
    </>
  );
};

export default ProductMasterForm;