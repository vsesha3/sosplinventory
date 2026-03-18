/* eslint-disable @typescript-eslint/no-unused-vars */
import { Modal, Text, Group, Button, Stack, List, ThemeIcon, Alert } from '@mantine/core';
import { IconAlertCircle, IconCircleX } from '@tabler/icons-react';

interface ConfirmDialogProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmLabel?: string;
  title?: string;
  zIndex?: number;
  // Validation errors — if provided, shows error list instead of confirm buttons
  errors?: string[];
}

export function ConfirmDialog({
  opened,
  onClose,
  onConfirm,
  message,
  confirmLabel = 'Save',

  zIndex = 400,
  errors = [],
}: ConfirmDialogProps) {

  const hasErrors = errors.length > 0;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={null}
      size="sm"
      centered
      withCloseButton={false}
      radius="md"
      zIndex={zIndex}
    >
      <Stack gap="lg" align="center" py="md" px="sm">

        {hasErrors ? (
          // ── Validation error mode ──────────────────────────────────────
          <>
            <ThemeIcon size={48} radius="xl" color="red" variant="light">
              <IconCircleX size={28} />
            </ThemeIcon>

            <Stack gap="xs" w="100%">
              <Text size="sm" fw={600} ta="center" c="red">
                Please fix the following errors:
              </Text>
              <Alert color="red" variant="light" p="sm">
                <List size="sm" spacing={4}>
                  {errors.map((err, idx) => (
                    <List.Item key={idx}>
                      <Text size="sm">{err}</Text>
                    </List.Item>
                  ))}
                </List>
              </Alert>
            </Stack>

            <Button
              variant="default"
              size="sm"
              onClick={onClose}
              style={{ minWidth: 120 }}
            >
              Go Back & Fix
            </Button>
          </>
        ) : (
          // ── Confirm mode ───────────────────────────────────────────────
          <>
            <IconAlertCircle size={40} color="var(--mantine-color-blue-6)" />

            <Text size="sm" fw={500} ta="center" style={{ lineHeight: 1.6 }}>
              {message}
            </Text>

            <Group justify="center" gap="md" w="100%">
              <Button
                variant="default"
                size="sm"
                onClick={onClose}
                style={{ minWidth: 100 }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => { onConfirm(); onClose(); }}
                style={{ minWidth: 100 }}
              >
                {confirmLabel}
              </Button>
            </Group>
          </>
        )}

      </Stack>
    </Modal>
  );
}