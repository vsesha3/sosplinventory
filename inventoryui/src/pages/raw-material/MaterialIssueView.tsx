import React, { useEffect, useState, useCallback } from 'react';
import {
  Title, Text, Box, Alert, Loader, Paper, Badge, Table, Checkbox, Button, Tooltip,
} from '@mantine/core';
import { IconAlertCircle, IconEdit } from '@tabler/icons-react';
import MaterialRequestForm from './MaterialRequestForm';
import type { MaterialRequestFormData } from '../../types/MaterialRequest.types';
import { saveMaterialRequest } from './saveMaterialRequest';
import type { SaveStatus } from '../common/Savestatusbanner';
import SaveStatusBanner from '../common/Savestatusbanner';
import api from '../../services/api';
import MasterTable from '../../components/common/MasterTable';
import type { ColumnDef } from '../../components/common/MasterTable';
import type { MaterialIssueViewRow } from '../../types/materialIssue.types';
import { mapMaterialIssueViewRow } from '../../types/materialIssue.types';
import { PendingQtyCell } from './IssueQtySummary';

// ── Material Issue — list of material requests to issue against ──────────────
// Same list pattern as MaterialRequestView; Edit opens the same Material Request form
// (no Add here — requests are raised from the RM Request list).

const PAGE_SIZE = 15;

const COLUMNS: ColumnDef[] = [
  { key: 'rmReqId',             label: 'Request ID',        width: 100 },
  { key: 'rmReqDate',           label: 'Request Date',      width: 120 },
  { key: 'scheduleDate',        label: 'Schedule Date',     width: 120 },
  { key: 'productName',         label: 'Product Name',      width: 220 },
  { key: 'woCode',              label: 'WO Code',           width: 180 },
  { key: 'productionLotNumber', label: 'Production Lot No', width: 170 },
  { key: 'planToProdQty',       label: 'Plan To Prod Qty',  width: 140, align: 'right' },
  { key: 'pendingRm',           label: 'Pending RM',        width: 130, align: 'right' },
  { key: 'pendingPm',           label: 'Pending PM',        width: 130, align: 'right' },
  { key: 'requestedByName',     label: 'Requested By',      width: 150 },
  { key: 'ginNo',               label: 'GIN No',            width: 90,  align: 'right' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (val: string | null | undefined): string => {
  if (!val) return '—';
  const d = new Date(val);
  return isNaN(d.getTime()) ? val : d.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const dash = (v: string | number | null | undefined) =>
  v != null && v !== '' ? String(v) : '—';

// ── Component ─────────────────────────────────────────────────────────────────

const MaterialIssueView: React.FC = () => {

  const [data, setData]                   = useState<MaterialIssueViewRow[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [searchInput, setSearchInput]     = useState('');
  const [keyword, setKeyword]             = useState('');
  const [selected, setSelected]           = useState<number[]>([]);
  const [page, setPage]                   = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // ── Form (modal) + save banner ────────────────────────────────────────────
  const [formOpen, setFormOpen]       = useState(false);
  const [editingId, setEditingId]     = useState<number | null>(null);
  const [saveStatus, setSaveStatus]   = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async (currentPage: number, currentKeyword: string) => {
    try {
      setLoading(true);
      setError(null);
      setSelected([]);

      const params: Record<string, any> = {
        page: currentPage - 1,
        size: PAGE_SIZE,
        ...(currentKeyword.trim() ? { keyword: currentKeyword.trim() } : {}),
      };

      const res = await api.get('/api/inventory/rm-request/viewForIssue', { params });
      const d   = res.data.data;

      if (Array.isArray(d)) {
        setData(d.map(mapMaterialIssueViewRow));
        setTotalPages(1);
        setTotalElements(d.length);
      } else if (d?.content) {
        setData(d.content.map(mapMaterialIssueViewRow));
        setTotalPages(d.totalPages ?? 1);
        setTotalElements(d.totalElements ?? 0);
      } else {
        setData([]);
        setTotalPages(1);
        setTotalElements(0);
      }
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.message ||
        'Failed to fetch material requests for issue.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page, keyword);
  }, [page, keyword, fetchData]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => { setKeyword(searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── Selection ─────────────────────────────────────────────────────────────

  const allIds       = data.map(d => d.rmReqId);
  const allSelected  = allIds.length > 0 && allIds.every(id => selected.includes(id));
  const someSelected = allIds.some(id => selected.includes(id)) && !allSelected;

  const toggleAll = () =>
    allSelected
      ? setSelected(prev => prev.filter(id => !allIds.includes(id)))
      : setSelected(prev => [...new Set([...prev, ...allIds])]);

  const toggleRow = (id: number) =>
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  // ── Edit — same Material Request form, update mode ────────────────────────

  const handleEdit = () => {
    if (selected.length !== 1) return;
    setEditingId(selected[0]);   // form fetches the full record
    setFormOpen(true);
  };

  const handleSave = async (formData: MaterialRequestFormData) => {
    if (saveStatus === 'saving') return;   // ignore double submit
    setSaveStatus('saving');
    try {
      const result = await saveMaterialRequest(formData, 'update');
      setSaveStatus(result.status);
      setSaveMessage(result.message);
      setFormOpen(false);
      setSelected([]);
      await fetchData(page, keyword);
    } catch (err: unknown) {
      // Form stays open so the user can fix and retry
      setSaveStatus('error');
      setSaveMessage(
        (err as any)?.response?.data?.message ||
        'Failed to save Material Request.'
      );
    }
  };

  // ── Rows ──────────────────────────────────────────────────────────────────

  const rows = data.map(item => {
    const isSel = selected.includes(item.rmReqId);
    return (
      <Table.Tr key={item.rmReqId} bg={isSel ? 'var(--mantine-color-blue-0)' : undefined}>
        <Table.Td>
          <Checkbox checked={isSel} onChange={() => toggleRow(item.rmReqId)} size="sm" />
        </Table.Td>
        <Table.Td><Text size="xs" fw={500} c="blue">{item.rmReqId}</Text></Table.Td>
        <Table.Td><Text size="xs">{fmtDate(item.rmReqDate)}</Text></Table.Td>
        <Table.Td><Text size="xs">{fmtDate(item.scheduleDate)}</Text></Table.Td>
        <Table.Td><Text size="xs" fw={500}>{dash(item.productName)}</Text></Table.Td>
        <Table.Td><Text size="xs">{dash(item.woCode)}</Text></Table.Td>
        <Table.Td><Text size="xs" fw={500}>{dash(item.productionLotNumber)}</Text></Table.Td>
        <Table.Td ta="right">
          <Text size="xs" fw={500}>
            {item.planToProdQty != null
              ? `${item.planToProdQty.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, maximumFractionDigits: 2,
                })} Kgs`
              : '—'}
          </Text>
        </Table.Td>
        {/* Pending RM (Kgs) / Pending PM (packs) — from rmIssueQtySummary */}
        <Table.Td ta="right"><PendingQtyCell totals={item.issueSummary.rm} unit="Kgs" /></Table.Td>
        <Table.Td ta="right"><PendingQtyCell totals={item.issueSummary.pm} unit="Packs" /></Table.Td>
        {/* Name from the view; falls back to requestBy */}
        <Table.Td><Text size="xs">{dash(item.requestedByName ?? item.requestBy)}</Text></Table.Td>
        <Table.Td ta="right">
          {item.ginNo != null
            ? <Badge variant="light" color="teal" size="sm">{item.ginNo}</Badge>
            : <Text size="xs" c="dimmed">—</Text>}
        </Table.Td>
      </Table.Tr>
    );
  });

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box p="md" style={{ width: '100%', overflowX: 'auto' }}>

      <Box mb="md">
        <Title order={3}>Material Issue</Title>
        <Text c="dimmed" size="sm">Material requests to issue raw and packing materials against</Text>
      </Box>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
          {error}
        </Alert>
      )}

      {loading && !data.length ? (
        <Paper withBorder p="xl" ta="center">
          <Loader size="md" />
          <Text c="dimmed" size="sm" mt="sm">Loading material requests...</Text>
        </Paper>
      ) : (
        <MasterTable
          columns={COLUMNS}
          rows={rows}
          colSpan={COLUMNS.length + 1}
          totalElements={totalElements}
          loading={loading}
          page={page}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          onPageChange={(val) => { setPage(val); setSelected([]); }}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          searchPlaceholder="Search by WO code, product, lot no..."
          allSelected={allSelected}
          someSelected={someSelected}
          onToggleSelectAll={toggleAll}
          selectedCount={selected.length}
          onRefresh={() => fetchData(page, keyword)}
          // Edit only — no Add / Delete / Export on this screen
          showCrudActions={false}
          extraActions={
            <Tooltip label={selected.length === 1 ? 'Edit selected request' : 'Select exactly one request to edit'}>
              <Button
                size="xs" variant="light" color="yellow"
                leftSection={<IconEdit size={14} />}
                disabled={selected.length !== 1}
                onClick={handleEdit}
              >
                Edit
              </Button>
            </Tooltip>
          }
        />
      )}

      {/* ── Material Request Form (Edit) — same form as the RM Request list ── */}
      <MaterialRequestForm
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        mode="update"
        rmReqId={editingId}
        onSave={handleSave}
        saving={saveStatus === 'saving'}
      />

      <SaveStatusBanner
        status={saveStatus}
        savingMessage="Updating Material Request, please wait..."
        successMessage={saveMessage}
        errorMessage={saveMessage}
        onDismiss={() => setSaveStatus('idle')}
      />

    </Box>
  );
};

export default MaterialIssueView;
