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


// ── Props ─────────────────────────────────────────────────────────────────────

export interface InwardReceiptLandingProps {
  opened:        boolean;
  onClose:       () => void;
  poRefNo:       number | null;
  poNo?:         string | null;
  poDate?:       string | null;
  materialType?: string | null;
  // May return a promise — resolve to false to signal a failed save
  onSave?:       (data: InwardReceiptFormData) => void | boolean | Promise<void | boolean>;
}

// ── Component ─────────────────────────────────────────────────────────────────

const InwardReceiptLanding: React.FC<InwardReceiptLandingProps> = ({
  opened,
  onClose,
  poRefNo,
  poNo,
  materialType,
  onSave,
  poDate,
}) => {

  type ViewMode = 'checking' | 'new-receipt' | 'receipt-list';

  const poDateRef = React.useRef<string | null | undefined>(poDate);

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
 poDateRef.current = poDate; 
 console.log(poDate, 'poDate in useEffect'); // Debug log to check poDate value
  const check = async () => {
    try {
      // No materialType filter: the PO passes its type code (RAW_MATERIAL) but receipts
      // store the label ("Raw material"), so the filter matched nothing. poRefNo is enough.
      const res = await api.get(
        `/api/inventory/material-receipt/summary/porefno/${poRefNo}`
      );

      const d   = res.data.data;
      const arr: any[] = Array.isArray(d)
        ? d
        : Array.isArray(d?.content) ? d.content : [];

      // The API can return every receipt (other POs, job inwards with poRefNo 0) —
      // only this PO's receipts decide list vs new-receipt
      const forThisPo = arr.filter(r => Number(r?.poRefNo) === Number(poRefNo));
      setViewMode(forThisPo.length === 0 ? 'new-receipt' : 'receipt-list');
    } catch {
      setViewMode('new-receipt');
    }
  };

  check();
}, [opened, poRefNo]); 



// eslint-disable-line react-hooks/exhaustive-deps

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
        poDate={poDate} // Pass the PO date to the form
        receiptDetId={null}        // ← Add mode: empty header + PO lines
        onSave={async (data) => {
          // Wait for the save before switching — otherwise the list loads before
          // the first receipt exists and shows nothing
          const ok = await onSave?.(data);
          if (ok !== false) setViewMode('receipt-list');
        }}
      />
    );
  }

  // ── Receipts exist → show MaterialReceiptListViewByPO ────────────────────

  return (
    <>
   
    <MaterialReceiptListViewByPO
      opened={opened}
      onClose={handleClose}
      poRefNo={poRefNo}
      poNo={poNo}
      poDate={poDate}
      materialType={materialType ?? undefined}
      onSaveReceipt={(data) => onSave?.(data)}
    />
    </>
  );
};

export default InwardReceiptLanding;