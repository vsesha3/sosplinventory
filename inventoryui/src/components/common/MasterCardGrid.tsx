import React from 'react';
import {
  Box, Paper, Text, Group, TextInput, Button, Tooltip,
  Divider, Pagination, Loader, SimpleGrid, Card, Checkbox,
} from '@mantine/core';
import {
  IconSearch, IconPlus, IconEdit, IconTrash, IconRefresh, IconDownload,
} from '@tabler/icons-react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CardFieldDef {
  key: string;
  label: string;
  render?: (value: any) => React.ReactNode; // optional custom renderer
}

export interface MasterCardGridProps {
  // Data
  fields: CardFieldDef[];           // fields to display in each card
  items: Record<string, any>[];     // raw data objects
  idKey: string;                    // which field is the unique ID
  totalElements: number;
  loading: boolean;
  columns?: number;                 // number of cards per row, default 2

  // Pagination
  page: number;
  totalPages: number;
  pageSize: number;
  showToolbar?: boolean;
  onPageChange: (page: number) => void;

  // Search
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  // Selection
  selected: (number | string)[];
  onToggleSelect: (id: number | string) => void;
  onToggleSelectAll: () => void;
  allSelected: boolean;
  someSelected: boolean;

  // Toolbar actions
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const MasterCardGrid: React.FC<MasterCardGridProps> = ({
  fields,
  items,
  idKey,
  totalElements,
  loading,
  columns = 2,
  page,
  totalPages,
  pageSize,
  showToolbar = true,
  onPageChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  selected,
  onToggleSelect,
  onToggleSelectAll,
  allSelected,
  someSelected,
  onAdd,
  onEdit,
  onDelete,
  onRefresh,
  onExport,
}) => {
  const selectedCount = selected.length;
  const startRecord = totalElements === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, totalElements);

  return (
    <Paper withBorder>

      {/* ── Toolbar ── */}
      {showToolbar && (
      <Box px="md" py="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Group justify="space-between" wrap="wrap" gap="sm">
          <Group gap="xs">
            <Tooltip label="Add new record">
              <Button size="xs" leftSection={<IconPlus size={14} />} onClick={onAdd}>
                Add
              </Button>
            </Tooltip>

            <Tooltip label={selectedCount === 1 ? 'Edit selected' : 'Select exactly one to edit'}>
              <Button
                size="xs" variant="light" color="yellow"
                leftSection={<IconEdit size={14} />}
                disabled={selectedCount !== 1}
                onClick={onEdit}
              >
                Edit
              </Button>
            </Tooltip>

            <Tooltip label={selectedCount > 0 ? `Delete ${selectedCount} record(s)` : 'Select to delete'}>
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

            <Tooltip label="Refresh">
              <Button size="xs" variant="subtle" color="gray"
                leftSection={<IconRefresh size={14} />} onClick={onRefresh}>
                Refresh
              </Button>
            </Tooltip>

            <Tooltip label="Export to CSV">
              <Button size="xs" variant="subtle" color="green"
                leftSection={<IconDownload size={14} />} onClick={onExport}>
                Export
              </Button>
            </Tooltip>
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
    )}
      {/* ── Select All bar ── */}
      {showToolbar && items.length > 0 && (
     
        <Box
          px="md" py="xs"
          style={{ borderBottom: '1px solid var(--mantine-color-gray-2)', backgroundColor: 'var(--mantine-color-gray-0)' }}
        >
          <Group gap="xs">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={onToggleSelectAll}
              size="sm"
            />
            <Text size="xs" c="dimmed">
              {allSelected ? 'Deselect all' : 'Select all on this page'}
            </Text>
          </Group>
        </Box>
      )}

      {/* ── Cards ── */}
      <Box p="md">
        {loading ? (
          <Box ta="center" py="xl">
            <Loader size="sm" />
          </Box>
        ) : items.length === 0 ? (
          <Text ta="center" c="dimmed" size="sm" py="xl">No records found</Text>
        ) : (
          <SimpleGrid cols={columns} spacing="sm">
            {items.map((item) => {
              const id = item[idKey];
              const isSelected = selected.includes(id);
              return (
                <Card
                  key={id}
                  withBorder
                  padding="sm"
                  radius="sm"
                  style={{
                    cursor: 'pointer',
                    borderLeft: isSelected
                      ? '4px solid var(--mantine-color-blue-5)'
                      : '4px solid var(--mantine-color-teal-4)',   // ← teal accent always
                    backgroundColor: isSelected
                      ? 'var(--mantine-color-blue-0)'
                      : 'white',
                    transition: 'border-color 0.15s, background-color 0.15s',
                  }}
                  onClick={() => onToggleSelect(id)}
                >
                  {/* Card header: checkbox + primary label */}
                  <Group justify="space-between" mb="xs" wrap="nowrap">
                    <Group gap="xs" wrap="nowrap">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onToggleSelect(id)}
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Text fw={600} size="sm" lineClamp={1} c="teal.7">
                        {item[fields[0]?.key] ?? '—'}
                      </Text>
                    </Group>
                  </Group>

                  <Divider mb="xs" />

                  {/* Field rows — skip first field (used as header) */}

                  <Box
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px 12px',
                      backgroundColor: 'var(--mantine-color-gray-0)',
                      borderRadius: 6,
                      padding: '8px 10px',
                      marginTop: 4,
                    }}
                  >
                    {fields.slice(1).map((field) => (
                      <Box key={field.key}>
                        <Text size="xs" c="dimmed" style={{ lineHeight: 1.3 }}>{field.label}</Text>
                        <Text size="sm" style={{ lineHeight: 1.4 }}>
                          {field.render
                            ? field.render(item[field.key])
                            : (item[field.key] ?? <Text span c="dimmed" size="sm">—</Text>)
                          }
                        </Text>
                      </Box>
                    ))}
                  </Box>
                </Card>
              );
            })}
          </SimpleGrid>
        )}
      </Box>

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

export default MasterCardGrid;
