import { Textarea } from '@mantine/core';

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  maxLength?: number;
}

export function FormTextarea({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  readOnly = false,
  placeholder = '',
  minRows = 3,
  maxRows,
  maxLength,
}: FormTextareaProps) {
  return (
    <Textarea
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
      minRows={minRows}
      maxRows={maxRows}
      maxLength={maxLength}
      size="sm"
      variant={readOnly ? 'filled' : 'default'}
      styles={{
        input: {
          cursor: readOnly ? 'default' : 'text',
          resize: 'vertical',
        },
      }}
    />
  );
}