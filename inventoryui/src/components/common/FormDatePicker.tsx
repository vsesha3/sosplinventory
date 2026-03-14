import { Stack, Text } from '@mantine/core';
import type {  DateValue } from '@mantine/dates';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';

interface FormDatePickerProps {
  label: string;
  value: DateValue;                    // ← Mantine's DateValue type
  onChange: (value: DateValue) => void; // ← Mantine's DateValue type
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function FormDatePicker({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  readOnly = false,
  placeholder = 'DD-MMM-YYYY',
  minDate,
  maxDate,
}: FormDatePickerProps) {
  return (
    <Stack gap={4}>
      <Text size="sm" fw={500}>
        {required && <Text span c="red">* </Text>}
        {label}
      </Text>
      <DatePickerInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        leftSection={<IconCalendar size={15} />}
        valueFormat="DD-MMM-YYYY"
        size="sm"
        clearable
        disabled={disabled}
        readOnly={readOnly}
        minDate={minDate}
        maxDate={maxDate}
        variant={readOnly ? 'filled' : 'default'}
        popoverProps={{
          withinPortal: true,
          zIndex: 9999,
          position: 'bottom-start',
        }}
        styles={{
          input: {
            cursor: readOnly ? 'default' : 'pointer',
          },
        }}
      />
    </Stack>
  );
}