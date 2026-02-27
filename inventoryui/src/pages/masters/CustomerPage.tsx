import React from 'react';
import { Title, Text, Box, Paper } from '@mantine/core';

const CustomerPage: React.FC = () => {
  return (
    <Box>
      <Title order={3} mb="xs">Customer Master</Title>
      <Text c="dimmed" size="sm" mb="lg">Manage Customer Master records</Text>
      <Paper withBorder p="xl" ta="center" c="dimmed">
        Customer Master — coming soon
      </Paper>
    </Box>
  );
};

export default CustomerPage;
