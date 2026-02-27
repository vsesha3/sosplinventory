import React from 'react';
import { Title, Text, Box, Paper } from '@mantine/core';

const TransporterPage: React.FC = () => {
  return (
    <Box>
      <Title order={3} mb="xs">Transporter Master</Title>
      <Text c="dimmed" size="sm" mb="lg">Manage Transporter Master records</Text>
      <Paper withBorder p="xl" ta="center" c="dimmed">
        Transporter Master — coming soon
      </Paper>
    </Box>
  );
};

export default TransporterPage;
