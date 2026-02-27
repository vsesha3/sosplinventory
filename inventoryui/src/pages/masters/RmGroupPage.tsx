import React from 'react';
import { Title, Text, Box, Paper } from '@mantine/core';

const RmGroupPage: React.FC = () => {
  return (
    <Box>
      <Title order={3} mb="xs">RM Group Master</Title>
      <Text c="dimmed" size="sm" mb="lg">Manage RM Group Master records</Text>
      <Paper withBorder p="xl" ta="center" c="dimmed">
        RM Group Master — coming soon
      </Paper>
    </Box>
  );
};

export default RmGroupPage;
