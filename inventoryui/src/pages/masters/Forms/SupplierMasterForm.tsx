/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button,
  Grid, Stack, Loader, Center, Textarea,Alert,List
} from '@mantine/core';
import { IconTruckDelivery } from '@tabler/icons-react';
import { FormTextInput } from '../../../components/common/FormTextInput';
import { FormSelect }    from '../../../components/common/FormSelect';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import FormHeader        from '../../common/Formheader';
import api from '../../../services/api';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DropDownOption {
  value: string;
  label: string;
  code?: string;
}

export interface SupplierMasterFormData {
  supplierId:          number | null;
  supplierName:        string;
  supplierCode:        string;
  address:             string;
  countryId:           string | null;
  gstNo:           string;
  supplierTypeId:      string | null;
  emailId:             string;
  panNo:               string;
  contactPersonName:   string;
  contactMobileNumber: string;
  itNo:                string;
}

export interface SupplierMasterFormProps {
  opened:     boolean;
  onClose:    () => void;
  onSave?:    (data: SupplierMasterFormData) => void;
  supplierId?: number | null;
  mode?:      'create' | 'update';
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const defaultForm: SupplierMasterFormData = {
  supplierId:          null,
  supplierName:        '',
  supplierCode:        'SOSPLS-',
  address:             '',
  countryId:           '582',
  gstNo:           '',
  supplierTypeId:      null,
  emailId:             '',
  panNo:               '',
  contactPersonName:   '',
  contactMobileNumber: '',
  itNo:                '',
};

// ── Validation ────────────────────────────────────────────────────────────────

const validateForm = (form: SupplierMasterFormData): string[] => {
  const errors: string[] = [];

  if (!form.supplierName.trim())
    errors.push('Supplier Name is required');

  if (!form.address.trim())
    errors.push('Address is required');

  if (!form.countryId)
    errors.push('Country is required');

  if (form.gstNo.trim()) {
    const gst = form.gstNo.trim().toUpperCase();
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gst))
      errors.push('GST Number is not valid');
  }

  if (form.emailId.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailId.trim()))
    errors.push('Email ID is not valid');

  return errors;
};

// ── Component ─────────────────────────────────────────────────────────────────

const SupplierMasterForm: React.FC<SupplierMasterFormProps> = ({
  opened,
  onClose,
  onSave,
  supplierId = null,
  mode       = 'create',
}) => {

  const [form,        setForm]        = useState<SupplierMasterFormData>({ ...defaultForm });
  const [loading,     setLoading]     = useState(false);
  const [fetchError,  setFetchError]  = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Dropdowns
  const [countryOptions,      setCountryOptions]      = useState<DropDownOption[]>([]);
  const [supplierTypeOptions, setSupplierTypeOptions] = useState<DropDownOption[]>([]);

  // ── Clean helper ─────────────────────────────────────────────────────────

  const clean = (data: any[]): DropDownOption[] => {
    if (!data || !Array.isArray(data)) return [];
    return data
      .filter(item => item != null && item.value != null)
      .map(item => ({
        value: String(item.value),
        label: item.label ?? '-',
        code:  item.code  ?? '',
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
      setFetchError(null);
      try {
        // Load dropdowns
        const [countryRes, supplierTypeRes] = await Promise.all([
          api.get('/api/dropdown/country-list').catch(() => ({ data: { data: [] } })),
          api.get('/api/dropdown/supplier-type').catch(() => ({ data: { data: [] } })),
        ]);

        setCountryOptions(clean(countryRes.data.data));
        setSupplierTypeOptions(clean(supplierTypeRes.data.data));

        // Load supplier data in edit mode
        if (mode === 'update' && supplierId) {
          const res = await api.get(`/api/supplier/${supplierId}`);
          const d   = res.data.data ?? res.data;
          setForm({
            supplierId:          d.supplierId          ?? null,
            supplierName:        d.supplierName        ?? '',
            supplierCode:        d.supplierCode        ?? '',
            address:             d.address             ?? '',
           
            gstNo:           d.gstNo           ?? '',
           
            
            // In setForm inside load():
emailId:             d.eMailId             ?? '',   // ← eMailId not emailId
contactPersonName:   d.contactPerson       ?? '',   // ← contactPerson not contactPersonName
contactMobileNumber: d.contactMobile       ?? '',   // ← contactMobile not contactMobileNumber
countryId:           d.countryId           != null ? String(d.countryId)      : null,
supplierTypeId:      d.supplierTypeId      != null ? String(d.supplierTypeId) : null,

panNo:               d.panNo               ?? '',
itNo:                d.iTNo                ?? '',   // ← iTNo not itNo
          });
        }
      } catch {
        setFetchError('Failed to load supplier. Please close and try again.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [opened]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helpers ───────────────────────────────────────────────────────────────

  const setStr = (field: keyof SupplierMasterFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (field === 'gstNo') value = value.toUpperCase();
      setForm(prev => ({ ...prev, [field]: value }));
      if (validationErrors.length > 0) setValidationErrors([]);
    };

  const setSelect = (field: keyof SupplierMasterFormData) =>
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
  const headerTitle  = mode === 'update' && form.supplierId
    ? `Edit Supplier — ${form.supplierName || `#${supplierId}`}`
    : 'New Supplier';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={null}
        size="70%"
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
            icon={<IconTruckDelivery size={18} color="white" />}
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
                <Text size="sm" c="dimmed">Loading supplier...</Text>
              </Stack>
            </Center>
          ) : (
            <Box style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }} p="lg">

              {fetchError && <Text size="xs" c="red" mb="sm">{fetchError}</Text>}

              {/* ── Section 1: Supplier Information ── */}
              <Paper withBorder p="md" radius="sm" mb="md"
                style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>

                <Text fw={600} size="sm" mb="md">Supplier Information</Text>

                <Grid columns={12} gutter="sm">

                  {/* Row 1: Supplier ID | Supplier Code | Supplier Name */}
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Supplier ID"
                      value={form.supplierId != null ? String(form.supplierId) : ''}
                      onChange={() => {}}
                      placeholder="Auto-generated"
                      readOnly
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="* Supplier Code"
                      value={form.supplierCode}
                      onChange={setStr('supplierCode')}
                      placeholder="Supplier Code"
                      
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="* Supplier Name"
                      value={form.supplierName}
                      onChange={setStr('supplierName')}
                      placeholder="Supplier Name"
                      required
                    />
                  </Grid.Col>

                  {/* Row 2: Address */}
                  <Grid.Col span={12}>
                    <Textarea
                      label="* Address"
                      value={form.address}
                      onChange={e => {
                        setForm(prev => ({ ...prev, address: e.target.value }));
                        if (validationErrors.length > 0) setValidationErrors([]);
                      }}
                      placeholder="Enter supplier address"
                      minRows={2}
                      maxLength={250}
                      autosize
                      required
                    />
                    <Text size="xs" c="dimmed" ta="right" mt={2}>
                      {form.address.length} / 250
                    </Text>
                  </Grid.Col>

                  {/* Row 3: Country | Supplier Type */}
                  <Grid.Col span={6}>
                    <FormSelect
                      label="* Country"
                      value={form.countryId}
                      onChange={setSelect('countryId')}
                      data={countryOptions}
                      placeholder="--SELECT--"
                      searchable
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <FormSelect
                      label="Supplier Type"
                      value={form.supplierTypeId}
                      onChange={setSelect('supplierTypeId')}
                      data={supplierTypeOptions}
                      placeholder="--SELECT--"
                      searchable
                    />
                  </Grid.Col>

                  {/* Row 4: Email | Contact Person | Contact Mobile */}
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Email ID"
                      value={form.emailId}
                      onChange={setStr('emailId')}
                      placeholder="Email Address"
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Contact Person"
                      value={form.contactPersonName}
                      onChange={setStr('contactPersonName')}
                      placeholder="Contact Person Name"
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Contact Mobile"
                      value={form.contactMobileNumber}
                      onChange={setStr('contactMobileNumber')}
                      placeholder="Contact Mobile Number"
                    />
                  </Grid.Col>

                </Grid>
              </Paper>

              {/* ── Section 2: Registration Details ── */}
              <Paper withBorder p="md" radius="sm"
                style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>

                <Text fw={600} size="sm" mb="md">Registration Details</Text>

                <Grid columns={12} gutter="sm">

                  {/* Row 1: GST | PAN | IT No */}
                  <Grid.Col span={6}>
                    <FormTextInput
                      label="GST Number"
                      value={form.gstNo}
                      onChange={setStr('gstNo')}
                      placeholder="e.g. 33ABCDE1234F1Z5"
                      maxLength={15}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <FormTextInput
                      label="PAN No"
                      value={form.panNo}
                      onChange={setStr('panNo')}
                      placeholder="e.g. ABCDE1234F"
                      maxLength={10}
                    />
                  </Grid.Col>
                  

                </Grid>
              </Paper>

            </Box>
          )}
          {/* -- error Panel -- */}

          {validationErrors.length > 0 && (
            <Box px="lg" pt="sm"
              style={{
                borderTop: '1px solid var(--mantine-color-red-3)',
                backgroundColor: 'var(--mantine-color-red-0)',
                flexShrink: 0,
              }}>
              <Alert
                color="red"
                variant="light"
                title={`${validationErrors.length} error${validationErrors.length > 1 ? 's' : ''} — please fix before saving`}
                py="xs"
              >
                <List size="xs" spacing={2}>
                  {validationErrors.map((err, i) => (
                    <List.Item key={i}>{err}</List.Item>
                  ))}
                </List>
              </Alert>
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
          onSave?.({ ...form, gstNo: form.gstNo.trim().toUpperCase() });
          setConfirmOpen(false);
          onClose();
        }}
        message={`Are you sure you want to ${confirmLabel.toLowerCase()} this Supplier?`}
        confirmLabel={confirmLabel}
        errors={validationErrors}
        zIndex={250}
      />
    </>
  );
};

export default SupplierMasterForm;