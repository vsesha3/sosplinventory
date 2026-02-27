import React from 'react';
import { Title, Text, Box, Paper } from '@mantine/core';

const ProductPage: React.FC = () => {
  return (
    <Box>
      <Title order={3} mb="xs">Product Master</Title>
      <Text c="dimmed" size="sm" mb="lg">Manage Product Master records</Text>
      <Paper withBorder p="xl" ta="center" c="dimmed">
        Product Master — coming soon
      </Paper>
    </Box>
  );
};

export default ProductPage;
