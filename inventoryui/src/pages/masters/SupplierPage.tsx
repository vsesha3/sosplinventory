import React, { useEffect, useState, useCallback } from 'react';

import {
  Title,
  Text,
  Box,
  Alert,
  Loader,
  Paper,
  Badge,
  Table,
  Checkbox,
} from '@mantine/core';

import { IconAlertCircle } from '@tabler/icons-react';

import api from '../../services/api';

import MasterTable from '../../components/common/MasterTable';
import type { ColumnDef } from '../../components/common/MasterTable';

import type { PagedApiResponse } from '../../types/api.types';


import SupplierMasterForm, {
  type SupplierMasterFormData,
} from './Forms/SupplierMasterForm';

import SaveStatusBanner from '../../pages/common/Savestatusbanner';
import type { SaveStatus } from '../../pages/common/Savestatusbanner';

// =============================================================================
// Supplier list interface
// =============================================================================

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

  // New field
  gstNo?: string | null;
}


const PAGE_SIZE = 10;


// =============================================================================
// Columns
// =============================================================================

const COLUMNS: ColumnDef[] = [

  {
    key: 'supplierCode',
    label: 'Supplier Code',
    width: 110,
  },

  {
    key: 'supplierName',
    label: 'Supplier Name',
    width: 140,
  },

  {
    key: 'address',
    label: 'Address',
    width: 180,
    wrap: true,
    compact: true,
  },

  {
    key: 'countryName',
    label: 'Country Name',
    width: 110,
  },

  {
    key: 'phoneNo',
    label: 'Phone No',
    width: 110,
  },

  {
    key: 'eMailId',
    label: 'Email Id',
    width: 150,
  },

  {
    key: 'type',
    label: 'Type',
    width: 70,
  },

  {
    key: 'supplierTypeName',
    label: 'Supplier Type Name',
    width: 140,
  },

  // GST replaces the old ECC column
  {
    key: 'gstNo',
    label: 'GST Number',
    width: 150,
  },

  {
    key: 'iTNo',
    label: 'IT No',
    width: 90,
  },

  {
    key: 'rCNo',
    label: 'RC No',
    width: 90,
  }
];


// =============================================================================
// Component
// =============================================================================

const SupplierPage: React.FC = () => {

  const [data, setData] =
    useState<Supplier[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [searchInput, setSearchInput] =
    useState('');

  const [keyword, setKeyword] =
    useState('');

  const [selected, setSelected] =
    useState<number[]>([]);

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalElements, setTotalElements] =
    useState(0);


  // ===========================================================================
  // Supplier form state
  // ===========================================================================

  const [formOpened, setFormOpened] =
    useState(false);

  const [formMode, setFormMode] =
    useState<'create' | 'update'>('create');

  const [editingSupplierId, setEditingSupplierId] =
    useState<number | null>(null);


  const [saveStatus,  setSaveStatus]  = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');    


  // ===========================================================================
  // Fetch supplier list
  // ===========================================================================

  const fetchData = useCallback(
    async (
      currentPage: number,
      currentKeyword: string
    ) => {

      try {

        setLoading(true);

        setError(null);

        setSelected([]);


        const params = {
          page: currentPage - 1,
          size: PAGE_SIZE,
          sortBy: 'supplierId',
          sortDir: 'asc',
        };


        const url = currentKeyword.trim()
          ? '/api/supplier-view/search'
          : '/api/supplier-view';


        const response =
          await api.get<PagedApiResponse<Supplier>>(
            url,
            {
              params: currentKeyword.trim()
                ? {
                    ...params,
                    keyword: currentKeyword.trim(),
                  }
                : params,
            }
          );


        const pageData =
          response.data.data;


        setData(pageData.content);

        setTotalPages(pageData.totalPages);

        setTotalElements(
          pageData.totalElements
        );

      } catch (err: unknown) {

        setError(
          (err as any)?.response?.data?.message ||
          'Failed to fetch suppliers.'
        );

      } finally {

        setLoading(false);
      }

    },
    []
  );


  useEffect(() => {

    fetchData(page, keyword);

  }, [
    page,
    keyword,
    fetchData,
  ]);


  // ===========================================================================
  // Search debounce
  // ===========================================================================

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setKeyword(searchInput);

        setPage(1);

      }, 400);


    return () => clearTimeout(timer);

  }, [searchInput]);


  // ===========================================================================
  // Selection
  // ===========================================================================

  const allIds =
    data.map(
      item => item.supplierId
    );


  const allSelected =
    allIds.length > 0 &&
    allIds.every(
      id => selected.includes(id)
    );


  const someSelected =
    allIds.some(
      id => selected.includes(id)
    ) && !allSelected;


  const toggleSelectAll = () => {

    if (allSelected) {

      setSelected(
        prev =>
          prev.filter(
            id => !allIds.includes(id)
          )
      );

    } else {

      setSelected(
        prev =>
          [
            ...new Set(
              [
                ...prev,
                ...allIds,
              ]
            ),
          ]
      );
    }
  };


  const toggleRow = (id: number) => {

    setSelected(
      prev =>
        prev.includes(id)
          ? prev.filter(
              s => s !== id
            )
          : [...prev, id]
    );
  };


  // ===========================================================================
  // Helpers
  // ===========================================================================

  const val = (
    v: string | null | undefined
  ) =>
    v
      ? <span>{v}</span>
      : (
        <Text
          c="dimmed"
          size="sm"
        >
          —
        </Text>
      );


  // ===========================================================================
  // ADD
  // ===========================================================================

  const handleAdd = () => {

    setEditingSupplierId(null);

    setFormMode('create');

    setFormOpened(true);
  };


  // ===========================================================================
  // EDIT
  // ===========================================================================

  const handleEdit = () => {

    if (selected.length !== 1) {

      setError(
        'Please select exactly one supplier to edit.'
      );

      return;
    }


    setError(null);

    setEditingSupplierId(
      selected[0]
    );

    setFormMode('update');

    setFormOpened(true);
  };


  // ===========================================================================
  // SAVE
  // ===========================================================================

 const handleSave = async (form: SupplierMasterFormData) => {
  setSaveStatus('saving');          // ← add
  try {
    setError(null);

    if (formMode === 'create') {
      await api.post('/api/supplier', form);
    } else {
      if (!editingSupplierId) throw new Error('Supplier ID is missing.');
      await api.put(`/api/supplier/${editingSupplierId}`, form);
    }

    setSaveStatus('success');       // ← add
    setSaveMessage(formMode === 'create' ? 'Supplier created!' : 'Supplier updated!');  // ← add
    setFormOpened(false);
    setEditingSupplierId(null);
    await fetchData(page, keyword);

  } catch (err: any) {
    console.error('[Supplier Save]', err);
    setSaveStatus('error');         // ← add
    setSaveMessage(               // ← add
      err?.response?.data?.message ||
      `Failed to ${formMode === 'create' ? 'create' : 'update'} supplier.`
    );
    setError(
      err?.response?.data?.message ||
      `Failed to ${formMode === 'create' ? 'create' : 'update'} supplier.`
    );
  }
};


  // ===========================================================================
  // DELETE
  // ===========================================================================

  const handleDelete = async () => {

    if (selected.length === 0) {

      setError(
        'Please select at least one supplier.'
      );

      return;
    }


    try {

      setError(null);


      // Your controller currently supports
      // DELETE /api/supplier/{id}
      //
      // Therefore delete one by one.

      for (const id of selected) {

        await api.delete(
          `/api/supplier/${id}`
        );
      }


      setSelected([]);


      await fetchData(
        page,
        keyword
      );

    } catch (err: any) {

      console.error(
        '[Supplier Delete]',
        err
      );


      setError(
        err?.response?.data?.message ||
        'Failed to delete supplier.'
      );
    }
  };


  // ===========================================================================
  // Rows
  // ===========================================================================

  const rows =
    data.map(item => {

      const isSelected =
        selected.includes(
          item.supplierId
        );


      return (

        <Table.Tr

          key={item.supplierId}

          bg={
            isSelected
              ? 'var(--mantine-color-blue-0)'
              : undefined
          }

        >

          <Table.Td>

            <Checkbox

              checked={isSelected}

              onChange={() =>
                toggleRow(
                  item.supplierId
                )
              }

              size="sm"

            />

          </Table.Td>


          <Table.Td>
            {item.supplierCode}
          </Table.Td>


          <Table.Td fw={500}>
            {item.supplierName}
          </Table.Td>


          <Table.Td
            style={{
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              minWidth: 180,
            }}
          >

            {item.address

              ? item.address
                  .split(/[\n,]/)
                  .map(
                    (line, i) => (

                      <Text
                        key={i}
                        size="xs"
                        style={{
                          lineHeight: 1.4,
                        }}
                      >
                        {line.trim()}
                      </Text>

                    )
                  )

              : (
                <Text
                  c="dimmed"
                  size="xs"
                >
                  —
                </Text>
              )
            }

          </Table.Td>


          <Table.Td>
            {val(item.countryName)}
          </Table.Td>


          <Table.Td>
            {val(item.phoneNo)}
          </Table.Td>


          <Table.Td>
            {val(item.eMailId)}
          </Table.Td>


          <Table.Td>

            {item.type

              ? (
                <Badge
                  variant="light"
                  color="violet"
                  size="sm"
                >
                  {item.type}
                </Badge>
              )

              : (
                <Text
                  c="dimmed"
                  size="sm"
                >
                  —
                </Text>
              )
            }

          </Table.Td>


          <Table.Td>
            {val(item.supplierTypeName)}
          </Table.Td>


          {/* GST */}

          <Table.Td>
            {val(item.gstNo)}
          </Table.Td>


          <Table.Td>
            {val(item.iTNo)}
          </Table.Td>


          <Table.Td>
            {val(item.rCNo)}
          </Table.Td>


        

        </Table.Tr>
      );
    });


  // ===========================================================================
  // Render
  // ===========================================================================

  return (

    <Box
      p="md"
      style={{
        width: '100%',
        overflowX: 'auto',
      }}
    >

      <Box mb="md">

        <Title order={3}>
          Supplier Master
        </Title>

        <Text
          c="dimmed"
          size="sm"
        >
          Manage Supplier Master records
        </Text>

      </Box>


      {error && (

        <Alert
          icon={
            <IconAlertCircle
              size={16}
            />
          }
          color="red"
          mb="md"
          withCloseButton
          onClose={() =>
            setError(null)
          }
        >
          {error}
        </Alert>

      )}


      {loading && !data.length ? (

        <Paper
          withBorder
          p="xl"
          ta="center"
        >

          <Loader size="md" />

          <Text
            c="dimmed"
            size="sm"
            mt="sm"
          >
            Loading suppliers...
          </Text>

        </Paper>

      ) : (

        <MasterTable

          columns={COLUMNS}

          rows={rows}

          colSpan={
            COLUMNS.length + 1
          }

          totalElements={
            totalElements
          }

          loading={loading}

          page={page}

          totalPages={totalPages}

          pageSize={PAGE_SIZE}

          onPageChange={(val) => {

            setPage(val);

            setSelected([]);

          }}

          searchValue={
            searchInput
          }

          onSearchChange={
            (val) =>
              setSearchInput(val)
          }

          searchPlaceholder={
            'Search by name, code or country...'
          }

          allSelected={
            allSelected
          }

          someSelected={
            someSelected
          }

          onToggleSelectAll={
            toggleSelectAll
          }

          selectedCount={
            selected.length
          }

          // ADD
          onAdd={
            handleAdd
          }

          // EDIT
          onEdit={
            handleEdit
          }

          // DELETE
          onDelete={
            handleDelete
          }

          // REFRESH
          onRefresh={() =>
            fetchData(
              page,
              keyword
            )
          }

          onExport={() =>
            console.log('Export')
          }

        />

      )}


      {/* ================================================================= */}
      {/* Supplier Form */}
      {/* ================================================================= */}

      <SupplierMasterForm

        opened={formOpened}

        onClose={() => {

          setFormOpened(false);

          setEditingSupplierId(null);

        }}

        onSave={handleSave}

        supplierId={
          editingSupplierId
        }

        mode={
          formMode
        }

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


export default SupplierPage;