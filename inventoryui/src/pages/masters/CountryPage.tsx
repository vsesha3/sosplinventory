import React from 'react';
import { Title, Text, Box, Paper } from '@mantine/core';

const CountryPage: React.FC = () => {
  return (
    <Box>
      <Title order={3} mb="xs">Country Master</Title>
      <Text c="dimmed" size="sm" mb="lg">Manage Country Master records</Text>
      <Paper withBorder p="xl" ta="center" c="dimmed">
        Country Master — coming soon
      </Paper>
    </Box>
  );
};

export default CountryPage;
