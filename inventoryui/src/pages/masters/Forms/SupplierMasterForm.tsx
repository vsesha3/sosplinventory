import React, { useEffect, useState } from 'react';

import {
  Modal,
  Paper,
  Box,
  Text,
  Group,
  Button,
  Grid,
  Stack,
  Loader,
  Center,
  Textarea,
} from '@mantine/core';

import { IconTruckDelivery } from '@tabler/icons-react';

import { FormTextInput } from '../../../components/common/FormTextInput';
import { FormSelect } from '../../../components/common/FormSelect';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import FormHeader from '../../common/Formheader';


// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface DropDownOption {
  value: string;
  label: string;
  code?: string;
}


export interface SupplierMasterFormData {

  supplierId: number | null;

  supplierName: string;

  supplierCode: string;

  address: string;

  countryId: string | null;

  gstNumber: string;

  typeId: string | null;

  supplierTypeId: string | null;

  phoneNo: string;

  emailId: string;

  // Keep these if they already exist in your actual entity
  contactPersonName?: string;

  contactMobileNumber?: string;

  lstNo?: string;

  itNo?: string;

  cstNo?: string;
}


export interface SupplierMasterFormProps {

  opened: boolean;

  onClose: () => void;

  onSave?: (data: SupplierMasterFormData) => void;

  supplierId?: number | null;

  mode?: 'create' | 'update';

  countryOptions?: DropDownOption[];

  supplierTypeOptions?: DropDownOption[];

  typeOptions?: DropDownOption[];
}


// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const defaultForm: SupplierMasterFormData = {

  supplierId: null,

  supplierName: '',

  supplierCode: '',

  address: '',

  countryId: null,

  gstNumber: '',

  typeId: null,

  supplierTypeId: null,

  phoneNo: '',

  emailId: '',

  contactPersonName: '',

  contactMobileNumber: '',

  lstNo: '',

  itNo: '',

  cstNo: '',
};


// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

const validateForm = (
  form: SupplierMasterFormData
): string[] => {

  const errors: string[] = [];

  if (!form.supplierName.trim()) {
    errors.push('Supplier Name is required');
  }

  if (!form.supplierCode.trim()) {
    errors.push('Supplier Code is required');
  }

  if (!form.address.trim()) {
    errors.push('Address is required');
  }

  if (!form.countryId) {
    errors.push('Country is required');
  }

  /*
   * GST is currently optional.
   *
   * If you want GST to be mandatory, uncomment:
   *
   * if (!form.gstNumber.trim()) {
   *   errors.push('GST Number is required');
   * }
   */

  if (form.gstNumber.trim()) {

    const gst = form.gstNumber.trim().toUpperCase();

    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

    if (!gstRegex.test(gst)) {
      errors.push('GST Number is not valid');
    }
  }

  if (
    form.emailId.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailId.trim())
  ) {
    errors.push('Email ID is not valid');
  }

  return errors;
};


// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const SupplierMasterForm: React.FC<SupplierMasterFormProps> = ({

  opened,

  onClose,

  onSave,

  supplierId = null,

  mode = 'create',

 
  typeOptions = [],

}) => {

  const [form, setForm] =
    useState<SupplierMasterFormData>({ ...defaultForm });

  const [loading, setLoading] =
    useState(false);

  const [fetchError, setFetchError] =
    useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] =
    useState(false);

  const [validationErrors, setValidationErrors] =
    useState<string[]>([]);

    const [supplierTypeOptions,      setSupplierTypeOptions]      = useState<DropDownOption[]>([]);
    const [countryOptions,    setCountryOptions]    = useState<DropDownOption[]>([]);


  // ---------------------------------------------------------------------------
  // Load existing supplier
  // ---------------------------------------------------------------------------

  useEffect(() => {

    if (!opened) {

      setForm({ ...defaultForm });

      setFetchError(null);

      setValidationErrors([]);

      return;
    }


    const loadSupplier = async () => {

      if (mode !== 'update' || !supplierId) {

        setForm({ ...defaultForm });

        return;
      }


      setLoading(true);

      setFetchError(null);

      try {

        const response = await fetch(
          `/api/supplier/${supplierId}`
        );

        if (!response.ok) {
          throw new Error('Failed to load supplier');
        }

        const d = await response.json();


        setForm({

          supplierId:
            d.supplierId ?? null,

          supplierName:
            d.supplierName ?? '',

          supplierCode:
            d.supplierCode ?? '',

          address:
            d.address ?? '',

          countryId:
            d.countryId != null
              ? String(d.countryId)
              : null,

          gstNumber:
            d.gstNumber ?? '',

          typeId:
            d.typeId != null
              ? String(d.typeId)
              : null,

          supplierTypeId:
            d.supplierTypeId != null
              ? String(d.supplierTypeId)
              : null,

          phoneNo:
            d.phoneNo ?? '',

          emailId:
            d.emailId ?? '',

          contactPersonName:
            d.contactPersonName ?? '',

          contactMobileNumber:
            d.contactMobileNumber ?? '',

          lstNo:
            d.lstNo ?? '',

          itNo:
            d.itNo ?? '',

          cstNo:
            d.cstNo ?? '',
        });

      } catch (error) {

        console.error(error);

        setFetchError(
          'Failed to load supplier. Please close and try again.'
        );

      } finally {

        setLoading(false);
      }
    };


    loadSupplier();

  }, [opened, mode, supplierId]);


  // ---------------------------------------------------------------------------
  // Form helpers
  // ---------------------------------------------------------------------------

  const setStr =
    (field: keyof SupplierMasterFormData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {

        let value = e.target.value;

        // GST should always be uppercase
        if (field === 'gstNumber') {
          value = value.toUpperCase();
        }

        setForm(prev => ({
          ...prev,
          [field]: value,
        }));

        if (validationErrors.length > 0) {
          setValidationErrors([]);
        }
      };


  const setSelect =
    (field: keyof SupplierMasterFormData) =>
      (value: string | null) => {

        setForm(prev => ({
          ...prev,
          [field]: value,
        }));

        if (validationErrors.length > 0) {
          setValidationErrors([]);
        }
      };


  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleSubmitClick = () => {

    const errors = validateForm(form);

    setValidationErrors(errors);

    if (errors.length === 0) {
      setConfirmOpen(true);
    }
  };


  const confirmLabel =
    mode === 'update'
      ? 'Update'
      : 'Submit';


  const headerTitle =
    mode === 'update' && form.supplierId
      ? `Edit Supplier — ${form.supplierName || `#${form.supplierId}`}`
      : 'New Supplier';


  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

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

        <Paper
          withBorder
          radius="md"
          style={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh',
          }}
        >

          {/* --------------------------------------------------------------- */}
          {/* Header */}
          {/* --------------------------------------------------------------- */}

          <FormHeader

            title={headerTitle}

            icon={
              <IconTruckDelivery
                size={18}
                color="white"
              />
            }

            color="#4a6fa5"

            badge={
              mode === 'update'
                ? 'Edit Mode'
                : 'New'
            }

            badgeColor={
              mode === 'update'
                ? 'orange'
                : 'green'
            }

            onClose={onClose}
          />


          {/* --------------------------------------------------------------- */}
          {/* Body */}
          {/* --------------------------------------------------------------- */}

          {loading ? (

            <Center
              py={80}
              style={{ flex: 1 }}
            >

              <Stack
                align="center"
                gap="sm"
              >

                <Loader size="md" />

                <Text
                  size="sm"
                  c="dimmed"
                >
                  Loading supplier...
                </Text>

              </Stack>

            </Center>

          ) : (

            <Box
              style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
              p="lg"
            >

              {fetchError && (

                <Text
                  size="xs"
                  c="red"
                  mb="sm"
                >
                  {fetchError}
                </Text>

              )}


              {/* ========================================================= */}
              {/* Supplier Information */}
              {/* ========================================================= */}

              <Paper
                withBorder
                p="md"
                radius="sm"
                mb="md"
                style={{
                  backgroundColor:
                    'var(--mantine-color-gray-0)',
                }}
              >

                <Text
                  fw={600}
                  size="sm"
                  mb="md"
                >
                  Supplier Information
                </Text>


                <Grid
                  columns={12}
                  gutter="sm"
                >

                  {/* Supplier ID */}

                  <Grid.Col span={6}>

                    <FormTextInput

                      label="Supplier ID"

                      value={
                        form.supplierId != null
                          ? String(form.supplierId)
                          : ''
                      }

                      onChange={() => {}}

                      placeholder="Auto-generated"

                      readOnly
                    />

                  </Grid.Col>


                  {/* Supplier Code */}

                  <Grid.Col span={6}>

                    <FormTextInput

                      label="* Supplier Code"

                      value={form.supplierCode}

                      onChange={setStr('supplierCode')}

                      placeholder="Supplier Code"

                      required
                    />

                  </Grid.Col>


                  {/* Supplier Name */}

                  <Grid.Col span={12}>

                    <FormTextInput

                      label="* Supplier Name"

                      value={form.supplierName}

                      onChange={setStr('supplierName')}

                      placeholder="Supplier Name"

                      required
                    />

                  </Grid.Col>


                  {/* Address */}

                 <Grid.Col span={12}>
  <Textarea
    label="* Address"
    value={form.address}
    onChange={(e) => {
      setForm(prev => ({
        ...prev,
        address: e.target.value,
      }));

      if (validationErrors.length > 0) {
        setValidationErrors([]);
      }
    }}
    placeholder="Enter supplier address"
    minRows={4}
    maxLength={250}
    autosize
    required
  />

  <Text
    size="xs"
    c="dimmed"
    ta="right"
    mt={3}
  >
    {form.address.length} / 250
  </Text>
</Grid.Col>


                  {/* Country */}

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


                  {/* Supplier Type */}

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


                  {/* Phone */}

                  <Grid.Col span={6}>

                    <FormTextInput

                      label="Phone No"

                      value={form.phoneNo}

                      onChange={setStr('phoneNo')}

                      placeholder="Phone Number"
                    />

                  </Grid.Col>


                  {/* Email */}

                  <Grid.Col span={6}>

                    <FormTextInput

                      label="Email ID"

                      value={form.emailId}

                      onChange={setStr('emailId')}

                      placeholder="Email Address"
                    />

                  </Grid.Col>


                  {/* Type */}

                  <Grid.Col span={6}>

                    <FormSelect

                      label="Type"

                      value={form.typeId}

                      onChange={setSelect('typeId')}

                      data={typeOptions}

                      placeholder="--SELECT--"

                      searchable
                    />

                  </Grid.Col>


                  {/* Contact Person */}

                  <Grid.Col span={6}>

                    <FormTextInput

                      label="Contact Person Name"

                      value={
                        form.contactPersonName ?? ''
                      }

                      onChange={
                        setStr('contactPersonName')
                      }

                      placeholder="Contact Person Name"
                    />

                  </Grid.Col>


                  {/* Contact Mobile */}

                  <Grid.Col span={6}>

                    <FormTextInput

                      label="Contact Mobile Number"

                      value={
                        form.contactMobileNumber ?? ''
                      }

                      onChange={
                        setStr('contactMobileNumber')
                      }

                      placeholder="Contact Mobile Number"
                    />

                  </Grid.Col>

                </Grid>

              </Paper>


              {/* ========================================================= */}
              {/* Registration Details */}
              {/* ========================================================= */}

              <Paper

                withBorder

                p="md"

                radius="sm"

                style={{
                  backgroundColor:
                    'var(--mantine-color-gray-0)',
                }}
              >

                <Text
                  fw={600}
                  size="sm"
                  mb="md"
                >
                  Registration Details
                </Text>


                <Grid
                  columns={12}
                  gutter="sm"
                >

                  {/* GST */}

                  <Grid.Col span={6}>

                    <FormTextInput

                      label="GST Number"

                      value={form.gstNumber}

                      onChange={setStr('gstNumber')}

                      placeholder="GST Number"

                      maxLength={15}
                    />

                  </Grid.Col>


                  {/* LST */}

                  <Grid.Col span={6}>

                    <FormTextInput

                      label="L.S.T. No"

                      value={form.lstNo ?? ''}

                      onChange={setStr('lstNo')}

                      placeholder="L.S.T. Number"
                    />

                  </Grid.Col>


                  {/* IT */}

                  <Grid.Col span={6}>

                    <FormTextInput

                      label="I.T. No"

                      value={form.itNo ?? ''}

                      onChange={setStr('itNo')}

                      placeholder="I.T. Number"
                    />

                  </Grid.Col>


                  {/* CST */}

                  <Grid.Col span={6}>

                    <FormTextInput

                      label="C.S.T. No"

                      value={form.cstNo ?? ''}

                      onChange={setStr('cstNo')}

                      placeholder="C.S.T. Number"
                    />

                  </Grid.Col>

                </Grid>

              </Paper>

            </Box>
          )}


          {/* --------------------------------------------------------------- */}
          {/* Footer */}
          {/* --------------------------------------------------------------- */}

          <Box

            px="lg"

            py="sm"

            style={{
              borderTop:
                '1px solid var(--mantine-color-gray-3)',

              backgroundColor:
                'var(--mantine-color-body)',

              flexShrink: 0,
            }}
          >

            <Group
              justify="flex-end"
              gap="sm"
            >

              <Button
                variant="default"
                size="sm"
                onClick={onClose}
              >
                Cancel
              </Button>


              <Button
                size="sm"
                color="blue"
                onClick={handleSubmitClick}
              >
                {confirmLabel}
              </Button>

            </Group>

          </Box>

        </Paper>

      </Modal>


      {/* ----------------------------------------------------------------- */}
      {/* Confirmation */}
      {/* ----------------------------------------------------------------- */}

      <ConfirmDialog

        opened={confirmOpen}

        onClose={() => {
          setConfirmOpen(false);
          setValidationErrors([]);
        }}

        onConfirm={() => {

          onSave?.({
            ...form,
            gstNumber:
              form.gstNumber.trim().toUpperCase(),
          });

          setConfirmOpen(false);

          onClose();
        }}

        message={
          `Are you sure you want to ` +
          `${confirmLabel.toLowerCase()} this Supplier?`
        }

        confirmLabel={confirmLabel}

        errors={validationErrors}

        zIndex={250}
      />

    </>
  );
};


export default SupplierMasterForm;