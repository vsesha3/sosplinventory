import React, { useState, useCallback } from 'react';
import {
  Table, Box, Text, Loader, ActionIcon, Collapse,
  Badge, Group,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ChildColumnDef {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  width?: number;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface ExpandableRowProps {
  /** The parent row cells (everything after the checkbox, before the expand button) */
  parentCells: React.ReactNode;
  /** Total colspan of the parent table (used for the expanded area) */
  colSpan: number;
  /** ID used to track which row is expanded */
  rowId: number | string;
  /** Async function to fetch child rows — called on first expand */
  fetchChildren: (id: number | string) => Promise<any[]>;
  /** Column definitions for the child table */
  childColumns: ChildColumnDef[];
  /** Optional label shown above child table */
  childTitle?: string;
  /** Whether this row is selected (for bg highlight) */
  isSelected?: boolean;
  /** Checkbox cell to render at start of row */
  checkboxCell?: React.ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────

const ExpandableRow: React.FC<ExpandableRowProps> = ({
  parentCells,
  colSpan,
  rowId,
  fetchChildren,
  childColumns,
  childTitle,
  isSelected = false,
  checkboxCell,
}) => {
  const [expanded, setExpanded]     = useState(false);
  const [children, setChildren]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(false);
  const [loaded, setLoaded]         = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const handleToggle = useCallback(async () => {
    const next = !expanded;
    setExpanded(next);

    // Only fetch once
    if (next && !loaded) {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchChildren(rowId);
        setChildren(data);
        setLoaded(true);
      } catch (e: any) {
        setError(e?.message || 'Failed to load details');
      } finally {
        setLoading(false);
      }
    }
  }, [expanded, loaded, fetchChildren, rowId]);

  const bg = isSelected ? 'var(--mantine-color-blue-0)' : undefined;

  return (
    <>
      {/* ── Parent Row ── */}
      <Table.Tr bg={bg}>
        {/* Expand toggle */}
        <Table.Td w={36} style={{ padding: '4px 6px' }}>
          <ActionIcon
            size="xs"
            variant="subtle"
            color="gray"
            onClick={handleToggle}
            style={{
              transition: 'transform 0.2s ease',
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        </Table.Td>

        {/* Checkbox */}
        {checkboxCell && <Table.Td>{checkboxCell}</Table.Td>}

        {/* Parent data cells */}
        {parentCells}
      </Table.Tr>

      {/* ── Expanded Child Area ── */}
      {expanded && (
        <Table.Tr>
          <Table.Td
            colSpan={colSpan}
            style={{
              padding: 0,
              backgroundColor: 'var(--mantine-color-gray-0)',
              borderTop: 'none',
            }}
          >
            <Collapse in={expanded}>
              <Box
                p="sm"
                ml="xl"
                style={{
                  borderLeft: '3px solid var(--mantine-color-blue-4)',
                  backgroundColor: 'var(--mantine-color-blue-0)',
                }}
              >
                {/* Child header */}
                <Group mb="xs" gap="sm">
                  {childTitle && (
                    <Text size="xs" fw={600} c="blue">
                      {childTitle}
                    </Text>
                  )}
                  {!loading && !error && (
                    <Badge size="xs" variant="light" color="blue">
                      {children.length} item{children.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </Group>

                {/* Loading */}
                {loading && (
                  <Group gap="xs" py="xs">
                    <Loader size="xs" />
                    <Text size="xs" c="dimmed">Loading...</Text>
                  </Group>
                )}

                {/* Error */}
                {error && (
                  <Text size="xs" c="red">{error}</Text>
                )}

                {/* Child table */}
                {!loading && !error && children.length === 0 && (
                  <Text size="xs" c="dimmed" py="xs">No line items found</Text>
                )}

                {!loading && !error && children.length > 0 && (
                  <Box style={{ overflowX: 'auto' }}>
                    <Table
                      withTableBorder
                      withColumnBorders
                      style={{ backgroundColor: 'white', fontSize: 12 }}
                    >
                      <Table.Thead>
                        <Table.Tr style={{ backgroundColor: 'var(--mantine-color-blue-1)' }}>
                          {childColumns.map((col) => (
                            <Table.Th
                              key={col.key}
                              w={col.width}
                              ta={col.align ?? 'left'}
                              style={{ fontSize: 11, fontWeight: 600 }}
                            >
                              {col.label}
                            </Table.Th>
                          ))}
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {children.map((child, idx) => (
                          <Table.Tr key={child.poDetId ?? idx}>
                            {childColumns.map((col) => (
                              <Table.Td
                                key={col.key}
                                ta={col.align ?? 'left'}
                                style={{ fontSize: 12 }}
                              >
                                {col.render
                                  ? col.render(child[col.key], child)
                                  : (child[col.key] ?? <Text span c="dimmed" size="xs">—</Text>)
                                }
                              </Table.Td>
                            ))}
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Box>
                )}
              </Box>
            </Collapse>
          </Table.Td>
        </Table.Tr>
      )}
    </>
  );
};

export default ExpandableRow;
