/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
    Modal, Paper, Box, Text, Group, Button, Stack,
} from '@mantine/core';
import { FormTextInput } from '../../components/common/FormTextInput';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import api from '../../services/api';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StockIssuanceLine {
    receiptId: number;
    lotNo: string | null;
    rmCode: string | null;
    rmName: string | null;
    totalQty: number | null;
    perUnitRate: number | null;
    issuedQty: number | null;
    remainingQty: number | null;
    receiptDate: string | null;
    grnNo: string | null;
    invoiceNo: string | null;
    requiredQty?: number | null;
    lotCount?: number;
}

export interface StockIssuanceEditModalProps {
    opened: boolean;
    onClose: () => void;
    item: StockIssuanceLine | null;
    onSaved: (updatedItem: StockIssuanceLine) => void;  // called after successful save
}

// ── Component ─────────────────────────────────────────────────────────────────

const StockIssuanceEditModal: React.FC<StockIssuanceEditModalProps> = ({
    opened,
    onClose,
    item,
    onSaved,
}) => {

    const [editIssuedQty, setEditIssuedQty] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const [issueMode, setIssueMode] = useState<'save' | 'issue'>('save');

    // ── Sync item into local state ────────────────────────────────────────────

    useEffect(() => {
        if (!opened || !item) {
            setEditIssuedQty('');
            setValidationErrors([]);
            return;
        }

        // ── Auto-populate if single lot and requiredQty is known ─────────────
        if (item.lotCount === 1 && item.requiredQty != null) {
            setEditIssuedQty(item.requiredQty.toFixed(3));
        } else {
            setEditIssuedQty(item.issuedQty != null ? String(item.issuedQty) : '');
        }
    }, [opened, item]);

    // ── Validation ────────────────────────────────────────────────────────────

    const validate = (): string[] => {
        const errors: string[] = [];
        const qty = parseFloat(editIssuedQty);
        if (!editIssuedQty || isNaN(qty))
            errors.push('Issued Quantity is required');
        else if (qty <= 0)
            errors.push('Issued Quantity must be greater than 0');
        else if (item?.totalQty != null && qty > item.totalQty)
            errors.push(`Issued Quantity cannot exceed Total Qty (${item.totalQty.toFixed(3)})`);
        return errors;
    };

    const handleSaveClick = (mode: 'save' | 'issue' = 'save') => {
        const errors = validate();
        if (errors.length > 0) {
            setValidationErrors(errors);
            return;
        }
        setValidationErrors([]);
        setIssueMode(mode);
        setConfirmOpen(true);
    };

    const handleConfirm = async () => {
        if (!item) return;
        setSaveLoading(true);
        try {
            const qty = parseFloat(editIssuedQty);

            if (issueMode === 'issue') {
                // TODO: call issue endpoint
                // await api.post(`/api/inventory/rm-stock/${item.receiptId}/issue`, {
                //   issuedQty: qty,
                // });
                console.log('[IssueMaterial] payload:', { receiptId: item.receiptId, issuedQty: qty });
            } else {
                // TODO: call save/update endpoint
                // await api.put(`/api/inventory/rm-stock/${item.receiptId}`, {
                //   issuedQty: qty,
                // });
                console.log('[SaveIssuedQty] payload:', { receiptId: item.receiptId, issuedQty: qty });
            }

            const updatedItem: StockIssuanceLine = {
                ...item,
                issuedQty: qty,
                remainingQty: (item.totalQty ?? 0) - qty,
            };
            onSaved(updatedItem);
            onClose();
        } catch (err: any) {
            setValidationErrors([
                err?.response?.data?.message || 'Failed to save issued quantity.',
            ]);
        } finally {
            setSaveLoading(false);
            setConfirmOpen(false);
        }
    };

    if (!item) return null;

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <>
            <Modal
                opened={opened}
                onClose={onClose}
                title={null}
                size="sm"
                padding={0}
                radius="md"
                withCloseButton={false}
                zIndex={300}
                styles={{ body: { padding: 0 } }}
            >
                <Paper withBorder radius="md"
                    style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                    {/* ── Header ── */}
                    <Box px="lg" py="sm"
                        style={{
                            backgroundColor: '#2c6e49',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between',
                            flexShrink: 0,
                        }}>
                        <Group gap="sm">
                            <Text fw={700} size="sm" c="white">
                                Edit Stock Issuance
                            </Text>
                            {item.lotNo && (
                                <Text size="xs" c="white" opacity={0.8}>
                                    Lot: {item.lotNo}
                                </Text>
                            )}
                        </Group>
                    </Box>

                    {/* ── Body — all readonly except issuedQty ── */}
                    <Box p="lg">
                        <Stack gap="sm">

                            <FormTextInput
                                label="RM Name"
                                value={item.rmName ?? ''}
                                onChange={() => { }}
                                readOnly
                            />

                            <FormTextInput
                                label="Lot No"
                                value={item.lotNo ?? ''}
                                onChange={() => { }}
                                readOnly
                            />

                            <Group grow>
                                <FormTextInput
                                    label="Total Qty"
                                    value={item.totalQty != null ? item.totalQty.toFixed(3) : ''}
                                    onChange={() => { }}
                                    readOnly
                                />
                                <FormTextInput
                                    label="Remaining Qty"
                                    value={item.remainingQty != null ? item.remainingQty.toFixed(3) : ''}
                                    onChange={() => { }}
                                    readOnly
                                />
                                {item.requiredQty != null && (
                                    <FormTextInput
                                        label="Required Qty"
                                        value={item.requiredQty.toFixed(3)}
                                        onChange={() => { }}
                                        readOnly
                                    />
                                )}
                            </Group>

                            <Group grow>
                                <FormTextInput
                                    label="Invoice No"
                                    value={item.invoiceNo ?? ''}
                                    onChange={() => { }}
                                    readOnly
                                />
                                <FormTextInput
                                    label="Receipt Date"
                                    value={item.receiptDate ?? ''}
                                    onChange={() => { }}
                                    readOnly
                                />
                            </Group>

                            {/* ── Editable field ── */}
                            <FormTextInput
                                label="* Issued Quantity"
                                value={editIssuedQty}
                                onChange={e => {
                                    setEditIssuedQty(e.target.value);
                                    setValidationErrors([]);
                                }}
                                placeholder="0.000"
                                required
                            />

                            {/* Inline validation errors */}
                            {validationErrors.length > 0 && (
                                <Box>
                                    {validationErrors.map((err, i) => (
                                        <Text key={i} size="xs" c="red">{err}</Text>
                                    ))}
                                </Box>
                            )}

                        </Stack>
                    </Box>

                    {/* ── Footer — always pinned ── */}
                    {/* ── Footer — always pinned ── */}
                    <Box px="lg" py="sm"
                        style={{
                            borderTop: '1px solid var(--mantine-color-gray-3)',
                            backgroundColor: 'var(--mantine-color-body)',
                            flexShrink: 0,
                        }}>
                        <Group justify="space-between" gap="sm">
                            <Button variant="default" size="sm" onClick={onClose}>
                                Cancel
                            </Button>
                            <Group gap="sm">
                                <Button
                                    size="sm"
                                    variant="light"
                                    color="blue"
                                    loading={saveLoading && issueMode === 'save'}
                                    onClick={() => handleSaveClick('save')}
                                >
                                    Save
                                </Button>
                                <Button
                                    size="sm"
                                    color="green"
                                    loading={saveLoading && issueMode === 'issue'}
                                    onClick={() => handleSaveClick('issue')}
                                >
                                    Issue Material
                                </Button>
                            </Group>
                        </Group>
                    </Box>

                </Paper>
            </Modal>

            {/* ── Confirm before saving ── */}
            <ConfirmDialog
                opened={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirm}
                message={`Are you sure you want to update issued quantity to ${editIssuedQty} for lot: ${item.lotNo ?? item.receiptId}?`}
                confirmLabel="Save"
                zIndex={350}
                errors={[]}
            />
        </>
    );
};

export default StockIssuanceEditModal;