import React, { useEffect } from 'react';
import { Title, Text, Box, Paper } from '@mantine/core';

const RawMaterialPage: React.FC = () => {

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  const fetchRawMaterials = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/rm');

      if (!response.ok) {
        throw new Error('Failed to fetch RM data');
      }

      const data = await response.json();
      console.log('Raw Materials Response:', data);

    } catch (error) {
      console.error('Error fetching RM data:', error);
    }
  };

  return (
    <Box>
      <Title order={3} mb="xs">
        Raw Material Master
      </Title>

      <Text c="dimmed" size="sm" mb="lg">
        Manage Raw Material Master records
      </Text>

      <Paper withBorder p="xl" ta="center" c="dimmed">
        Raw Material Master — loading console data
      </Paper>
    </Box>
  );
};

export default RawMaterialPage;