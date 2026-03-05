import React, { useEffect, useState, useCallback } from 'react';
import {
  Title, Text, Box, Paper, Table, ScrollArea,
  Badge, Loader, Alert, Group, TextInput, Button,
  Checkbox, Tooltip, Divider, Pagination,
} from '@mantine/core';
import {
  IconAlertCircle, IconSearch, IconPlus, IconEdit,
  IconTrash, IconRefresh, IconDownload,
} from '@tabler/icons-react';
import api from '../../services/api';

interface RawMaterial {
  id: number;
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

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchRawMaterials = useCallback(async (currentPage: number, currentKeyword: string) => {
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
    fetchRawMaterials(page, keyword);
  }, [page, keyword, fetchRawMaterials]);

  // Debounce search 400ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── Selection ─────────────────────────────────────────────────────────────
  const allIds       = data.map((item) => item.id);
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

  const selectedCount = selected.length;
  const startRecord   = totalElements === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endRecord     = Math.min(page * PAGE_SIZE, totalElements);

  // ── Rows ──────────────────────────────────────────────────────────────────
  const rows = data.map((item) => {
    const isSelected = selected.includes(item.id);
    return (
      <Table.Tr key={item.id} bg={isSelected ? 'var(--mantine-color-blue-0)' : undefined}>
        <Table.Td>
          <Checkbox checked={isSelected} onChange={() => toggleRow(item.id)} size="sm" />
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
            : <Text c="dimmed" size="sm" ta="right">—</Text>
          }
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Box p="md" style={{ width: '100%', overflowX: 'auto' }}>
      {/* Page heading */}
      <Box mb="md">
        <Title order={3}>Raw Material Master</Title>
        <Text c="dimmed" size="sm">Manage Raw Material Master records</Text>
      </Box>

      {/* Error */}
      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">{error}</Alert>
      )}

      {loading && !data.length ? (
        <Paper withBorder p="xl" ta="center">
          <Loader size="md" />
          <Text c="dimmed" size="sm" mt="sm">Loading raw materials...</Text>
        </Paper>
      ) : (
        <Paper withBorder>

          {/* ── Toolbar ── */}
          <Box px="md" py="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
            <Group justify="space-between" wrap="wrap" gap="sm">
              <Group gap="xs">
                <Tooltip label="Add new record">
                  <Button size="xs" leftSection={<IconPlus size={14} />} onClick={() => console.log('Add')}>
                    Add
                  </Button>
                </Tooltip>
                <Tooltip label={selectedCount === 1 ? 'Edit selected record' : 'Select exactly one record to edit'}>
                  <Button
                    size="xs" variant="light" color="yellow"
                    leftSection={<IconEdit size={14} />}
                    disabled={selectedCount !== 1}
                    onClick={() => console.log('Edit', selected)}
                  >
                    Edit
                  </Button>
                </Tooltip>
                <Tooltip label={selectedCount > 0 ? `Delete ${selectedCount} record(s)` : 'Select records to delete'}>
                  <Button
                    size="xs" variant="light" color="red"
                    leftSection={<IconTrash size={14} />}
                    disabled={selectedCount === 0}
                    onClick={() => console.log('Delete', selected)}
                  >
                    Delete{selectedCount > 0 ? ` (${selectedCount})` : ''}
                  </Button>
                </Tooltip>
                <Divider orientation="vertical" />
                <Tooltip label="Refresh data">
                  <Button
                    size="xs" variant="subtle" color="gray"
                    leftSection={<IconRefresh size={14} />}
                    onClick={() => fetchRawMaterials(page, keyword)}
                  >
                    Refresh
                  </Button>
                </Tooltip>
                <Tooltip label="Export to CSV">
                  <Button
                    size="xs" variant="subtle" color="green"
                    leftSection={<IconDownload size={14} />}
                    onClick={() => console.log('Export')}
                  >
                    Export
                  </Button>
                </Tooltip>
              </Group>

              <Group gap="sm">
                {selectedCount > 0 && <Text size="xs" c="dimmed">{selectedCount} selected</Text>}
                <TextInput
                  placeholder="Search by name, code or group..."
                  leftSection={<IconSearch size={15} />}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.currentTarget.value)}
                  size="xs"
                  w={260}
                />
              </Group>
            </Group>
          </Box>

          {/* ── Table ── */}
          {loading ? (
            <Box p="xl" ta="center">
              <Loader size="sm" />
            </Box>
          ) : (
            <ScrollArea>
              <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th w={40}>
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={toggleSelectAll}
                        size="sm"
                      />
                    </Table.Th>
                    <Table.Th>RM Code</Table.Th>
                    <Table.Th>RM Name</Table.Th>
                    <Table.Th>UOM</Table.Th>
                    <Table.Th>Group</Table.Th>
                    <Table.Th>Test Name</Table.Th>
                    <Table.Th ta="right">Avg Rate</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.length > 0 ? rows : (
                    <Table.Tr>
                      <Table.Td colSpan={7} ta="center">
                        <Text c="dimmed" size="sm" py="md">No records found</Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          )}

          {/* ── Footer: record count + pagination ── */}
          <Box px="md" py="sm" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
            <Group justify="space-between" wrap="wrap" gap="sm">
              <Text size="xs" c="dimmed">
                {totalElements === 0
                  ? 'No records'
                  : `Showing ${startRecord}–${endRecord} of ${totalElements} records`}
                {selectedCount > 0 && (
                  <Text span c="blue"> · {selectedCount} selected</Text>
                )}
              </Text>
              <Group gap="sm">
                <Text size="xs" c="dimmed">Page {page} of {totalPages}</Text>
                <Pagination
                  value={page}
                  onChange={(val) => { setPage(val); setSelected([]); }}
                  total={totalPages}
                  size="sm"
                  siblings={1}
                  boundaries={1}
                  disabled={loading}
                />
              </Group>
            </Group>
          </Box>

        </Paper>
      )}
    </Box>
  );
};

export default RawMaterialPage;
