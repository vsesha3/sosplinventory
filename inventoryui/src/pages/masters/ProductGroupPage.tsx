import React from 'react';
import { Title, Text, Box, Paper } from '@mantine/core';

const ProductGroupPage: React.FC = () => {
  return (
    <Box>
      <Title order={3} mb="xs">Product Group Master</Title>
      <Text c="dimmed" size="sm" mb="lg">Manage Product Group Master records</Text>
      <Paper withBorder p="xl" ta="center" c="dimmed">
        Product Group Master — coming soon
      </Paper>
    </Box>
  );
};

export default ProductGroupPage;
