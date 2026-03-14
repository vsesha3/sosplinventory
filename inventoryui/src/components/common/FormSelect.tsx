import { Select } from '@mantine/core';

interface FormSelectProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  data: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
}

export function FormSelect({
  label,
  value,
  onChange,
  data,
  required = false,
  disabled = false,
  readOnly = false,
  placeholder = 'Select...',
  searchable = false,
  clearable = false,
}: FormSelectProps) {
  return (
    <Select
      label={
        required ? (
          <>
            <span style={{ color: 'red' }}>* </span>
            {label}
          </>
        ) : label
      }
      value={value}
      onChange={readOnly ? undefined : onChange}
      data={data}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      searchable={searchable}
      clearable={clearable}
      size="sm"
      variant={readOnly ? 'filled' : 'default'}
      comboboxProps={{
        withinPortal: true,        // ← fixes dropdown clipping inside modal
        zIndex: 9999,              // ← renders above modal
      }}
      styles={{
        input: {
          cursor: readOnly ? 'default' : 'pointer',
        },
      }}
    />
  );
}