/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button,
  Grid, Stack, Loader, Center, Badge, Divider, ActionIcon, Tooltip,
} from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { FormTextInput } from '../../components/common/FormTextInput';
import { FormSelect } from '../../components/common/FormSelect';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import api from '../../services/api';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DropDownOption {
  value: string;
  label: string;
}

interface DropDownApiResponse {
  success: boolean;
  message: string;
  data: DropDownOption[];
}

// API response from /api/po/dropdown
interface PoDropDownItem {
  code: string;
  name: string;
  poType: string;
}

interface PoDropDownApiResponse {
  success: boolean;
  message: string;
  data: PoDropDownItem[];
}

export interface POLineItemData {
  poDetId?: number;
  poRmCode?: string;
  poRmId?: string | null;
  poRmName: string | null;
  poUom: string | null;
  poQty: string;
  poRate: string;
  poNoOfPacks: string;
  poPackSize: string;
  sgst: string;
  cgst: string;
  igst: string;
  hsnCode: string;
  isNewMaterial?: boolean;
  newItemCode?: string;
  newItemName?: string;
}

export interface POLineItemProps {
  opened: boolean;
  onClose: () => void;
  onSave: (data: POLineItemData) => void;
  initialData?: Partial<POLineItemData>;
  mode?: 'create' | 'edit';
  poType?: string | null;
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const defaultItem: POLineItemData = {
  poRmId:        null,
  poRmCode:      '',
  poRmName:      null,
  poUom:         null,
  poQty:         '',
  poRate:        '',
  poNoOfPacks:   '',
  poPackSize:    '',
  sgst:          '',
  cgst:          '',
  igst:          '',
  hsnCode:       '',
  isNewMaterial: false,
  newItemCode:   '',
  newItemName:   '',
};

// ── Maps ──────────────────────────────────────────────────────────────────────

const PO_TYPE_LABELS: Record<string, string> = {
  'RAW_MATERIAL':     'Raw Material',
  'PACKING_MATERIAL': 'Packing Material',
  'CAPITAL_GOODS':    'Capital Goods',
  'MISCELLANEOUS':    'Miscellaneous',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

interface FormDropdowns {
  rmOptions:  DropDownOption[];
  uomOptions: DropDownOption[];
}

const defaultDropdowns: FormDropdowns = { rmOptions: [], uomOptions: [] };

const validateItem = (item: POLineItemData): string[] => {
  const errors: string[] = [];
  if (item.isNewMaterial) {
    if (!item.newItemCode?.trim()) errors.push('Item Code is required for new material');
    if (!item.newItemName?.trim()) errors.push('Item Name is required for new material');
  } else {
    if (!item.poRmId && !item.poRmName) errors.push('Raw Material is required');
  }
  if (!item.poUom)                                    errors.push('UOM is required');
  if (!item.poQty || parseFloat(item.poQty) <= 0)    errors.push('Quantity must be greater than 0');
  if (!item.poRate || parseFloat(item.poRate) <= 0)   errors.push('Rate / Amount must be greater than 0');
  return errors;
};

const safe = (val: string): number => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

// ── Component ─────────────────────────────────────────────────────────────────

const POLineItem: React.FC<POLineItemProps> = ({
  opened,
  onClose,
  onSave,
  initialData,
  mode = 'create',
  poType = null,
}) => {

  const [item, setItem]           = useState<POLineItemData>({ ...defaultItem, ...initialData });
  const [dropdowns, setDropdowns] = useState<FormDropdowns>(defaultDropdowns);
  const [formLoading, setFormLoading]           = useState(false);
  const [fetchError, setFetchError]             = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen]           = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // ── Computed ──────────────────────────────────────────────────────────────

  const qty       = safe(item.poQty);
  const rate      = safe(item.poRate);
  const sgstPct   = safe(item.sgst);
  const cgstPct   = safe(item.cgst);
  const igstPct   = safe(item.igst);
  const subTotal  = qty * rate;
  const taxPct    = igstPct > 0 ? igstPct : (sgstPct + cgstPct);
  const taxAmount = subTotal * taxPct / 100;
  const lineTotal = subTotal + taxAmount;

  // ── Fetch ─────────────────────────────────────────────────────────────────

const fetchRmList = async (): Promise<DropDownOption[]> => {
  const res = await api.get<PoDropDownApiResponse>('/api/po/dropdown', {
    params: { poType },
  });
  const seen = new Set<string>();
  return res.data.data
    .filter(opt => opt.name != null && opt.code != null)
    .filter(opt => {
      if (seen.has(opt.code)) return false;
      seen.add(opt.code);
      return true;
    })
    .map(opt => ({
      value: opt.code,
      label: `${opt.code} - ${opt.name}`,
    }));
};

  const fetchUomList = async (): Promise<DropDownOption[]> => {
    const res = await api.get<DropDownApiResponse>('/api/uom/dropdown');
    return res.data.data.filter(opt => opt.label != null && opt.value != null);
  };

  const loadFormData = async (cancelled: { value: boolean }) => {
    setFormLoading(true);
    setFetchError(null);
    try {
      const [rmOptions, uomOptions] = await Promise.all([fetchRmList(), fetchUomList()]);
      if (cancelled.value) return;
      setDropdowns({ rmOptions, uomOptions });
    } catch {
      if (!cancelled.value) setFetchError('Failed to load form data.');
    } finally {
      if (!cancelled.value) setFormLoading(false);
    }
  };

  useEffect(() => {
    if (!opened) return;
    setItem({ ...defaultItem, ...initialData });
    setValidationErrors([]);
    const cancelled = { value: false };
    loadFormData(cancelled);
    return () => { cancelled.value = true; };
  }, [opened]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Form helpers ──────────────────────────────────────────────────────────

  const set = (field: keyof POLineItemData) =>
    (value: string | null) =>
      setItem(prev => ({ ...prev, [field]: value }));

  const setStr = (field: keyof POLineItemData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      setItem(prev => ({ ...prev, [field]: value }));
    };

  const handleSgstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setItem(prev => ({ ...prev, sgst: value, cgst: value, igst: '' }));
  };

  const handleCgstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setItem(prev => ({ ...prev, cgst: value, sgst: value, igst: '' }));
  };

  const handleIgstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setItem(prev => ({ ...prev, igst: value, sgst: '', cgst: '' }));
  };

  // RM selected from dropdown — map code/name from option label
  const handleRmChange = (value: string | null) => {
    const selected = dropdowns.rmOptions.find(opt => opt.value === value);
    // label format is "CODE - NAME", extract name part
    const namePart = selected?.label
      ? selected.label.includes(' - ')
        ? selected.label.substring(selected.label.indexOf(' - ') + 3)
        : selected.label
      : null;
    setItem(prev => ({
      ...prev,
      poRmId:   value,
      poRmCode: value ?? '',
      poRmName: namePart,
    }));
  };

  const toggleNewMaterial = () => {
    setItem(prev => ({
      ...prev,
      isNewMaterial: !prev.isNewMaterial,
      poRmId:      null,
      poRmCode:    '',
      poRmName:    null,
      newItemCode: '',
      newItemName: '',
    }));
  };

  const handleSaveClick = () => {
    const errors = validateItem(item);
    setValidationErrors(errors);
    setConfirmOpen(true);
  };

  const confirmLabel = mode === 'edit' ? 'Update' : 'Save';
  const typeLabel    = poType ? (PO_TYPE_LABELS[poType] ?? poType) : 'Item / Service';

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
            overflow: 'hidden',
          },
        }}
      >
        <Paper withBorder radius="md" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

          {/* ── Header ── */}
          <Box
            px="lg" py="sm"
            style={{
              backgroundColor: '#3a5f8a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}
          >
            <Group gap="sm">
              <Text fw={700} size="sm" c="white">
                {mode === 'edit' ? 'Edit Line Item' : 'Add Line Item'}
              </Text>
              {item.poDetId && (
                <Badge variant="filled" size="sm"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  Det # {item.poDetId}
                </Badge>
              )}
              {poType && (
                <Badge variant="light" size="sm" color="blue">{typeLabel}</Badge>
              )}
              {item.isNewMaterial && (
                <Badge variant="filled" size="sm" color="orange">New Material</Badge>
              )}
            </Group>
          </Box>

          {/* ── Body ── */}
          {formLoading ? (
            <Center py={60}>
              <Stack align="center" gap="sm">
                <Loader size="sm" />
                <Text size="sm" c="dimmed">Loading...</Text>
              </Stack>
            </Center>
          ) : (
            <Box p="lg">

              {fetchError && <Text size="xs" c="red" mb="sm">{fetchError}</Text>}

              {/* ── Row 1: Material | UOM ── */}
              <Grid gutter="md" mb="md">
                <Grid.Col span={8}>
                  {item.isNewMaterial ? (
                    <Stack gap="xs">
                      <Group gap="xs" align="flex-end">
                        <Box style={{ flex: 1 }}>
                          <FormTextInput
                            label={`${typeLabel} — Item Code`}
                            value={item.newItemCode ?? ''}
                            onChange={(e) => {
                              const value = e.currentTarget.value;
                              setItem(prev => ({ ...prev, newItemCode: value, poRmCode: value }));
                            }}
                            placeholder="Enter new item code"
                            required
                          />
                        </Box>
                        <Tooltip label="Switch to select existing item">
                          <ActionIcon variant="light" color="blue" size="lg" mb={1} onClick={toggleNewMaterial}>
                            <IconSearch size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                      <FormTextInput
                        label="Item Name"
                        value={item.newItemName ?? ''}
                        onChange={(e) => {
                          const value = e.currentTarget.value;
                          setItem(prev => ({ ...prev, newItemName: value, poRmName: value }));
                        }}
                        placeholder="Enter new item name"
                        required
                      />
                    </Stack>
                  ) : (
                    <Group gap="xs" align="flex-end">
                      <Box style={{ flex: 1 }}>
                        <FormSelect
                          label={typeLabel}
                          value={item.poRmId ?? null}
                          onChange={handleRmChange}
                          data={dropdowns.rmOptions}
                          placeholder={`Search ${typeLabel}`}
                          required
                          searchable
                        />
                      </Box>
                      <Tooltip label="Add new material not in list">
                        <ActionIcon variant="light" color="orange" size="lg" mb={1} onClick={toggleNewMaterial}>
                          <IconPlus size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  )}
                </Grid.Col>
                <Grid.Col span={4}>
                  <FormSelect
                    label="UOM"
                    value={item.poUom}
                    onChange={set('poUom')}
                    data={dropdowns.uomOptions}
                    placeholder="Select UOM"
                    required
                    searchable
                  />
                </Grid.Col>
              </Grid>

              {/* ── Row 2: Qty | Rate | HSN Code ── */}
              <Grid gutter="md" mb="md">
                <Grid.Col span={4}>
                  <FormTextInput label="Quantity" value={item.poQty} onChange={setStr('poQty')} placeholder="0.000" required />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FormTextInput label="Rate / Amount" value={item.poRate} onChange={setStr('poRate')} placeholder="0.00" required />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FormTextInput label="HSN Code" value={item.hsnCode} onChange={setStr('hsnCode')} placeholder="e.g. 3923" />
                </Grid.Col>
              </Grid>

              {/* ── Row 3: Packs | Pack Size ── */}
              <Grid gutter="md" mb="md">
                <Grid.Col span={6}>
                  <FormTextInput label="No of Packs" value={item.poNoOfPacks} onChange={setStr('poNoOfPacks')} placeholder="0" />
                </Grid.Col>
                <Grid.Col span={6}>
                  <FormTextInput label="Pack Size" value={item.poPackSize} onChange={setStr('poPackSize')} placeholder="0.000" />
                </Grid.Col>
              </Grid>

              {/* ── Row 4: SGST | CGST | IGST ── */}
              <Grid gutter="md" mb="md">
                <Grid.Col span={4}>
                  <FormTextInput label="SGST %" value={item.sgst} onChange={handleSgstChange} placeholder="0.00" />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FormTextInput label="CGST %" value={item.cgst} onChange={handleCgstChange} placeholder="0.00" />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FormTextInput label="IGST %" value={item.igst} onChange={handleIgstChange} placeholder="0.00" />
                </Grid.Col>
              </Grid>

              {/* ── Row 5: Computed Summary ── */}
              <Divider mb="md" />
              <Grid gutter="md">
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

            </Box>
          )}

          {/* ── Footer ── */}
          <Box
            px="lg" py="sm"
            style={{
              borderTop: '1px solid var(--mantine-color-gray-3)',
              backgroundColor: 'var(--mantine-color-body)',
              flexShrink: 0,
            }}
          >
            <Group justify="space-between">
              {item.isNewMaterial ? (
                <Text size="xs" c="orange" fw={500}>
                  ⚡ New material will be registered on save
                </Text>
              ) : (
                <Box />
              )}
              <Group gap="sm">
                <Button variant="default" size="sm" onClick={onClose}>Cancel</Button>
                <Button size="sm" disabled={formLoading} onClick={handleSaveClick}>
                  {confirmLabel} Item
                </Button>
              </Group>
            </Group>
          </Box>

        </Paper>
      </Modal>

      <ConfirmDialog
        opened={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => onSave(item)}
        message={
          item.isNewMaterial
            ? `This will register "${item.newItemCode} - ${item.newItemName}" as a new material and add it to this PO. Continue?`
            : `Are you sure you want to ${confirmLabel.toLowerCase()} this line item?`
        }
        confirmLabel={confirmLabel}
        errors={validationErrors}
        zIndex={400}
      />
    </>
  );
};

export default POLineItem;