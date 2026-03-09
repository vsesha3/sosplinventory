import React, { useEffect, useState, useCallback } from 'react';
import { Title, Text, Box, Alert, Loader, Paper, Badge } from '@mantine/core';
import { Table, Checkbox } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import api from '../../services/api';
import MasterTable from '../../components/common/MasterTable';
import type { ColumnDef } from '../../components/common/MasterTable';
import type { PagedApiResponse } from '../../types/api.types';

interface Product {
  productId: number;       // ← was id
  productCode: number;
  productName: string;
  uomName: string;
  productGroupId: number;  // ← was productGroupName (string)
  testName: string | null;
  rate: number | null;     // ← was avgRate
}


const PAGE_SIZE = 10;

const COLUMNS: ColumnDef[] = [
  { key: 'productCode',      label: 'Product Code' },
  { key: 'productName',      label: 'Product Name' },
  { key: 'uomName',          label: 'UOM' },
  { key: 'productGroupName', label: 'Group' },
  { key: 'testName',         label: 'Test Name' },
  { key: 'avgRate',          label: 'Avg Rate', align: 'right' },
];

const ProductPage: React.FC = () => {
  const [data, setData]                   = useState<Product[]>([]);
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

      const params = { page: currentPage - 1, size: PAGE_SIZE, sortBy: 'productId', sortDir: 'asc' };
      const url = currentKeyword.trim() ? '/api/product/search' : '/api/product';
      const response = await api.get<PagedApiResponse<Product>>(url, {
        params: currentKeyword.trim() ? { ...params, keyword: currentKeyword.trim() } : params,
      });

      const pageData = response.data.data;
      setData(pageData.content);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
    } catch (err: unknown) {
      setError((err as any)?.response?.data?.message || 'Failed to fetch products.');
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
  
  const allIds = data.map((item) => item.productId);
  const allSelected  = allIds.length > 0 && allIds.every((id) => selected.includes(id));
  const someSelected = allIds.some((id) => selected.includes(id)) && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...allIds])]);
    }
  };

 const toggleRow = (id: number) => {
  setSelected((prev) =>
    prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
  );
};


  // ── Rows ──────────────────────────────────────────────────────────────────
 const rows = data.map((item) => {
  const isSelected = selected.includes(item.productId);  // ← productId
  return (
    <Table.Tr key={item.productId} bg={isSelected ? 'var(--mantine-color-blue-0)' : undefined}>
      <Table.Td>
        <Checkbox checked={isSelected} onChange={() => toggleRow(item.productId)} size="sm" />
      </Table.Td>
      <Table.Td>{item.productCode}</Table.Td>
      <Table.Td fw={500}>{item.productName}</Table.Td>
      <Table.Td>
        <Badge variant="light" color="blue" size="sm">{item.uomName}</Badge>
      </Table.Td>
      <Table.Td>{item.productGroupId}</Table.Td>   {/* shows ID for now */}
      <Table.Td>{item.testName ?? <Text c="dimmed" size="sm">—</Text>}</Table.Td>
      <Table.Td ta="right">
        {item.rate != null
          ? <Text size="sm" ta="right">{Number(item.rate).toFixed(2)}</Text>
          : <Text c="dimmed" size="sm" ta="right">—</Text>
        }
      </Table.Td>
    </Table.Tr>
  );
});

  return (
    <Box p="md" style={{ width: '100%', overflowX: 'auto' }}>
      <Box mb="md">
        <Title order={3}>Product Master</Title>
        <Text c="dimmed" size="sm">Manage Product Master records</Text>
      </Box>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">{error}</Alert>
      )}

      {loading && !data.length ? (
        <Paper withBorder p="xl" ta="center">
          <Loader size="md" />
          <Text c="dimmed" size="sm" mt="sm">Loading products...</Text>
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
          onSearchChange={(val) => setSearchInput(val)}
          searchPlaceholder="Search by name, code or group..."
          allSelected={allSelected}
          someSelected={someSelected}
          onToggleSelectAll={toggleSelectAll}
          selectedCount={selected.length}
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

export default ProductPage;