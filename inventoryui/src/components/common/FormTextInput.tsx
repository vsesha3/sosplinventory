import { TextInput } from '@mantine/core';

interface FormTextInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  maxLength?: number;
  leftSection?: React.ReactNode;
}

export function FormTextInput({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  readOnly = false,
  placeholder = '',
  maxLength,
  leftSection,
}: FormTextInputProps) {
  return (
    <TextInput
      label={
        required ? (
          <>
            <span style={{ color: 'red' }}>* </span>
            {label}
          </>
        ) : label
      }
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      maxLength={maxLength}
      leftSection={leftSection}
      size="sm"
      variant={readOnly ? 'filled' : 'default'}
      styles={{
        input: {
          cursor: readOnly ? 'default' : 'text',
        },
      }}
    />
  );
}