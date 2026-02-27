import React from 'react';
import { Title, Text, Box, Paper } from '@mantine/core';

const SubitemPage: React.FC = () => {
  return (
    <Box>
      <Title order={3} mb="xs">Subitem Master</Title>
      <Text c="dimmed" size="sm" mb="lg">Manage Subitem Master records</Text>
      <Paper withBorder p="xl" ta="center" c="dimmed">
        Subitem Master — coming soon
      </Paper>
    </Box>
  );
};

export default SubitemPage;
