/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Modal, Paper, Box, Text, Group, Button,
  Grid, Stack, Loader, Center, Table,
  ActionIcon, Badge, Alert, List, Textarea,
} from '@mantine/core';
import { IconFlask, IconPlus, IconTrash } from '@tabler/icons-react';
import { FormTextInput } from '../../../components/common/FormTextInput';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import FormHeader        from '../../common/Formheader';
import api from '../../../services/api';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LabTestParameter {
  rowId:         string;   // local React key
  paramId?:      number | null;
  specification: string;
  method:        string;
  limits:        string;
}

export interface LabTestMasterFormData {
  id?:        number | null;
  testCode:   string;
  testName:   string;
  parameters: LabTestParameter[];
}

export interface LabTestMasterFormProps {
  opened:    boolean;
  onClose:   () => void;
  onSave?:   (data: LabTestMasterFormData) => void;
  testId?:   number | null;
  mode?:     'create' | 'update';
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const defaultForm: LabTestMasterFormData = {
  id:         null,
  testCode:   '',
  testName:   '',
  parameters: [],
};

const newRow = (): LabTestParameter => ({
  rowId:         crypto.randomUUID(),
  paramId:       null,
  specification: '',
  method:        '',
  limits:        '',
});

// ── Validation ────────────────────────────────────────────────────────────────

const validateForm = (form: LabTestMasterFormData): string[] => {
  const errors: string[] = [];

  if (!form.testCode.trim())
    errors.push('Test Code is required');

  if (!form.testName.trim())
    errors.push('Test Name is required');

  for (const row of form.parameters) {
    if (!row.specification.trim())
      errors.push('All parameter rows must have a Specification');
  }

  return errors;
};

// ── Component ─────────────────────────────────────────────────────────────────

const LabTestMasterForm: React.FC<LabTestMasterFormProps> = ({
  opened,
  onClose,
  onSave,
  testId = null,
  mode   = 'create',
}) => {

  const [form,        setForm]        = useState<LabTestMasterFormData>({ ...defaultForm });
  const [loading,     setLoading]     = useState(false);
  const [fetchError,  setFetchError]  = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // ── Load ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!opened) {
      setForm({ ...defaultForm });
      setFetchError(null);
      setValidationErrors([]);
      return;
    }

    if (mode === 'update' && testId) {
      const load = async () => {
        setLoading(true);
        setFetchError(null);
        try {
          const res = await api.get(`/api/inventory/test-master/${testId}`);
          const d   = res.data.data ?? res.data;

          const parameters: LabTestParameter[] = (d.parameters ?? []).map((p: any) => ({
            rowId:         crypto.randomUUID(),
            paramId:       p.paramId       ?? null,
            specification: p.specification ?? '',
            method:        p.method        ?? '',
            limits:        p.limits        ?? '',
          }));

          setForm({
            id:         d.testId   ?? null,
            testCode:   d.testCode ?? '',
            testName:   d.testName ?? '',
            parameters,
          });
        } catch {
          setFetchError('Failed to load test master. Please close and try again.');
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [opened]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Form helpers ──────────────────────────────────────────────────────────

  const setStr = (field: keyof LabTestMasterFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      if (validationErrors.length > 0) setValidationErrors([]);
    };

  // ── Parameter row helpers ─────────────────────────────────────────────────

  const addRow = () =>
    setForm(prev => ({ ...prev, parameters: [...prev.parameters, newRow()] }));

  const removeRow = (rowId: string) =>
    setForm(prev => ({
      ...prev,
      parameters: prev.parameters.filter(r => r.rowId !== rowId),
    }));

  const updateRow = (
    rowId: string,
    field: keyof LabTestParameter,
    value: string,
  ) =>
    setForm(prev => ({
      ...prev,
      parameters: prev.parameters.map(r =>
        r.rowId === rowId ? { ...r, [field]: value } : r
      ),
    }));

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmitClick = () => {
    const errors = validateForm(form);
    setValidationErrors(errors);
    if (errors.length === 0) setConfirmOpen(true);
  };

  const confirmLabel = mode === 'update' ? 'Update' : 'Submit';
  const headerTitle  = mode === 'update' && form.id
    ? `Edit Lab Test — ${form.testName || `#${testId}`}`
    : 'New Lab Test Master';

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
            icon={<IconFlask size={18} color="white" />}
            color="#3d6b4f"
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

              {fetchError && (
                <Alert color="red" mb="sm">{fetchError}</Alert>
              )}

              {/* ── Section 1: Header fields ── */}
              <Paper withBorder p="md" radius="sm" mb="md"
                style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>

                <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb="sm">
                  Lab Test Details
                </Text>

                <Grid columns={12} gutter="sm">
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="* Test Code"
                      value={form.testCode}
                      onChange={setStr('testCode')}
                      placeholder="e.g. 741"
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={8}>
                    <FormTextInput
                      label="* Test Name"
                      value={form.testName}
                      onChange={setStr('testName')}
                      placeholder="e.g. 1295 DM.."
                      required
                    />
                  </Grid.Col>
                </Grid>

              </Paper>

              {/* ── Section 2: Parameter sub-table ── */}
              <Paper withBorder p="md" radius="sm"
                style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>

                <Group justify="space-between" mb="sm">
                  <Group gap="sm">
                    <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                      Lab Test Parameters
                    </Text>
                    {form.parameters.length > 0 && (
                      <Badge size="xs" variant="light" color="teal">
                        {form.parameters.length} row{form.parameters.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </Group>
                  <Button
                    size="xs"
                    variant="light"
                    leftSection={<IconPlus size={12} />}
                    onClick={addRow}
                  >
                    Add Row
                  </Button>
                </Group>

                {form.parameters.length === 0 ? (
                  <Box py="xl"
                    style={{
                      textAlign: 'center',
                      border: '1.5px dashed var(--mantine-color-gray-3)',
                      borderRadius: 8,
                    }}>
                    <Text size="sm" c="dimmed">No parameters added yet</Text>
                    <Button
                      size="xs" variant="subtle" mt="xs"
                      leftSection={<IconPlus size={12} />}
                      onClick={addRow}
                    >
                      Add first row
                    </Button>
                  </Box>
                ) : (
                  <Table highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th style={{ width: '30%' }}>Specification</Table.Th>
                        <Table.Th style={{ width: '30%' }}>Method</Table.Th>
                        <Table.Th style={{ width: '32%' }}>Limits</Table.Th>
                        <Table.Th style={{ width: '8%'  }}></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {form.parameters.map(row => (
                        <Table.Tr key={row.rowId}>

                          {/* Specification */}
                          <Table.Td>
                            <Textarea
                              value={row.specification}
                              onChange={e => updateRow(row.rowId, 'specification', e.target.value)}
                              placeholder="e.g. Appearance"
                              size="xs"
                              minRows={1}
                              autosize
                            />
                          </Table.Td>

                          {/* Method */}
                          <Table.Td>
                            <Textarea
                              value={row.method}
                              onChange={e => updateRow(row.rowId, 'method', e.target.value)}
                              placeholder="e.g. Visual"
                              size="xs"
                              minRows={1}
                              autosize
                            />
                          </Table.Td>

                          {/* Limits */}
                          <Table.Td>
                            <Textarea
                              value={row.limits}
                              onChange={e => updateRow(row.rowId, 'limits', e.target.value)}
                              placeholder="e.g. 7 - 9"
                              size="xs"
                              minRows={1}
                              autosize
                            />
                          </Table.Td>

                          {/* Delete */}
                          <Table.Td>
                            <ActionIcon
                              size="sm" color="red" variant="subtle"
                              onClick={() => removeRow(row.rowId)}
                            >
                              <IconTrash size={14} />
                            </ActionIcon>
                          </Table.Td>

                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                )}

                {form.parameters.length > 0 && (
                  <Text size="xs" c="dimmed" mt="xs">
                    {form.parameters.length} parameter{form.parameters.length !== 1 ? 's' : ''} — {form.parameters.length} - {form.parameters.length}
                  </Text>
                )}

              </Paper>

            </Box>
          )}

          {/* ── Validation errors ── */}
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
          onSave?.({ ...form });
          setConfirmOpen(false);
          onClose();
        }}
        message={`Are you sure you want to ${confirmLabel.toLowerCase()} this Lab Test?`}
        confirmLabel={confirmLabel}
        errors={validationErrors}
        zIndex={250}
      />
    </>
  );
};

export default LabTestMasterForm;
