import React, { useEffect, useState } from 'react';
import {
  Title, Text, Box, Paper, Table, ScrollArea,
  Badge, Loader, Alert, Group, TextInput,
} from '@mantine/core';
import { IconAlertCircle, IconSearch } from '@tabler/icons-react';
import api from '../../services/api';

interface AvgRate {
  source: string;
  parsedValue: number;
}

interface RawMaterial {
  id: number;
  rmCode: number;
  rmName: string;
  uomName: string;
  rmGroupName: string;
  testName: string | null;
  avgRate: AvgRate | null;
}

const RawMaterialPage: React.FC = () => {
  const [data, setData] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchRawMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/rm');

      // API returns object with numeric keys e.g. { "0": {...}, "1": {...} }
      const raw = response.data;
      const list: RawMaterial[] = Object.values(raw);
      setData(list);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch raw materials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  const filtered = data.filter((item) =>
    item.rmName.toLowerCase().includes(search.toLowerCase()) ||
    item.rmCode.toString().includes(search) ||
    item.rmGroupName?.toLowerCase().includes(search.toLowerCase())
  );

  const rows = filtered.map((item, index) => (
    <Table.Tr key={item.id}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{item.rmCode}</Table.Td>
      <Table.Td fw={500}>{item.rmName}</Table.Td>
      <Table.Td>
        <Badge variant="light" color="blue" size="sm">
          {item.uomName}
        </Badge>
      </Table.Td>
      <Table.Td>{item.rmGroupName}</Table.Td>
      <Table.Td>{item.testName ?? <Text c="dimmed" size="sm">—</Text>}</Table.Td>
     <Table.Td>
  {item.avgRate?.parsedValue != null
    ? <Text size="sm">₹ {Number(item.avgRate.parsedValue).toFixed(2)}</Text>
    : <Text c="dimmed" size="sm">—</Text>
  }
</Table.Td>
    </Table.Tr>
  ));

  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="md">
        <Box>
          <Title order={3}>Raw Material Master</Title>
          <Text c="dimmed" size="sm">Manage Raw Material Master records</Text>
        </Box>
        <TextInput
          placeholder="Search by name, code or group..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          w={280}
        />
      </Group>

      {/* Error */}
      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading ? (
        <Paper withBorder p="xl" ta="center">
          <Loader size="md" />
          <Text c="dimmed" size="sm" mt="sm">Loading raw materials...</Text>
        </Paper>
      ) : (
        <Paper withBorder>
          <ScrollArea>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>RM Code</Table.Th>
                  <Table.Th>RM Name</Table.Th>
                  <Table.Th>UOM</Table.Th>
                  <Table.Th>Group</Table.Th>
                  <Table.Th>Test Name</Table.Th>
                  <Table.Th>Avg Rate</Table.Th>
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
          <Box px="md" py="xs" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
            <Text size="xs" c="dimmed">
              Showing {filtered.length} of {data.length} records
            </Text>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default RawMaterialPage;