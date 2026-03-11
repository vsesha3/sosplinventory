import React, { useEffect, useState, useCallback } from 'react';
import { Title, Text, Box, Alert, Loader, Paper, Badge } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import api from '../../services/api';
import MasterCardGrid from '../../components/common/MasterCardGrid';
import type { CardFieldDef } from '../../components/common/MasterCardGrid';
import type { PagedApiResponse } from '../../types/api.types';

interface CapitalGoods {
  cgId: number;
  cgCode: string;
  cgName: string;
  uomId: number;
  uomName: string;
  avgRate: number | null;
  isActive: boolean | null;
}

const PAGE_SIZE = 10;

// First field is used as the card header/title
const FIELDS: CardFieldDef[] = [
  { key: 'cgName',   label: 'CG Name' },
  { key: 'cgCode',   label: 'CG Code' },
  { key: 'uomName',  label: 'UOM' },
  {
    key: 'avgRate',
    label: 'Avg Rate',
    render: (v) => v != null
      ? <Text size="sm">{Number(v).toFixed(2)}</Text>
      : <Text size="sm" c="dimmed">—</Text>,
  },
  {
    key: 'isActive',
    label: 'Status',
    render: (v) => (
      <Badge variant="light" color={v ? 'green' : 'red'} size="sm">
        {v ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
];

const CapitalGoodsPage: React.FC = () => {
  const [data, setData]                   = useState<CapitalGoods[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [searchInput, setSearchInput]     = useState('');
  const [keyword, setKeyword]             = useState('');
  const [selected, setSelected]           = useState<number[]>([]);
  const [page, setPage]                   = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async (currentPage: number, currentKeyword: string) => {
    try {
      setLoading(true);
      setError(null);
      setSelected([]);

      const params = { page: currentPage - 1, size: PAGE_SIZE };
      const url = currentKeyword.trim() ? '/api/capitalgoods/search' : '/api/capitalgoods';
      const response = await api.get<PagedApiResponse<CapitalGoods>>(url, {
        params: currentKeyword.trim() ? { ...params, keyword: currentKeyword.trim() } : params,
      });

      const pageData = response.data.data;
      setData(pageData.content);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
    } catch (err: unknown) {
      setError((err as any)?.response?.data?.message || 'Failed to fetch capital goods.');
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
  const allIds       = data.map((item) => item.cgId);
  const allSelected  = allIds.length > 0 && allIds.every((id) => selected.includes(id));
  const someSelected = allIds.some((id) => selected.includes(id)) && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...allIds])]);
    }
  };

  const toggleSelect = (id: number | string) => {
    const numId = Number(id);
    setSelected((prev) =>
      prev.includes(numId) ? prev.filter((s) => s !== numId) : [...prev, numId]
    );
  };

  return (
    <Box p="md" style={{ width: '100%' }}>
      <Box mb="md">
        <Title order={3}>Capital Goods Master</Title>
        <Text c="dimmed" size="sm">Manage Capital Goods Master records</Text>
      </Box>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">{error}</Alert>
      )}

      {loading && !data.length ? (
        <Paper withBorder p="xl" ta="center">
          <Loader size="md" />
          <Text c="dimmed" size="sm" mt="sm">Loading capital goods...</Text>
        </Paper>
      ) : (
        <MasterCardGrid
          fields={FIELDS}
          items={data}
          idKey="cgId"
          columns={2}               // ← change to 3 or 4 for more cards per row
          totalElements={totalElements}
          loading={loading}
          page={page}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          onPageChange={(val) => { setPage(val); setSelected([]); }}
          searchValue={searchInput}
          onSearchChange={(val) => setSearchInput(val)}
          searchPlaceholder="Search by name or code..."
          selected={selected}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          allSelected={allSelected}
          someSelected={someSelected}
          onAdd={() => console.log('Add')}
          onEdit={() => console.log('Edit', selected)}
          onDelete={() => console.log('Delete', selected)}
          onRefresh={() => fetchData(page, keyword)}
          onExport={() => console.log('Export')}
        />
      )}
    </Box>
  );
};

export default CapitalGoodsPage;
