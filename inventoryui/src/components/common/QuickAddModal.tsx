import React from 'react';
import {
  Modal,
  Stack,
  TextInput,
  Group,
  Button,
} from '@mantine/core';

export interface QuickAddModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  saving: boolean;
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({
  opened,
  onClose,
  title,
  label,
  value,
  onChange,
  onSave,
  saving,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size="sm"
      zIndex={350}
      centered
    >
      <Stack gap="md">
        <TextInput
          label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
          required
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value.trim()) {
              onSave();
            }
          }}
        />

        <Group justify="flex-end" gap="sm">
          <Button
            variant="default"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            size="sm"
            loading={saving}
            disabled={!value.trim()}
            onClick={onSave}
          >
            Add
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default QuickAddModal;