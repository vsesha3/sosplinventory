/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Modal, Paper, Center, Loader, Text, Stack,
} from '@mantine/core';
import { IconClipboardList } from '@tabler/icons-react';
import FormHeader from '../common/Formheader';
import MaterialReceiptListViewByPO from './MaterialreceiptlistViewByPO';
import RawMaterialInwardReceipt from './Rawmaterialinwardreceipt';
import type { InwardReceiptFormData } from './Rawmaterialinwardreceipt';
import api from '../../services/api';
import { ConfirmDialog } from '../../components/common/ConfirmDialog'; // adjust path

// ── Props ─────────────────────────────────────────────────────────────────────

export interface InwardReceiptLandingProps {
  opened:        boolean;
  onClose:       () => void;
  poRefNo:       number | null;
  poNo?:         string | null;
  materialType?: string | null;
  onSave?:       (data: InwardReceiptFormData) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const InwardReceiptLanding: React.FC<InwardReceiptLandingProps> = ({
  opened,
  onClose,
  poRefNo,
  poNo,
  materialType,
  onSave,
}) => {

  type ViewMode = 'checking' | 'new-receipt' | 'receipt-list';

  const [viewMode, setViewMode] = useState<ViewMode>('checking');
const prevOpenedRef = React.useRef(false);

useEffect(() => {
  // Only run when transitioning from closed → open
  if (!opened) {
    prevOpenedRef.current = false;
    return;
  }
  if (prevOpenedRef.current) return;  // already ran for this open
  prevOpenedRef.current = true;

  if (!poRefNo) return;

  const check = async () => {
    try {
      const res = await api.get(
        `/api/inventory/material-receipt/summary/porefno/${poRefNo}`,
        { params: materialType ? { materialType } : {} }
      );

      const d   = res.data.data;
      const arr = Array.isArray(d)
        ? d
        : Array.isArray(d?.content) ? d.content : [];

      setViewMode(arr.length === 0 ? 'new-receipt' : 'receipt-list');
    } catch {
      setViewMode('new-receipt');
    }
  };

  check();
}, [opened, poRefNo]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Reset on close ────────────────────────────────────────────────────────

  const handleClose = () => {
  setViewMode('checking');   // safe here — called from event handler, not effect
  prevOpenedRef.current = false;
  onClose();
};

  // ── Render ────────────────────────────────────────────────────────────────

  // While checking — show a small loader modal
  if (!opened) return null;

  if (viewMode === 'checking') {
    return (
      <Modal
        opened={opened}
        onClose={handleClose}
        title={null}
        size="sm"
        padding={0}
        radius="md"
        withCloseButton={false}
        zIndex={200}
        styles={{ body: { padding: 0 } }}
      >
        <Paper withBorder radius="md">
          <FormHeader
            title={`Inward Receipt — PO: ${poNo ?? poRefNo}`}
            icon={<IconClipboardList size={18} color="white" />}
            color="#4a6fa5"
            onClose={handleClose}
          />
          <Center py={60}>
            <Stack align="center" gap="sm">
              <Loader size="md" />
              <Text size="sm" c="dimmed">Checking receipts for this PO...</Text>
            </Stack>
          </Center>
        </Paper>
      </Modal>
    );
  }

  // ── No receipts → open RawMaterialInwardReceipt directly ─────────────────

  if (viewMode === 'new-receipt') {
    return (
      <RawMaterialInwardReceipt
        opened={opened}
        onClose={handleClose}
        poRefNo={poRefNo}
        poNo={poNo}
        receiptDetId={null}        // ← Add mode: empty header + PO lines
        onSave={(data) => {
          onSave?.(data);
          // After save, switch to list view so user can see the new receipt
          setViewMode('receipt-list');
        }}
      />
    );
  }

  // ── Receipts exist → show MaterialReceiptListViewByPO ────────────────────

  return (
    <MaterialReceiptListViewByPO
      opened={opened}
      onClose={handleClose}
      poRefNo={poRefNo}
      poNo={poNo}
      materialType={materialType ?? undefined}
      onSaveReceipt={(data) => {
        onSave?.(data);
      }}
    />
  );
};

export default InwardReceiptLanding;