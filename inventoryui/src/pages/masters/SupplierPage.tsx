import React from 'react';
import { Title, Text, Box, Paper } from '@mantine/core';

const SupplierPage: React.FC = () => {
  return (
    <Box>
      <Title order={3} mb="xs">Supplier Master</Title>
      <Text c="dimmed" size="sm" mb="lg">Manage Supplier Master records</Text>
      <Paper withBorder p="xl" ta="center" c="dimmed">
        Supplier Master — coming soon
      </Paper>
    </Box>
  );
};

export default SupplierPage;
