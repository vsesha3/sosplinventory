import React from 'react';
import { Title, Text, Box, Paper } from '@mantine/core';

const PackingMaterialPage: React.FC = () => {
  return (
    <Box>
      <Title order={3} mb="xs">Packing Material Master</Title>
      <Text c="dimmed" size="sm" mb="lg">Manage Packing Material Master records</Text>
      <Paper withBorder p="xl" ta="center" c="dimmed">
        Packing Material Master — coming soon
      </Paper>
    </Box>
  );
};

export default PackingMaterialPage;
