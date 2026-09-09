import React, { useEffect, useState, useCallback } from 'react';
import { Title, Text, Box, Alert, Loader, Paper, Badge } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { Table, Checkbox } from '@mantine/core';
import api from '../../services/api';
import MasterTable  from '../../components/common/MasterTable';
import type { ColumnDef } from '../../components/common/MasterTable';
import RawMaterialForm from './Forms/RawMaterialForm';
import type {RawMaterialFormData} from './Forms/RawMaterialForm';
import SaveStatusBanner from '../../pages/common/Savestatusbanner';
import type {SaveStatus}  from '../../pages/common/Savestatusbanner';


interface RawMaterial {
  rmId: number;
  rmCode: number;
  rmName: string;
  uomName: string;
  rmGroupName: string;
  testName: string | null;
  avgRate: number | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    content: RawMaterial[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
}

const PAGE_SIZE = 10;

// ── Column definitions ────────────────────────────────────────────────────────
const COLUMNS: ColumnDef[] = [
  { key: 'rmCode',      label: 'RM Code' },
  { key: 'rmName',      label: 'RM Name' },
  { key: 'uomName',     label: 'UOM' },
  { key: 'rmGroupName', label: 'Group' },
  { key: 'testName',    label: 'Test Name' },
  { key: 'avgRate',     label: 'Avg Rate', align: 'right' },
];

const RawMaterialPage: React.FC = () => {
  const [data, setData]                   = useState<RawMaterial[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [searchInput, setSearchInput]     = useState('');
  const [keyword, setKeyword]             = useState('');
  const [selected, setSelected]           = useState<number[]>([]);
  const [page, setPage]                   = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [formOpen, setFormOpen]       = useState(false);
  const [editRmId, setEditRmId]       = useState<number | null>(null);
  const [formMode, setFormMode]       = useState<'create' | 'update'>('create');
  const [saveStatus, setSaveStatus]   = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async (currentPage: number, currentKeyword: string) => {
    try {
      setLoading(true);
      setError(null);
      setSelected([]);

      const params = { page: currentPage - 1, size: PAGE_SIZE, sortBy: 'rmId', sortDir: 'asc' };
      const url = currentKeyword.trim() ? '/api/rm/search' : '/api/rm';
      const response = await api.get<ApiResponse>(url, {
        params: currentKeyword.trim() ? { ...params, keyword: currentKeyword.trim() } : params,
      });

      const pageData = response.data.data;
      setData(pageData.content);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
    } catch (err: unknown) {
      setError((err as any)?.response?.data?.message || 'Failed to fetch raw materials.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page, keyword);
  }, [page, keyword, fetchData]);

  // Debounce search 400ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── Selection ─────────────────────────────────────────────────────────────
  const allIds       = data.map((item) => item.rmId);
  const allSelected  = allIds.length > 0 && allIds.every((id) => selected.includes(id));
  const someSelected = allIds.some((id) => selected.includes(id)) && !allSelected;

 const toggleSelectAll = () => {
  if (allSelected) {
    setSelected(prev => prev.filter(id => !allIds.includes(id)));
  } else {
    setSelected(prev => [...new Set([...prev, ...allIds])]);  // ← selects everything
  }
};

  const toggleRow = (id: number) => {
    
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async (data: RawMaterialFormData) => {
    setSaveStatus('saving');
    try {
      const payload = {
        rmName:             data.rmName,
        sapCode:            data.sapCode       || null,
        uomId:              data.uomId         ? Number(data.uomId)      : null,
        rmGroupId:          data.rmGroupId     ? Number(data.rmGroupId)  : null,
        hNhId:              data.hNhId         ? Number(data.hNhId)      : null,
         gstRate:   data.gstRate     ? Number(data.gstRate)   : null,
        avgRate:            data.avgRate       ? Number(data.avgRate)      : null,
        packUomId:          data.packUomId     ? Number(data.packUomId)    : null,
        packSize:           data.packSize      ? Number(data.packSize)     : null,
        capacity:           data.capacity      ? Number(data.capacity)     : null,
        testId:             data.testId        ? Number(data.testId)       : null,
        testCode:           data.testCode      || null,
      };
      if (formMode === 'update' && data.id) {
        await api.put(`/api/rm/${data.id}`, payload);
      } else {
        await api.post('/api/rm', payload);
      }
      setSaveStatus('success');
      setSaveMessage(formMode === 'update' ? 'Raw Material updated!' : 'Raw Material created!');
      setFormOpen(false);
      setEditRmId(null);
      setFormMode('create');
      fetchData(page, keyword);
    } catch (err: any) {
      setSaveStatus('error');
      setSaveMessage(err?.response?.data?.message || 'Failed to save Raw Material.');
    }
  };

  // ── Rows ──────────────────────────────────────────────────────────────────
  const rows = data.map((item) => {
  const isSelected = selected.includes(item.rmId);
  
  return (
    <Table.Tr key={item.rmId} bg={isSelected ? 'var(--mantine-color-blue-0)' : undefined}>
      <Table.Td>
        <Checkbox
          checked={isSelected}
          onChange={() => toggleRow(item.rmId)}
          size="sm"
        />
      </Table.Td>
      <Table.Td>{item.rmCode}</Table.Td>
      <Table.Td fw={500}>{item.rmName}</Table.Td>
      <Table.Td>
        <Badge variant="light" color="blue" size="sm">{item.uomName}</Badge>
      </Table.Td>
      <Table.Td>{item.rmGroupName}</Table.Td>
      <Table.Td>{item.testName ?? <Text c="dimmed" size="sm">—</Text>}</Table.Td>
      <Table.Td ta="right">
        {item.avgRate != null
          ? <Text size="sm" ta="right">{Number(item.avgRate).toFixed(2)}</Text>
          : <Text c="dimmed" size="sm" ta="right">—</Text>}
      </Table.Td>
    </Table.Tr>
  );
});

  return (
    <Box p="md" style={{ width: '100%', overflowX: 'auto' }}>
      <Box mb="md">
        <Title order={3}>Raw Material Master</Title>
        <Text c="dimmed" size="sm">Manage Raw Material Master records</Text>
      </Box>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">{error}</Alert>
      )}

      {loading && !data.length ? (
        <Paper withBorder p="xl" ta="center">
          <Loader size="md" />
          <Text c="dimmed" size="sm" mt="sm">Loading raw materials...</Text>
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
          onSearchChange={(val) => { setSearchInput(val); }}
          searchPlaceholder="Search by name, code or group..."
          allSelected={allSelected}
          someSelected={someSelected}
          onToggleSelectAll={toggleSelectAll}
          selectedCount={selected.length}
          onAdd={() => {
            setEditRmId(null);
            setFormMode('create');
            setFormOpen(true);
          }}
          onEdit={() => {
            if (selected.length === 1) {
              setEditRmId(selected[0]);
              setFormMode('update');
              setFormOpen(true);
            }
          }}
          onDelete={() => console.log('Delete', selected)}
          onRefresh={() => fetchData(page, keyword)}
          onExport={() => console.log('Export')}
        />
      )}
      <RawMaterialForm
        opened={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditRmId(null);
          setFormMode('create');
        }}
        onSave={handleSave}
        rmId={editRmId}
        mode={formMode}
      />

      <SaveStatusBanner
        status={saveStatus}
        successMessage={saveMessage}
        errorMessage={saveMessage}
        onDismiss={() => setSaveStatus('idle')}
      />

    </Box>
  );
};

export default RawMaterialPage;