import React from 'react';
import { Title, Text, Box, Paper } from '@mantine/core';

const BrandPage: React.FC = () => {
  return (
    <Box>
      <Title order={3} mb="xs">Brand Master</Title>
      <Text c="dimmed" size="sm" mb="lg">Manage Brand Master records</Text>
      <Paper withBorder p="xl" ta="center" c="dimmed">
        Brand Master — coming soon
      </Paper>
    </Box>
  );
};

export default BrandPage;
