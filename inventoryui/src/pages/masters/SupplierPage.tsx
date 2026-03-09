import React, { useEffect, useState, useCallback } from 'react';
import { Title, Text, Box, Alert, Loader, Paper, Badge } from '@mantine/core';
import { Table, Checkbox } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import api from '../../services/api';
import MasterTable from '../../components/common/MasterTable';
import type { ColumnDef } from '../../components/common/MasterTable';
import type { PagedApiResponse } from '../../types/api.types';

interface Supplier {
  supplierId: number;
  supplierCode: string;
  supplierName: string;
  address: string | null;
  countryName: string | null;
  phoneNo: string | null;
  eMailId: string | null;
  type: string | null;
  supplierTypeName: string | null;
  eCCNo: string | null;
  iTNo: string | null;
  rCNo: string | null;
  cSTNo: string | null;
  lSTNo: string | null;
  serTaxRegNo: string | null;
  serTaxCertificateNo: string | null;
  serTaxClassificationNo: string | null;
  rangeNo: string | null;
  rangeAddress: string | null;
  divisionNo: string | null;
  divisionAddress: string | null;
  commissionerate: string | null;
  cheqFavr: string | null;
  contactPerson: string | null;
  contactMobile: string | null;
  isActive: boolean | null;
  createdBy: string | null;
  lastUpdatedBy: string | null;
}

const PAGE_SIZE = 10;

// Columns match legacy screenshot order exactly
const COLUMNS: ColumnDef[] = [
  { key: 'supplierCode',    label: 'Supplier Code',      width: 110 },
  { key: 'supplierName',    label: 'Supplier Name',      width: 140 },
  { key: 'address',         label: 'Address',            width: 180, wrap: true, compact: true },
  { key: 'countryName',     label: 'Country Name',       width: 110 },
  { key: 'phoneNo',         label: 'Phone No',           width: 110 },
  { key: 'eMailId',         label: 'Email Id',           width: 150 },
  { key: 'type',            label: 'Type',               width: 70  },
  { key: 'supplierTypeName',label: 'Supplier Type Name', width: 140 },
  { key: 'eCCNo',           label: 'ECC No',             width: 90  },
  { key: 'iTNo',            label: 'IT No',              width: 90  },
  { key: 'rCNo',            label: 'RC No',              width: 90  },
  { key: 'cSTNo',           label: 'CST No',             width: 90  },
  { key: 'lSTNo',           label: 'LST No',             width: 90  },
];

const SupplierPage: React.FC = () => {
  const [data, setData]                   = useState<Supplier[]>([]);
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

      const params = { page: currentPage - 1, size: PAGE_SIZE, sortBy: 'supplierId', sortDir: 'asc' };
      const url = currentKeyword.trim() ? '/api/supplier-view/search' : '/api/supplier-view';
      const response = await api.get<PagedApiResponse<Supplier>>(url, {
        params: currentKeyword.trim() ? { ...params, keyword: currentKeyword.trim() } : params,
      });

      const pageData = response.data.data;
      setData(pageData.content);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
    } catch (err: unknown) {
      setError((err as any)?.response?.data?.message || 'Failed to fetch suppliers.');
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
  const allIds       = data.map((item) => item.supplierId);
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

  // Helper to show dash for null/empty values
  const val = (v: string | null | undefined) =>
    v ? <span>{v}</span> : <Text c="dimmed" size="sm">—</Text>;

  // ── Rows ──────────────────────────────────────────────────────────────────
  const rows = data.map((item) => {
    const isSelected = selected.includes(item.supplierId);
    return (
      <Table.Tr key={item.supplierId} bg={isSelected ? 'var(--mantine-color-blue-0)' : undefined}>
        <Table.Td>
          <Checkbox checked={isSelected} onChange={() => toggleRow(item.supplierId)} size="sm" />
        </Table.Td>
        <Table.Td>{item.supplierCode}</Table.Td>
        <Table.Td fw={500}>{item.supplierName}</Table.Td>

        {/* Address: wrap + compact font */}
        <Table.Td style={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 180 }}>
          {item.address
            ? item.address.split(/[\n,]/).map((line, i) => (
                <Text key={i} size="xs" style={{ lineHeight: 1.4 }}>{line.trim()}</Text>
              ))
            : <Text c="dimmed" size="xs">—</Text>
          }
        </Table.Td>

        <Table.Td>{val(item.countryName)}</Table.Td>
        <Table.Td>{val(item.phoneNo)}</Table.Td>
        <Table.Td>{val(item.eMailId)}</Table.Td>
        <Table.Td>
          {item.type
            ? <Badge variant="light" color="violet" size="sm">{item.type}</Badge>
            : <Text c="dimmed" size="sm">—</Text>
          }
        </Table.Td>
        <Table.Td>{val(item.supplierTypeName)}</Table.Td>
        <Table.Td>{val(item.eCCNo)}</Table.Td>
        <Table.Td>{val(item.iTNo)}</Table.Td>
        <Table.Td>{val(item.rCNo)}</Table.Td>
        <Table.Td>{val(item.cSTNo)}</Table.Td>
        <Table.Td>{val(item.lSTNo)}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Box p="md" style={{ width: '100%', overflowX: 'auto' }}>
      <Box mb="md">
        <Title order={3}>Supplier Master</Title>
        <Text c="dimmed" size="sm">Manage Supplier Master records</Text>
      </Box>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">{error}</Alert>
      )}

      {loading && !data.length ? (
        <Paper withBorder p="xl" ta="center">
          <Loader size="md" />
          <Text c="dimmed" size="sm" mt="sm">Loading suppliers...</Text>
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
          searchPlaceholder="Search by name, code or country..."
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

export default SupplierPage;
