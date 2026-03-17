import { Modal, Text, Group, Button, Stack } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface ConfirmDialogProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmLabel?: string;   // defaults to "Save"
  title?: string;
}

export function ConfirmDialog({
  opened,
  onClose,
  onConfirm,
  message,
  confirmLabel = 'Save',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  title = 'Confirm',
}: ConfirmDialogProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={null}
      size="sm"
      centered
      withCloseButton={false}
      radius="md"
    >
      <Stack gap="lg" align="center" py="md" px="sm">

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

      </Stack>
    </Modal>
  );
}