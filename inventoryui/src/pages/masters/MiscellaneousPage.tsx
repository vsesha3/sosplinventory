import React from 'react';
import { Title, Text, Box, Paper } from '@mantine/core';

const MiscellaneousPage: React.FC = () => {
  return (
    <Box>
      <Title order={3} mb="xs">Miscellaneous Master</Title>
      <Text c="dimmed" size="sm" mb="lg">Manage Miscellaneous Master records</Text>
      <Paper withBorder p="xl" ta="center" c="dimmed">
        Miscellaneous Master — coming soon
      </Paper>
    </Box>
  );
};

export default MiscellaneousPage;
