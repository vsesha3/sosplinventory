import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Alert,
  Box,
  Stack,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconPackage, IconLock, IconUser } from '@tabler/icons-react';
import { authService } from '../../services/authService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      usernameOrEmail: '',
      password: '',
    },
    validate: {
      usernameOrEmail: (value) => (value.trim().length < 1 ? 'Username is required' : null),
      password: (value) => (value.length < 1 ? 'Password is required' : null),
    },
  });

const handleSubmit = async (values: { usernameOrEmail: string; password: string }) => {
  setLoading(true);
  setError(null);
  try {
    const response = await authService.login(values);
    const token = response.data.data.accessToken;  // ← fixed
    localStorage.setItem('token', token);

    // Optional: store user info too
    localStorage.setItem('user', JSON.stringify(response.data.data));

    navigate('/dashboard');
  } catch (err: any) {
    const message =
      err.response?.data?.message ||
      err.response?.data ||
      'Invalid username or password. Please try again.';
    setError(typeof message === 'string' ? message : 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f1923 0%, #1a2a3a 50%, #0f1923 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative elements */}
      <Box
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(24,100,171,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(24,100,171,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Grid pattern overlay */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      <Paper
        shadow="xl"
        p={0}
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Top accent bar */}
        <Box
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #1864ab, #339af0, #1864ab)',
            backgroundSize: '200% 100%',
          }}
        />

        <Box p="xl">
          {/* Logo / Brand */}
          <Stack align="center" mb="xl" gap="xs">
            <Box
              style={{
                width: 56,
                height: 56,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #1864ab 0%, #339af0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(24,100,171,0.4)',
              }}
            >
              <IconPackage size={28} color="white" stroke={1.5} />
            </Box>

            <Box ta="center">
              <Title
                order={2}
                style={{
                  color: '#ffffff',
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                  fontSize: '1.5rem',
                }}
              >
                SOSPL
              </Title>
              <Text
                size="xs"
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                Inventory Management
              </Text>
            </Box>
          </Stack>

          {/* Welcome text */}
          <Box mb="lg">
            <Title
              order={4}
              style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginBottom: 4 }}
            >
              Welcome back
            </Title>
            <Text size="sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Sign in to your account to continue
            </Text>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              mb="md"
              style={{
                background: 'rgba(250,82,82,0.1)',
                border: '1px solid rgba(250,82,82,0.2)',
              }}
              styles={{ message: { color: '#ff8787' } }}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Username"
                placeholder="Enter your username"
                leftSection={<IconUser size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />}
                {...form.getInputProps('usernameOrEmail')}
                styles={{
                  label: { color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 500, marginBottom: 6 },
                  input: {
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    borderRadius: '8px',
                    '&:focus': {
                      borderColor: '#339af0',
                    },
                    '&::placeholder': {
                      color: 'rgba(255,255,255,0.25)',
                    },
                  },
                  error: { color: '#ff8787' },
                }}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                leftSection={<IconLock size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />}
                {...form.getInputProps('password')}
                styles={{
                  label: { color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 500, marginBottom: 6 },
                  input: {
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    borderRadius: '8px',
                  },
                  innerInput: { color: '#ffffff' },
                  visibilityToggle: { color: 'rgba(255,255,255,0.3)' },
                  error: { color: '#ff8787' },
                }}
              />

              <Button
                type="submit"
                fullWidth
                loading={loading}
                mt="xs"
                size="md"
                style={{
                  background: 'linear-gradient(135deg, #1864ab 0%, #339af0 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  letterSpacing: '0.3px',
                  height: '44px',
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(24,100,171,0.4)',
                  transition: 'all 0.2s ease',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Stack>
          </form>

          {/* Footer */}
          <Group justify="center" mt="xl">
            <Text size="xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              © {new Date().getFullYear()} SOSPL · All rights reserved
            </Text>
          </Group>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;