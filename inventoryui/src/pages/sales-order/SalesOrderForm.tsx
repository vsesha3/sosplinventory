/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button,
  Grid, Badge, Stack, Loader, Center, Divider, Table, Tooltip, ActionIcon,
} from '@mantine/core';
import { IconFileInvoice, IconPlus } from '@tabler/icons-react';
import QuickAddModal from '../../components/common/QuickAddModal';
import { FormTextInput } from '../../components/common/FormTextInput';
import { FormSelect } from '../../components/common/FormSelect';
import { FormDatePicker } from '../../components/common/FormDatePicker';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import FormHeader from '../common/Formheader';
import MasterTable from '../../components/common/MasterTable';
import type { ColumnDef } from '../../components/common/MasterTable';
import api from '../../services/api';
import {
  defaultSalesOrderForm,
  mapApiToSalesOrderForm,
  PARTIAL_PO_OPTIONS,
  INWARD_TYPE_OPTIONS,
} from '../../types/sales.types';
import type { InwardType } from '../../types/api.types';
import type { SalesOrderFormData, SalesOrderApiData } from '../../types/sales.types';
import { fetchWorkOrdersByPo } from '../../types/workorder.types';
import type { WorkOrderDetailData } from '../../types/workorder.types';
import WorkOrderForm from '../work-order/WorkOrderForm';
import type { WorkOrderFormData } from '../work-order/WorkOrderForm';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DropDownOption {
  value: string;
  label: string;
}

export interface SalesOrderFormProps {
  opened: boolean;
  onClose: () => void;
  onSave?: (data: SalesOrderFormData) => void;
  poId?: number | null;
  mode?: 'create' | 'update';
}

// ── Work Order columns ────────────────────────────────────────────────────────

const WO_COLUMNS: ColumnDef[] = [
  { key: 'woId', label: 'WO Id', width: 80 },
  { key: 'plant', label: 'Plant', width: 110 },
  { key: 'woCode', label: 'WO Code', width: 180 },
  { key: 'productName', label: 'Product Name', width: 200 },
  { key: 'pmName', label: 'PM', width: 150 },
  { key: 'qty', label: 'Qty', width: 90, align: 'right' },
  { key: 'perUnitRate', label: 'Rate', width: 90, align: 'right' },
  { key: 'totalAmount', label: 'Total', width: 110, align: 'right' },
];


// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (v: number | null, d = 2) =>
  v != null ? v.toFixed(d) : '—';

const dsh = (v: string | null | undefined) =>
  v && v.trim() ? v : '—';

// ── Component ─────────────────────────────────────────────────────────────────

const SalesOrderForm: React.FC<SalesOrderFormProps> = ({
  opened,
  onClose,
  onSave,
  poId = null,
  mode = 'create',
}) => {

  const [form, setForm] = useState<SalesOrderFormData>({ ...defaultSalesOrderForm });
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [companyOptions, setCompanyOptions] = useState<DropDownOption[]>([]);
  const [userOptions, setUserOptions] = useState<DropDownOption[]>([]);
  const [customerOptions, setCustomerOptions] = useState<DropDownOption[]>([]);

  // ── QuickAdd: Customer ────────────────────────────────────────────────────
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  // ── QuickAdd: Company ─────────────────────────────────────────────────────
  const [addCompanyOpen, setAddCompanyOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [quickSaving, setQuickSaving]       = useState(false);

  // Standard dropdown { value, label } → string values for Select
  const toOptions = (data: any): DropDownOption[] =>
    (Array.isArray(data) ? data : [])
      .filter((o: any) => o != null && o.value != null)
      .map((o: any) => ({ value: String(o.value), label: String(o.label ?? '-') }));
  const [woLines, setWoLines] = useState<WorkOrderDetailData[]>([]);
  const [woLoading, setWoLoading] = useState(false);
  const [woFormOpen, setWoFormOpen] = useState(false);
  const [editWoId, setEditWoId] = useState<number | null>(null);
  const [woFormMode, setWoFormMode] = useState<'create' | 'update'>('create');

  // ── Load ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!opened) {
      setForm({ ...defaultSalesOrderForm });

      setFetchError(null);
      setValidationErrors([]);
      setWoLines([]);
      setWoLoading(false);
      setSelectedWo([]);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const [companyRes, userRes, customerRes] = await Promise.all([
          api.get('/api/dropdown/company-list')
            .catch(() => ({ data: { data: [] } })),
          api.get('/api/dropdown/user-list')
            .catch(() => ({ data: { data: [] } })),
          api.get('/api/dropdown/customer-list')
            .catch(() => ({ data: { data: [] } })),
        ]);
        setCompanyOptions(toOptions(companyRes.data.data));
        setUserOptions(toOptions(userRes.data.data));
        setCustomerOptions(toOptions(customerRes.data.data));

        if (mode === 'update' && poId) {
          const [soRes] = await Promise.all([
            api.get(`/api/inventory/sales-orders/${poId}`),
          ]);
          const data: SalesOrderApiData = soRes.data.data;
          setForm(mapApiToSalesOrderForm(data));

          // Load work orders
          setWoLoading(true);
          try {
            const orders = await fetchWorkOrdersByPo(api, poId);
            setWoLines(orders);
          } catch {
            setWoLines([]);
          } finally {
            setWoLoading(false);
          }
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

  const handleAddCompany = async () => {
    const name = newCompanyName.trim();
    if (!name) return;
    setQuickSaving(true);
    try {
      const res = await api.post('/api/inventory/misc-master', {
        miscCode: 'COMPANY',
        miscName: name,
        isActive: true,
      });
      const created = res.data?.data ?? res.data;
      const createdId = created?.miscId ?? created?.companyId ?? created?.id ?? null;

      // Refresh company dropdown
      const companyRes = await api.get('/api/dropdown/company-list')
        .catch(() => ({ data: { data: [] } }));
      let updated = toOptions(companyRes.data.data);

      // Auto-select the new company — by returned id first, then by name
      let match = (createdId != null ? updated.find(o => o.value === String(createdId)) : undefined)
        ?? updated.find(o => o.label.trim().toLowerCase() === name.toLowerCase());

      // Not in the refreshed list yet — add it so the Select can show it
      if (!match && createdId != null) {
        match = { value: String(createdId), label: created?.miscName ?? name };
        updated = [...updated, match];
      }

      setCompanyOptions(updated);
      if (match) {
        const companyId = match.value;
        setForm(prev => ({ ...prev, companyId }));
      }
      setNewCompanyName('');
      setAddCompanyOpen(false);
    } catch (err: any) {
      console.error('[handleAddCompany] Failed:', err?.response?.data ?? err);
      setFetchError(
        err?.response?.data?.message || 'Failed to add Company. Please try again.'
      );
    } finally {
      setQuickSaving(false);
    }
  };

  const handleAddCustomer = async () => {
    const name = newCustomerName.trim();
    if (!name) return;
    setQuickSaving(true);
    try {
      const res = await api.post('/api/supplier', {
        partnerType:  'CUSTOMER',
        supplierName: name,
        isActive:     true,   // dropdowns list active records only
      });
      const created = res.data?.data ?? res.data;
      const createdId = created?.supplierId ?? created?.id ?? null;

      // Refresh customer dropdown
      const customerRes = await api.get('/api/dropdown/customer-list')
        .catch(() => ({ data: { data: [] } }));
      let updated = toOptions(customerRes.data.data);

      // Auto-select the new customer — by returned id first, then by name
      let match = (createdId != null ? updated.find(o => o.value === String(createdId)) : undefined)
        ?? updated.find(o => o.label.trim().toLowerCase() === name.toLowerCase());

      // Not in the refreshed list yet — add it so the Select can show it
      if (!match && createdId != null) {
        match = { value: String(createdId), label: created?.supplierName ?? name };
        updated = [...updated, match];
      }

      setCustomerOptions(updated);
      if (match) {
        const partnerCode = match.value;
        setForm(prev => ({ ...prev, partnerCode }));
      }
      setNewCustomerName('');
      setAddCustomerOpen(false);
    } catch (err: any) {
      console.error('[handleAddCustomer] Failed:', err?.response?.data ?? err);
      setFetchError(
        err?.response?.data?.message || 'Failed to add Customer. Please try again.'
      );
    } finally {
      setQuickSaving(false);
    }
  };

  // ── Form helpers ──────────────────────────────────────────────────────────

  const setStr = (field: keyof SalesOrderFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const setDate = (field: keyof SalesOrderFormData) =>
    (value: any) =>
      setForm(prev => ({ ...prev, [field]: value }));

  const setSelect = (field: keyof SalesOrderFormData) =>
    (value: string | null) =>
      setForm(prev => ({ ...prev, [field]: value }));

  // ── Validation ────────────────────────────────────────────────────────────

  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!form.companyId) errors.push('Company is required');
    if (!form.ordDate) errors.push('Order Date is required');
    if (!form.ordDeliveryDate) errors.push('Delivery Date is required');
    if (!form.partialPoFlag) errors.push('Partial PO is required');
    if (!form.requestedBy) errors.push('Requested By is required');
    if (!form.inwardType) errors.push('Sales Order Type is required');    return errors;
  };

  const confirmLabel = mode === 'update' ? 'Update' : 'Save';

  // ── Title ─────────────────────────────────────────────────────────────────

  const headerTitle = mode === 'update' && form.poId
    ? `Edit Sales Order — PO ID: ${form.poId}`
    : 'New Sales Order';

  // ── Work Order rows — compact like PurchaseOrderForm line items ───────────

  // ── Work Order selection ─────────────────────────────────────────────────
  const [selectedWo, setSelectedWo] = useState<number[]>([]);
  const woIds = woLines.map(l => l.woId);
  const allWoSel = woIds.length > 0 && woIds.every(id => selectedWo.includes(id));
  const someWoSel = woIds.some(id => selectedWo.includes(id)) && !allWoSel;
  const toggleAllWo = () => allWoSel ? setSelectedWo([]) : setSelectedWo(woIds);
  const toggleWo = (id: number) =>
    setSelectedWo(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const woRows = woLines.map(item => (
    <Table.Tr key={item.woId}>
      <Table.Td>
        <input
          type="checkbox"
          checked={selectedWo.includes(item.woId)}
          onChange={() => toggleWo(item.woId)}
        />
      </Table.Td>
      <Table.Td>
        <Text size="xs" fw={500}>{item.woId}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="xs">{dsh(item.plant)}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="xs" fw={500}>{dsh(item.woCode)}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="xs">{dsh(item.productName)}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="xs">{dsh(item.pmName)}</Text>
      </Table.Td>
      <Table.Td ta="right">
        <Text size="xs">{fmt(item.qty, 3)}</Text>
      </Table.Td>
      <Table.Td ta="right">
        <Text size="xs">{fmt(item.perUnitRate)}</Text>
      </Table.Td>
      <Table.Td ta="right">
        <Text size="xs" fw={600} c="blue">{fmt(item.totalAmount)}</Text>
      </Table.Td>
    </Table.Tr>
  ));

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={null}
        size="80%"
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
          style={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh',
          }}>

          {/* ── Header ── */}
          <FormHeader
            title={headerTitle}
            icon={<IconFileInvoice size={18} color="white" />}
            color="#4a6fa5"
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

              {fetchError && (
                <Text size="xs" c="red" mb="sm">{fetchError}</Text>
              )}

              {/* ── Header fields ── */}
              <Paper withBorder p="md" radius="sm" mb="md"
                style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <Grid columns={12} gutter="sm">

                  {/* ── Row 1: PO Id | Sales Order Type | Sales Order Reference No | Customer ── */}
                  <Grid.Col span={2}>
                    <FormTextInput
                      label="PO Id"
                      value={form.poId ? String(form.poId) : '—'}
                      onChange={() => { }}
                      readOnly
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    {/* Job Order → JOBINWARD, By PO → BYPO. Optional and editable for now —
                        to be locked once the WO reaches material issue (handled there later). */}
                    <FormSelect
                      label="Sales Order Type"
                      value={form.inwardType}
                      onChange={(value) =>
                        setForm(prev => ({ ...prev, inwardType: value as InwardType | null }))}
                      data={INWARD_TYPE_OPTIONS}
                      placeholder="Select"
                      required
                      clearable
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <FormTextInput
                      label="Sales Order Reference No"
                      value={form.poNumber}
                      onChange={setStr('poNumber')}
                      placeholder="Enter reference number"
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Group gap="xs" align="flex-end">
                      <Box style={{ flex: 1 }}>
                        <FormSelect
                          label="Customer"
                          value={form.partnerCode}
                          onChange={setSelect('partnerCode')}
                          data={customerOptions}
                          placeholder="--------Select----------"
                          searchable
                          clearable
                        />
                      </Box>
                      <Tooltip label="Add new Customer" position="top">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          size="lg"
                          mb={1}
                          onClick={() => { setNewCustomerName(''); setAddCustomerOpen(true); }}
                        >
                          <IconPlus size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Grid.Col>

                  {/* ── Row 2: Company | Order Date | Delivery Date ── */}
                  <Grid.Col span={4}>
                    <Group gap="xs" align="flex-end">
                      <Box style={{ flex: 1 }}>
                        <FormSelect
                          label="Company"
                          value={form.companyId}
                          onChange={setSelect('companyId')}
                          data={companyOptions}
                          placeholder="--------Select----------"
                          required
                          searchable
                        />
                      </Box>
                      <Tooltip label="Add new Company" position="top">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          size="lg"
                          mb={1}
                          onClick={() => { setNewCompanyName(''); setAddCompanyOpen(true); }}
                        >
                          <IconPlus size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormDatePicker
                      label="* Order Date"
                      value={form.ordDate}
                      onChange={setDate('ordDate')}
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormDatePicker
                      label="* Delivery Date"
                      value={form.ordDeliveryDate}
                      onChange={setDate('ordDeliveryDate')}
                      required
                    />
                  </Grid.Col>

                  {/* ── Row 3: Partial PO | Requested By ── */}
                  <Grid.Col span={6}>
                    <FormSelect
                      label="* Partial PO"
                      value={form.partialPoFlag}
                      onChange={setSelect('partialPoFlag')}
                      data={PARTIAL_PO_OPTIONS}
                      placeholder="Select"
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <FormSelect
                      label="Requested By"
                      value={form.requestedBy}
                      onChange={setSelect('requestedBy')}
                      data={userOptions}
                      placeholder="Select user"
                      required
                      searchable
                    />
                  </Grid.Col>

                </Grid>
              </Paper>

              {/* ── Work Orders table (edit mode only) ── */}
              {mode === 'update' && poId && (
                <>
                  <Divider
                    label={
                      <Group gap="xs">
                        <Text size="sm" fw={500}>Work Orders</Text>
                        {woLines.length > 0 && (
                          <Badge size="xs" variant="light" color="blue">
                            {woLines.length} item{woLines.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </Group>
                    }
                    labelPosition="left"
                    mb="md"
                  />
                  <MasterTable
                    columns={WO_COLUMNS}
                    rows={woRows}
                    colSpan={WO_COLUMNS.length + 1}
                    totalElements={woLines.length}
                    loading={woLoading}
                    page={1}
                    totalPages={1}
                    pageSize={woLines.length || 1}
                    onPageChange={() => { }}
                    searchValue=""
                    onSearchChange={() => { }}
                    allSelected={allWoSel}
                    someSelected={someWoSel}
                    onToggleSelectAll={toggleAllWo}
                    selectedCount={selectedWo.length}
                    onAdd={() => {
                      setEditWoId(null);
                      setWoFormMode('create');
                      setWoFormOpen(true);
                    }}
                    onEdit={() => {
                      if (selectedWo.length === 1) {
                        setEditWoId(selectedWo[0]);
                        setWoFormMode('update');
                        setWoFormOpen(true);
                      }
                    }}
                    onDelete={undefined}
                    onRefresh={() => {
                      if (poId) fetchWorkOrdersByPo(api, poId).then(setWoLines);
                    }}
                  />
                  {woLines.length === 0 && !woLoading && (
                    <Text size="sm" c="dimmed" ta="center" py="md">
                      No work orders found for this sales order.
                    </Text>
                  )}
                </>
              )}

            </Box>
          )}

          {/* ── Footer — always visible, pinned to bottom ── */}
          <Box
            px="lg" py="sm"
            style={{
              borderTop: '1px solid var(--mantine-color-gray-3)',
              backgroundColor: 'var(--mantine-color-body)',
              flexShrink: 0,   // ← never shrinks — always visible
            }}
          >
            <Group justify="flex-end" gap="sm">
              <Button variant="default" size="sm" onClick={onClose}>
                Cancel
              </Button>
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

      <WorkOrderForm
        opened={woFormOpen}
        onClose={() => {
          setWoFormOpen(false);
          setEditWoId(null);
          setWoFormMode('create');
        }}
        onSave={async (data: WorkOrderFormData) => {
          
          try {
            // Extract pmId from "421_983" → 421
            const pmIdRaw = data.pmId?.includes('_')
              ? data.pmId.split('_')[0]
              : data.pmId;

            const payload = {
              ...data,
              pmId: pmIdRaw ? Number(pmIdRaw) : null,
              productId: data.productId ? Number(data.productId) : null,
              uomId: data.uomId ? Number(data.uomId) : null,
              perUnitRate: data.perUnitRate.trim() ? Number(data.perUnitRate) : null,
            };

            if (woFormMode === 'update' && data.woId) {
              await api.put(`/api/inventory/work-order/${data.woId}`, payload);
            } else {
              await api.post('/api/inventory/work-order', { ...payload, poId });
            }

            setWoFormOpen(false);
            setEditWoId(null);
            setSelectedWo([]);
            if (poId) fetchWorkOrdersByPo(api, poId).then(setWoLines);
          } catch (err: any) {
            console.error('Failed to save work order', err);
          }
        }}
        woId={editWoId}
        poId={poId}
        mode={woFormMode}
      />

      <ConfirmDialog
        opened={confirmOpen}
        onClose={() => { setConfirmOpen(false); setValidationErrors([]); }}
        onConfirm={() => {
          onSave?.({ ...form });
          setConfirmOpen(false);
          onClose();
        }}
        message={`Are you sure you want to ${confirmLabel.toLowerCase()} this Sales Order?`}
        confirmLabel={confirmLabel}
        errors={validationErrors}
        zIndex={250}
      />

      {/* ── QuickAdd: Company ── */}
      <QuickAddModal
        opened={addCompanyOpen}
        onClose={() => setAddCompanyOpen(false)}
        title="Add Company"
        label="Company Name"
        value={newCompanyName}
        onChange={setNewCompanyName}
        onSave={handleAddCompany}
        saving={quickSaving}
      />

      {/* ── QuickAdd: Customer ── */}
      <QuickAddModal
        opened={addCustomerOpen}
        onClose={() => setAddCustomerOpen(false)}
        title="Add Customer"
        label="Customer Name"
        value={newCustomerName}
        onChange={setNewCustomerName}
        onSave={handleAddCustomer}
        saving={quickSaving}
      />
    </>
  );
};

export default SalesOrderForm;