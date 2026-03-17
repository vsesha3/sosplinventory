/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button,
  Grid, Stack, Loader, Center, Badge,
} from '@mantine/core';
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

export interface POLineItemData {
  poDetId?: number;        // present in edit mode
  poRmCode?: string;   
   poRmId?: string | null;    // auto-filled from RM selection
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
}

export interface POLineItemProps {
  opened: boolean;
  onClose: () => void;
  onSave: (data: POLineItemData) => void;
  initialData?: Partial<POLineItemData>;
  mode?: 'create' | 'edit';
  poType?: string | null;  // passed from parent to filter RM list
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const defaultItem: POLineItemData = {
  poRmCode:   '',
  poRmName:   null,
  poUom:      null,
  poQty:      '',
  poRate:     '',
  poNoOfPacks:'',
  poPackSize: '',
  sgst:       '',
  cgst:       '',
  igst:       '',
  hsnCode:    '',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

interface FormDropdowns {
  rmOptions:  DropDownOption[];
  uomOptions: DropDownOption[];
}

const defaultDropdowns: FormDropdowns = {
  rmOptions:  [],
  uomOptions: [],
};

interface RmDetail {
  rmId: number;
  rmCode: number;
  rmName: string;
  uomName: string | null;
  uomId: number | null;
  avgRate: { source: string; parsedValue: number } | null;
  packSize: { source: string; parsedValue: number } | null;
}

interface RmApiResponse {
  success: boolean;
  message: string;
  data: RmDetail[];
}

// ── Component ─────────────────────────────────────────────────────────────────

const POLineItem: React.FC<POLineItemProps> = ({
  opened,
  onClose,
  onSave,
  initialData,
  mode = 'create',
  poType = null,
}) => {

  const [item, setItem]               = useState<POLineItemData>({ ...defaultItem, ...initialData });
  const [dropdowns, setDropdowns]     = useState<FormDropdowns>(defaultDropdowns);
  const [formLoading, setFormLoading] = useState(false);
  const [fetchError, setFetchError]   = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rmDetails, setRmDetails] = useState<RmDetail[]>([]);

  // ── Fetch functions ───────────────────────────────────────────────────────

const fetchRmList = async (): Promise<DropDownOption[]> => {
  const res = await api.get<RmApiResponse>('/api/rm/details/long');
  const data = Array.isArray(res.data.data)
    ? res.data.data
    : Object.values(res.data.data as Record<string, RmDetail>);
  setRmDetails(data); // ← store full objects
  return data
    .filter(rm => rm.rmName != null && rm.rmId != null)
    .map(rm => ({
      value: String(rm.rmId),
      label: `${rm.rmCode} - ${rm.rmName}`,
    }));
};

const fetchUomList = async (): Promise<DropDownOption[]> => {
  const res = await api.get<DropDownApiResponse>('/api/uom/dropdown');
  return res.data.data.filter(opt => opt.label != null && opt.value != null);
};

  // Add more fetch functions here as needed
  // const fetchHsnList = async (): Promise<DropDownOption[]> => { ... }

  // ── Master loader ─────────────────────────────────────────────────────────

  const loadFormData = async (cancelled: { value: boolean }) => {
    setFormLoading(true);
    setFetchError(null);
    try {
      const [rmOptions, uomOptions] = await Promise.all([
        fetchRmList(),
        fetchUomList(),
        // fetchHsnList(),  // ← add here as you expand
      ]);
      if (cancelled.value) return;
      setDropdowns({ rmOptions, uomOptions });
    } catch {
      if (!cancelled.value) {
        setFetchError('Failed to load form data.');
      }
    } finally {
      if (!cancelled.value) setFormLoading(false);
    }
  };

  useEffect(() => {
    if (!opened) return;
    // Reset form when opening
    setItem({ ...defaultItem, ...initialData });
    const cancelled = { value: false };
    loadFormData(cancelled);
    return () => { cancelled.value = true; };
  }, [opened]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Form helpers ──────────────────────────────────────────────────────────

  const set = (field: keyof POLineItemData) =>
    (value: string | null) =>
      setItem((prev) => ({ ...prev, [field]: value }));

const setStr = (field: keyof POLineItemData) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;   // ← read value immediately before it becomes null
    setItem((prev) => ({ ...prev, [field]: value }));
  };

  // When RM is selected, auto-fill UOM if the option carries it
const handleRmChange = (value: string | null) => {
  const rm = rmDetails.find(r => String(r.rmId) === value);
  console.log('Selected RM:', rm);          // ← check what avgRate looks like
  console.log('avgRate:', rm?.avgRate);     // ← check the exact structure
  
 const rate = rm?.avgRate != null
  ? typeof rm.avgRate === 'object'
    ? Number((rm.avgRate as { parsedValue: number }).parsedValue).toFixed(2)
    : Number(rm.avgRate).toFixed(2)
  : '';


  setItem(prev => ({
    ...prev,
    poRmId:     value,
    poRmCode:   String(rm?.rmCode ?? ''),
    poRmName:   rm?.rmName ?? null,
    poUom:      rm?.uomId ? String(rm.uomId) : prev.poUom,
    poRate:     rate,                       // ← use resolved rate
    poPackSize: rm?.packSize != null
      ? typeof rm.packSize === 'object'
        ? String((rm.packSize as { parsedValue: number }).parsedValue)
        : String(rm.packSize)
      : prev.poPackSize,
  }));
};

  const confirmLabel = mode === 'edit' ? 'Update' : 'Save';

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
        styles={{
          body: {
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        }}
        zIndex={300}
      >
        <Paper
          withBorder
          radius="md"
          style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        >

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
                <Badge
                  variant="filled"
                  size="sm"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                >
                  Det # {item.poDetId}
                </Badge>
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

              {fetchError && (
                <Text size="xs" c="red" mb="sm">{fetchError}</Text>
              )}

              {/* ── Row 1: RM Name | UOM ── */}
              <Grid gutter="md" mb="md">
                <Grid.Col span={8}>
                 <FormSelect
  label="Raw Material"
  value={item.poRmId ?? null}   // ← was poRmCode
  onChange={handleRmChange}
  data={dropdowns.rmOptions}
  placeholder="Search and select RM"
  required
  searchable
/>
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
                  <FormTextInput
                    label="Quantity"
                    value={item.poQty}
                    onChange={setStr('poQty')}
                    placeholder="0.000"
                    required
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FormTextInput
                    label="Rate / Amount"
                    value={item.poRate}
                    onChange={setStr('poRate')}
                    placeholder="0.00"
                    required
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FormTextInput
                    label="HSN Code"
                    value={item.hsnCode}
                    onChange={setStr('hsnCode')}
                    placeholder="e.g. 3923"
                  />
                </Grid.Col>
              </Grid>

              {/* ── Row 3: Packs | Pack Size ── */}
              <Grid gutter="md" mb="md">
                <Grid.Col span={6}>
                  <FormTextInput
                    label="No of Packs"
                    value={item.poNoOfPacks}
                    onChange={setStr('poNoOfPacks')}
                    placeholder="0"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <FormTextInput
                    label="Pack Size"
                    value={item.poPackSize}
                    onChange={setStr('poPackSize')}
                    placeholder="0.000"
                  />
                </Grid.Col>
              </Grid>

              {/* ── Row 4: SGST | CGST | IGST ── */}
              <Grid gutter="md" mb="lg">
                <Grid.Col span={4}>
                  <FormTextInput
                    label="SGST %"
                    value={item.sgst}
                    onChange={setStr('sgst')}
                    placeholder="0.00"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FormTextInput
                    label="CGST %"
                    value={item.cgst}
                    onChange={setStr('cgst')}
                    placeholder="0.00"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FormTextInput
                    label="IGST %"
                    value={item.igst}
                    onChange={setStr('igst')}
                    placeholder="0.00"
                  />
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
            <Group justify="flex-end">
              <Button variant="default" size="sm" onClick={onClose}>Cancel</Button>
              <Button
                size="sm"
                disabled={formLoading}
                onClick={() => setConfirmOpen(true)}
              >
                {confirmLabel} Item
              </Button>
            </Group>
          </Box>

        </Paper>
      </Modal>

      {/* ── Confirm Dialog ── */}
      <ConfirmDialog
        opened={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => onSave(item)}
        message={`Are you sure you want to ${confirmLabel.toLowerCase()} this line item?`}
        confirmLabel={confirmLabel}
      />
    </>
  );
};

export default POLineItem;