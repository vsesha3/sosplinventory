/**
 * ── Integration snippet for MaterialRequestView ──────────────────────────────
 *
 * Add these pieces to your existing MaterialRequestView component.
 */

import React, { useState } from 'react';
import  { type MaterialRequestFormData } from '../../types/MaterialRequest.types';
import api from '../../services/api';
import { notifications } from '@mantine/notifications';
import MaterialRequestForm from './MaterialRequestForm';

// ── Inside your MaterialRequestView component ─────────────────────────────────

const MaterialRequestViewExample: React.FC = () => {

  const [formOpen, setFormOpen]       = useState(false);
  const [formMode, setFormMode]       = useState<'create' | 'update'>('create');
  const [editingId, setEditingId]     = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Replace with your actual list-reload function
  const reloadList = async () => {
    // e.g. await fetchMaterialRequests();
  };

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleAdd = () => {
    setFormMode('create');
    setEditingId(null);
    setFormOpen(true);
  };

  const handleEdit = () => {
    if (selectedRows.length !== 1) {
      notifications.show({
        color: 'yellow',
        message: 'Please select exactly one row to edit',
      });
      return;
    }
    setFormMode('update');
    setEditingId(selectedRows[0]);   // form will fetch full record from backend
    setFormOpen(true);
  };

  const handleSave = async (data: MaterialRequestFormData) => {
    try {
      const payload = {
        rmReqId:             data.rmReqId,
        rmReqDate:           data.rmReqDate?.toISOString() ?? null,
        scheduleDate:        data.scheduleDate?.toISOString() ?? null,
        woId:                data.woId ? Number(data.woId) : null,
        planToProdQty:       data.planToProdQty ? Number(data.planToProdQty) : null,
        productionLotNumber: data.productionLotNumber || null,
        ginNo:               data.ginNo || null,
        requestBy:           data.requestBy,
        productionPlanId:    data.productionPlanId,
        isRmIssueCompleted:  data.isRmIssueCompleted,
      };

      if (formMode === 'update' && data.rmReqId) {
        await api.put(`/api/inventory/rm-request/${data.rmReqId}`, payload);
        notifications.show({ color: 'green', message: 'Material Request updated successfully' });
      } else {
        await api.post('/api/inventory/rm-request', payload);
        notifications.show({ color: 'green', message: 'Material Request created successfully' });
      }

      setFormOpen(false);
      setSelectedRows([]);
      await reloadList();
    } catch (err) {
      console.error(err);
      notifications.show({ color: 'red', message: 'Failed to save Material Request' });
    }
  };

  // ── In your JSX, wire up MasterTable and render the Form ─────────────────

  return (
    <>
      {/*
        <MasterTable
          ...existing props...
          onAdd={handleAdd}
          onEdit={handleEdit}
          selectedCount={selectedRows.length}
        />
      */}

      <MaterialRequestForm
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        mode={formMode}
        rmReqId={editingId}
        onSave={handleSave}
      />
    </>
  );
};

export default MaterialRequestViewExample;