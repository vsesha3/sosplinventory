import React from 'react';
import { Title, Text, Box, Paper } from '@mantine/core';

const CapitalGoodsPage: React.FC = () => {
  return (
    <Box>
      <Title order={3} mb="xs">Capital Goods Master</Title>
      <Text c="dimmed" size="sm" mb="lg">Manage Capital Goods Master records</Text>
      <Paper withBorder p="xl" ta="center" c="dimmed">
        Capital Goods Master — coming soon
      </Paper>
    </Box>
  );
};

export default CapitalGoodsPage;
