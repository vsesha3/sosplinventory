import React from 'react';
import { Title, Text, Box, Paper } from '@mantine/core';

const PmGroupPage: React.FC = () => {
  return (
    <Box>
      <Title order={3} mb="xs">PM Group Master</Title>
      <Text c="dimmed" size="sm" mb="lg">Manage PM Group Master records</Text>
      <Paper withBorder p="xl" ta="center" c="dimmed">
        PM Group Master — coming soon
      </Paper>
    </Box>
  );
};

export default PmGroupPage;
