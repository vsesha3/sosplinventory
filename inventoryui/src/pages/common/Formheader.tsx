import React from 'react';
import { Box, Text, Group, Button, Badge } from '@mantine/core';
import type { ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FormHeaderProps {
  title:        string;
  icon?:        ReactNode;
  color?:       string;             // background hex, defaults to #2c4a6e
  badge?:       string;             // optional badge text e.g. "PO Ref # 25786"
  badgeColor?:  string;
  onClose?:     () => void;
  closeLabel?:  string;
  actions?:     ReactNode;          // extra buttons on the right side
}

// ── Component ─────────────────────────────────────────────────────────────────

const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  icon,
  color = '#2c4a6e',
  badge,
  badgeColor,
  onClose,
  closeLabel = 'Cancel',
  actions,
}) => (
  <Box
    px="lg" py="sm"
    style={{
      backgroundColor: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}
  >
    {/* ── Left: icon + title + badge ── */}
    <Group gap="sm">
      {icon}
      <Text fw={700} size="md" c="white">{title}</Text>
      {badge && (
        <Badge
          variant="filled"
          size="sm"
          color={badgeColor}
          style={
            badgeColor
              ? undefined
              : { backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }
          }
        >
          {badge}
        </Badge>
      )}
    </Group>

    {/* ── Right: custom actions + close button ── */}
    <Group gap="xs">
      {actions}
      {onClose && (
        <Button size="xs" variant="white" color="dark" onClick={onClose}>
          {closeLabel}
        </Button>
      )}
    </Group>
  </Box>
);

export default FormHeader;