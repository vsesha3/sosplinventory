import React, { useEffect } from 'react';
import { Notification, Loader, Box } from '@mantine/core';
import {
  IconCheck,
  IconX
 
} from '@tabler/icons-react';

// ── Types ─────────────────────────────────────────────────────────────────────

export type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

export interface SaveStatusBannerProps {
  status:       SaveStatus;
  savingMessage?:  string;
  successMessage?: string;
  errorMessage?:   string;
  autoDismissMs?:  number;   // ms after success/error to auto-reset to idle (default 3000)
  onDismiss?:      () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const SaveStatusBanner: React.FC<SaveStatusBannerProps> = ({
  status,
  savingMessage  = 'Saving, please wait...',
  successMessage = 'Saved successfully!',
  errorMessage   = 'Save failed. Please try again.',
  autoDismissMs  = 3000,
  onDismiss,
}) => {
  // Auto-dismiss after success or error
  useEffect(() => {
    if (status !== 'success' && status !== 'error') return;
    const timer = setTimeout(() => onDismiss?.(), autoDismissMs);
    return () => clearTimeout(timer);
  }, [status, autoDismissMs, onDismiss]);

  if (status === 'idle') return null;

  return (
    <Box
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        minWidth: 300,
        maxWidth: 420,
      }}
    >
      {status === 'saving' && (
        <Notification
          loading
          withCloseButton={false}
          color="blue"
          title="Saving"
          icon={<Loader size={16} />}
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
        >
          {savingMessage}
        </Notification>
      )}

      {status === 'success' && (
        <Notification
          color="green"
          title="Success"
          icon={<IconCheck size={18} />}
          onClose={onDismiss}
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
        >
          {successMessage}
        </Notification>
      )}

      {status === 'error' && (
        <Notification
          color="red"
          title="Error"
          icon={<IconX size={18} />}
          onClose={onDismiss}
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
        >
          {errorMessage}
        </Notification>
      )}
    </Box>
  );
};

export default SaveStatusBanner;