import React from 'react';
import {
  Table, ScrollArea, Text, Checkbox, Loader, Box, Paper,
  Group, TextInput, Button, Tooltip, Divider, Pagination,
} from '@mantine/core';
import {
  IconSearch, IconPlus, IconEdit, IconTrash, IconRefresh, IconDownload,
} from '@tabler/icons-react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ColumnDef {
  key: string;
  label: string;
  width?: number;
  align?: 'left' | 'right' | 'center';
  wrap?: boolean;     // wraps cell text to next line instead of truncating
  compact?: boolean;  // reduces font to xs for dense/long-text columns
}

export interface MasterTableProps {
  columns: ColumnDef[];
  rows: React.ReactNode[];
  totalElements: number;
  loading: boolean;
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  allSelected: boolean;
  someSelected: boolean;
  onToggleSelectAll: () => void;
  selectedCount: number;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  colSpan: number;
  extraActions?: React.ReactNode;
   expandable?: boolean;   
}

// ── Component ─────────────────────────────────────────────────────────────────

const MasterTable: React.FC<MasterTableProps> = ({
  columns,
  rows,
  totalElements,
  loading,
  page,
  totalPages,
  pageSize,
  onPageChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  allSelected,
  someSelected,
  onToggleSelectAll,
  selectedCount,
  onAdd,
  onEdit,
  onDelete,
  onRefresh,
  onExport,
  colSpan,
  extraActions,
  expandable = false,
}) => {
  const startRecord = totalElements === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRecord   = Math.min(page * pageSize, totalElements);

  return (
    <Paper withBorder>

      {/* ── Toolbar ── */}
      <Box px="md" py="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Group justify="space-between" wrap="wrap" gap="sm">
          <Group gap="xs">
            <Tooltip label="Add new record">
              <Button size="xs" leftSection={<IconPlus size={14} />} onClick={onAdd}>
                Add
              </Button>
            </Tooltip>

            <Tooltip label={selectedCount === 1 ? 'Edit selected record' : 'Select exactly one record to edit'}>
              <Button
                size="xs" variant="light" color="yellow"
                leftSection={<IconEdit size={14} />}
                disabled={selectedCount !== 1}
                onClick={onEdit}
              >
                Edit
              </Button>
            </Tooltip>

            <Tooltip label={selectedCount > 0 ? `Delete ${selectedCount} record(s)` : 'Select records to delete'}>
              <Button
                size="xs" variant="light" color="red"
                leftSection={<IconTrash size={14} />}
                disabled={selectedCount === 0}
                onClick={onDelete}
              >
                Delete{selectedCount > 0 ? ` (${selectedCount})` : ''}
              </Button>
            </Tooltip>

            <Divider orientation="vertical" />

            <Tooltip label="Refresh data">
              <Button
                size="xs" variant="subtle" color="gray"
                leftSection={<IconRefresh size={14} />}
                onClick={onRefresh}
              >
                Refresh
              </Button>
            </Tooltip>

            <Tooltip label="Export to CSV">
              <Button
                size="xs" variant="subtle" color="green"
                leftSection={<IconDownload size={14} />}
                onClick={onExport}
              >
                Export
              </Button>
            </Tooltip>

            {extraActions && (
              <>
                <Divider orientation="vertical" />
                {extraActions}
              </>
            )}
          </Group>

          <Group gap="sm">
            {selectedCount > 0 && (
              <Text size="xs" c="dimmed">{selectedCount} selected</Text>
            )}
            <TextInput
              placeholder={searchPlaceholder}
              leftSection={<IconSearch size={15} />}
              value={searchValue}
              onChange={(e) => onSearchChange(e.currentTarget.value)}
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
                {expandable && <Table.Th w={36} />}
                <Table.Th w={40}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={onToggleSelectAll}
                    size="sm"
                  />
                </Table.Th>
                {columns.map((col) => (
                  <Table.Th
                    key={col.key}
                    w={col.width}
                    ta={col.align ?? 'left'}
                    style={{
                      ...(col.wrap ? { whiteSpace: 'normal', minWidth: col.width ?? 160 } : {}),
                      ...(col.compact || col.wrap ? { fontSize: '11px' } : {}),
                    }}
                  >
                    {col.label}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {rows.length > 0 ? rows : (
                <Table.Tr>
                  <Table.Td colSpan={colSpan} ta="center">
                    <Text c="dimmed" size="sm" py="md">No records found</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      )}

      {/* ── Footer ── */}
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
              onChange={onPageChange}
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
  );
};

export default MasterTable;
