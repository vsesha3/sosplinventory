import React from 'react';
import { Title, Text, Box, Paper } from '@mantine/core';

const RawMaterialPage: React.FC = () => {
  return (
    <Box>
      <Title order={3} mb="xs">Raw Material Master</Title>
      <Text c="dimmed" size="sm" mb="lg">Manage Raw Material Master records</Text>
      <Paper withBorder p="xl" ta="center" c="dimmed">
        Raw Material Master — coming soon
      </Paper>
    </Box>
  );
};

export default RawMaterialPage;
