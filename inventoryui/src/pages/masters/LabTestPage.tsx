import React from 'react';
import { Title, Text, Box, Paper } from '@mantine/core';

const LabTestPage: React.FC = () => {
  return (
    <Box>
      <Title order={3} mb="xs">Lab Test Master</Title>
      <Text c="dimmed" size="sm" mb="lg">Manage Lab Test Master records</Text>
      <Paper withBorder p="xl" ta="center" c="dimmed">
        Lab Test Master — coming soon
      </Paper>
    </Box>
  );
};

export default LabTestPage;
