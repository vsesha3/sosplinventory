import React, { useEffect, useState, useCallback } from 'react';
import { Title, Text, Box, Alert, Loader, Paper, Badge } from '@mantine/core';
import { Table, Checkbox } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import api from '../../services/api';
import MasterTable from '../../components/common/MasterTable';
import type { ColumnDef } from '../../components/common/MasterTable';
import type { PagedApiResponse } from '../../types/api.types';
import ProductMasterForm from './Forms/ProductMasterForm';
import type { ProductMasterFormData } from './Forms/ProductMasterForm';
import SaveStatusBanner from '../../pages/common/Savestatusbanner';
import type { SaveStatus } from '../../pages/common/Savestatusbanner';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Product {
  productId:        number;
  productCode:      number;
  productName:      string;
  uomName:          string;
  productGroupName: string | null;
  testName:         string | null;
  rate:             { parsedValue: number; source: string } | number | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    content:       Product[];
    pageNumber:    number;
    pageSize:      number;
    totalElements: number;
    totalPages:    number;
    first:         boolean;
    last:          boolean;
  };
}

const PAGE_SIZE = 10;

// ── Column definitions ────────────────────────────────────────────────────────

const COLUMNS: ColumnDef[] = [
  { key: 'productCode',      label: 'Product Code'  },
  { key: 'productName',      label: 'Product Name'  },
  { key: 'uomName',          label: 'UOM'           },
  { key: 'productGroupName', label: 'Group'         },
  { key: 'testName',         label: 'Test Name'     },
  { key: 'rate',             label: 'Rate', align: 'right' },
];

// ── Rate helper ───────────────────────────────────────────────────────────────

const extractRate = (v: Product['rate']): number | null => {
  if (v == null) return null;
  if (typeof v === 'number') return v;
  if (typeof v === 'object') return v.parsedValue ?? parseFloat(v.source) ?? null;
  return parseFloat(v) || null;
};

// ── Component ─────────────────────────────────────────────────────────────────

const ProductPage: React.FC = () => {

  const [data,          setData]          = useState<Product[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [searchInput,   setSearchInput]   = useState('');
  const [keyword,       setKeyword]       = useState('');
  const [selected,      setSelected]      = useState<number[]>([]);
  const [page,          setPage]          = useState(1);
  const [totalPages,    setTotalPages]    = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // ── Form state ────────────────────────────────────────────────────────────
  const [formOpen,     setFormOpen]     = useState(false);
  const [editProductId,setEditProductId]= useState<number | null>(null);
  const [formMode,     setFormMode]     = useState<'create' | 'update'>('create');
  const [saveStatus,   setSaveStatus]   = useState<SaveStatus>('idle');
  const [saveMessage,  setSaveMessage]  = useState('');

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async (currentPage: number, currentKeyword: string) => {
    try {
      setLoading(true);
      setError(null);
      setSelected([]);

      const params = {
        page:    currentPage - 1,
        size:    PAGE_SIZE,
        sortBy:  'productId',
        sortDir: 'asc',
      };
      const url = currentKeyword.trim() ? '/api/product/search' : '/api/product';
      const response = await api.get<ApiResponse>(url, {
        params: currentKeyword.trim()
          ? { ...params, keyword: currentKeyword.trim() }
          : params,
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

  useEffect(() => { fetchData(page, keyword); }, [page, keyword, fetchData]);

  // Debounce search 400ms
  useEffect(() => {
    const timer = setTimeout(() => { setKeyword(searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── Selection ─────────────────────────────────────────────────────────────

  const allIds       = data.map(item => item.productId);
  const allSelected  = allIds.length > 0 && allIds.every(id => selected.includes(id));
  const someSelected = allIds.some(id => selected.includes(id)) && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      setSelected(prev => [...new Set([...prev, ...allIds])]);
    }
  };

  const toggleRow = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  // ── Save ──────────────────────────────────────────────────────────────────

  const handleSave = async (formData: ProductMasterFormData) => {
    setSaveStatus('saving');
    try {
      const payload = {
        productCode:       formData.productCode       ? Number(formData.productCode)       : null,
        productCodePrefix: formData.productCodePrefix || null,
        sapCode:           formData.sapCode           || null,
        productName:       formData.productName,
        brandName:         formData.brandName         || null,
        uomId:             formData.uomId             ? Number(formData.uomId)             : null,
        fgLotCode:         formData.fgLotCode         || null,
        productGroupId:    formData.productGroupId    ? Number(formData.productGroupId)    : null,
        capacity:          formData.capacity          ? Number(formData.capacity)          : null,
        packingType:       formData.packingType       || null,
        rate:              formData.rate              ? Number(formData.rate)              : null,
        gstRate:           formData.gstRate           ? Number(formData.gstRate)           : null,
        testId:            formData.testId            ? Number(formData.testId)            : null,
        testCode:          formData.testCode          ? Number(formData.testCode)          : null,
        conversionCost:    formData.conversionCost    ? Number(formData.conversionCost)    : null,
        // RM mappings
        rmMappings: formData.rmMappings.map(r => ({
          rmId:       r.rmId       ? Number(r.rmId)  : null,
          rmCode:     r.rmCode     ? Number(r.rmCode): null,
          percentage: r.percentage ? Number(r.percentage) : null,
        })),
      };

      if (formMode === 'update' && formData.id) {
        await api.put(`/api/product/${formData.id}`, payload);
      } else {
        await api.post('/api/product', payload);
      }

      setSaveStatus('success');
      setSaveMessage(formMode === 'update' ? 'Product updated!' : 'Product created!');
      setFormOpen(false);
      setEditProductId(null);
      setFormMode('create');
      fetchData(page, keyword);
    } catch (err: any) {
      setSaveStatus('error');
      setSaveMessage(err?.response?.data?.message || 'Failed to save Product.');
    }
  };

  // ── Rows ──────────────────────────────────────────────────────────────────

  const rows = data.map(item => {
    const isSelected = selected.includes(item.productId);
    const rate       = extractRate(item.rate);
    return (
      <Table.Tr
        key={item.productId}
        bg={isSelected ? 'var(--mantine-color-blue-0)' : undefined}
      >
        <Table.Td>
          <Checkbox
            checked={isSelected}
            onChange={() => toggleRow(item.productId)}
            size="sm"
          />
        </Table.Td>
        <Table.Td>{item.productCode}</Table.Td>
        <Table.Td fw={500}>{item.productName}</Table.Td>
        <Table.Td>
          <Badge variant="light" color="teal" size="sm">{item.uomName}</Badge>
        </Table.Td>
        <Table.Td>
          {item.productGroupName ?? <Text c="dimmed" size="sm">—</Text>}
        </Table.Td>
        <Table.Td>
          {item.testName ?? <Text c="dimmed" size="sm">—</Text>}
        </Table.Td>
        <Table.Td ta="right">
          {rate != null
            ? <Text size="sm" ta="right">{rate.toFixed(2)}</Text>
            : <Text c="dimmed" size="sm" ta="right">—</Text>}
        </Table.Td>
      </Table.Tr>
    );
  });

  // ── Render ────────────────────────────────────────────────────────────────

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
          onAdd={() => {
            setEditProductId(null);
            setFormMode('create');
            setFormOpen(true);
          }}
          onEdit={selected.length === 1
            ? () => {
                setEditProductId(selected[0]);
                setFormMode('update');
                setFormOpen(true);
              }
            : undefined
          }
          onDelete={() => console.log('Delete', selected)}
          onRefresh={() => fetchData(page, keyword)}
          onExport={() => console.log('Export')}
        />
      )}

      <ProductMasterForm
        opened={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditProductId(null);
          setFormMode('create');
        }}
        onSave={handleSave}
        productId={editProductId}
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

export default ProductPage;