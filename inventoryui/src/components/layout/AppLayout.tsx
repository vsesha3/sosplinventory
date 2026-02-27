import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppShell, NavLink, Text, Group, Button, Box, ScrollArea,
} from '@mantine/core';
import {
  IconDashboard, IconUsers, IconShield, IconKey, IconLogout,
  IconChevronDown, IconSettings, IconDatabase,
  IconTruck, IconBox, IconFlask, IconPackage,
  IconBuildingStore, IconCategory, IconScale,
  IconUser, IconBuildingWarehouse, IconTag,
  IconAtom, IconReceipt, IconStack2,
} from '@tabler/icons-react';

// ─── Nav Structure ─────────────────────────────────────────────────────────────

const navGroups = [
  {
    group: null, // root level
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: <IconDashboard size={17} /> },
    ],
  },
  {
    group: 'User Management',
    icon: <IconSettings size={17} />,
    items: [
      { label: 'Users',       path: '/users',       icon: <IconUsers size={17} /> },
      { label: 'Roles',       path: '/roles',       icon: <IconShield size={17} /> },
      { label: 'Permissions', path: '/permissions', icon: <IconKey size={17} /> },
    ],
  },
  {
    group: 'Masters',
    icon: <IconDatabase size={17} />,
    items: [
      { label: 'Country Master',          path: '/masters/country',          icon: <IconTag size={17} /> },
      { label: 'Transporter Master',      path: '/masters/transporter',      icon: <IconTruck size={17} /> },
      { label: 'Product Group Master',    path: '/masters/product-group',    icon: <IconCategory size={17} /> },
      { label: 'RM Group Master',         path: '/masters/rm-group',         icon: <IconAtom size={17} /> },
      { label: 'PM Group Master',         path: '/masters/pm-group',         icon: <IconStack2 size={17} /> },
      { label: 'UOM Master',              path: '/masters/uom',              icon: <IconScale size={17} /> },
      { label: 'Customer Master',         path: '/masters/customer',         icon: <IconUser size={17} /> },
      { label: 'Product Master',          path: '/masters/product',          icon: <IconBox size={17} /> },
      { label: 'Raw Material Master',     path: '/masters/raw-material',     icon: <IconAtom size={17} /> },
      { label: 'Packing Material Master', path: '/masters/packing-material', icon: <IconPackage size={17} /> },
      { label: 'Supplier Master',         path: '/masters/supplier',         icon: <IconBuildingStore size={17} /> },
      { label: 'Capital Goods Master',    path: '/masters/capital-goods',    icon: <IconBuildingWarehouse size={17} /> },
      { label: 'Lab Test Master',         path: '/masters/lab-test',         icon: <IconFlask size={17} /> },
      { label: 'Subitem Master',          path: '/masters/subitem',          icon: <IconReceipt size={17} /> },
      { label: 'Miscellaneous Master',    path: '/masters/miscellaneous',    icon: <IconTag size={17} /> },
      { label: 'Brand Master',            path: '/masters/brand',            icon: <IconTag size={17} /> },
    ],
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Track which groups are open
  const [openGroups, setOpenGroups] = useState<string[]>(['User Management']);

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const isGroupActive = (items: { path: string }[]) =>
    items.some((item) => location.pathname.startsWith(item.path));

  return (
    <AppShell navbar={{ width: 250, breakpoint: 'sm' }} padding="md">
      <AppShell.Navbar p="xs" style={{ display: 'flex', flexDirection: 'column' }}>

        {/* Brand */}
        <Box px="sm" py="md" mb="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
          <Text fw={800} size="md" style={{ letterSpacing: '-0.3px' }}>SOSPL IMS</Text>
          <Text size="xs" c="dimmed">Inventory Management</Text>
        </Box>

        {/* Nav Items */}
        <ScrollArea flex={1} scrollbarSize={4}>
          {navGroups.map((section) => {
            // Root level (no group header)
            if (!section.group) {
              return section.items.map((item) => (
                <NavLink
                  key={item.path}
                  label={item.label}
                  leftSection={item.icon}
                  active={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  mb={2}
                  style={{ borderRadius: 6 }}
                />
              ));
            }

            // Grouped sections
            const isOpen = openGroups.includes(section.group);
            const groupActive = isGroupActive(section.items);

            return (
              <Box key={section.group} mb={4}>
                {/* Group Header */}
                <NavLink
                  label={
                    <Text fw={600} size="sm">
                      {section.group}
                    </Text>
                  }
                  leftSection={section.icon}
                  rightSection={
                    <IconChevronDown
                      size={14}
                      style={{
                        transition: 'transform 0.2s',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  }
                  active={groupActive && !isOpen}
                  onClick={() => toggleGroup(section.group!)}
                  style={{ borderRadius: 6 }}
                />

                {/* Group Children */}
                {isOpen && (
                  <Box
                    ml="sm"
                    pl="sm"
                    style={{ borderLeft: '2px solid var(--mantine-color-gray-3)' }}
                  >
                    {section.items.map((item) => (
                      <NavLink
                        key={item.path}
                        label={item.label}
                        leftSection={item.icon}
                        active={location.pathname === item.path}
                        onClick={() => navigate(item.path)}
                        mb={2}
                        size="sm"
                        style={{ borderRadius: 6, fontSize: 13 }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            );
          })}
        </ScrollArea>

        {/* Logout */}
        <Box pt="xs" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
          <Button
            leftSection={<IconLogout size={16} />}
            variant="subtle"
            color="red"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
            fullWidth
          >
            Logout
          </Button>
        </Box>

      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default AppLayout;
