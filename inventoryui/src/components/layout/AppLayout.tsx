import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppShell, NavLink, Text, Group, Button, Box, ScrollArea,
  Burger, Divider, Avatar,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconDashboard, IconUsers, IconShield, IconKey, IconLogout,
  IconChevronDown, IconSettings, IconDatabase,
  IconTruck, IconBox, IconFlask, IconPackage,
  IconBuildingStore, IconCategory, IconScale,
  IconUser, IconBuildingWarehouse, IconTag,
  IconAtom, IconReceipt, IconStack2,
  IconShoppingCart, IconClipboardList,IconBriefcase,IconFileInvoice,
  IconCalendarStats,
  IconClipboardData,IconFileText 
  
} from '@tabler/icons-react';

// ── Nav Structure ─────────────────────────────────────────────────────────────

const navGroups = [
  {
    group: null,
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
    group: 'Procurement',
    icon: <IconShoppingCart size={17} />,
    items: [
      { label: 'Purchase Orders', path: '/procurement/purchase-orders', icon: <IconClipboardList size={17} /> },
      { label: 'RM Request', path: '/procurement/rm-request', icon: <IconFileText size={17} /> },
      // Uncomment as you build each:
      // { label: 'RM Request',    path: '/procurement/rm-request',    icon: <IconFileText size={17} /> },
      // { label: 'RM Inward',     path: '/procurement/rm-inward',     icon: <IconPackageImport size={17} /> },
      // { label: 'RM Outward',    path: '/procurement/rm-outward',    icon: <IconPackageExport size={17} /> },
      // { label: 'Consumption',   path: '/procurement/consumption',   icon: <IconChartBar size={17} /> },
    ],
  },
  {
  group: 'Commercial',
  icon: <IconBriefcase size={17} />,
  items: [
    { label: 'Sales /Work Orders', path: '/commercial/sales-orders', icon: <IconFileInvoice size={17} /> },
    // { label: 'Quotations',      path: '/commercial/quotations',       icon: <IconFileText size={17} /> },
    // { label: 'Dispatch Orders', path: '/commercial/dispatch-orders',  icon: <IconTruck size={17} /> },
    // { label: 'Delivery Notes',  path: '/commercial/delivery-notes',   icon: <IconPackageExport size={17} /> },
    // { label: 'Invoices',        path: '/commercial/invoices',         icon: <IconReceipt size={17} /> },
  ],
},
{
  group: 'Operations',
  icon: <IconSettings size={17} />,
  items: [
    { label: 'Production Plan',       path: '/operations/production-plan',   icon: <IconCalendarStats size={17} /> },
    { label: 'Production Entry',      path: '/operations/production-entry',  icon: <IconClipboardData size={17} /> },
    { label: 'Lab Testing',           path: '/operations/lab-testing',       icon: <IconFlask size={17} /> },
    // { label: 'Quality Control',    path: '/operations/quality-control',   icon: <IconShieldCheck size={17} /> },
    // { label: 'Batch Records',      path: '/operations/batch-records',     icon: <IconNotes size={17} /> },
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

// ── Helpers ───────────────────────────────────────────────────────────────────

const getPageTitle = (pathname: string): string => {
  for (const section of navGroups) {
    for (const item of section.items) {
      if (pathname === item.path || pathname.startsWith(item.path + '/')) {
        return item.label;
      }
    }
  }
  return 'SOSPL IMS';
};

const NAVBAR_WIDTH = 250;
const HEADER_HEIGHT = 56;

// ── Component ─────────────────────────────────────────────────────────────────

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [openGroups, setOpenGroups] = useState<string[]>(['User Management']);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); }
    catch { return {}; }
  })();

  const pageTitle = getPageTitle(location.pathname);

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const isGroupActive = (items: { path: string }[]) =>
    items.some((item) => location.pathname.startsWith(item.path));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    if (mobileOpened) toggleMobile();
  };

  // ── Sidebar ───────────────────────────────────────────────────────────────

  const navContent = (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box px="sm" py="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
        <Text fw={800}>SOSPL IMS</Text>
        <Text size="xs" c="dimmed">Inventory Management System</Text>
      </Box>

      <ScrollArea flex={1} scrollbarSize={4} py="xs" px={4}>
        {navGroups.map((section) => {
          // Ungrouped items (Dashboard)
          if (!section.group) {
            return section.items.map((item) => (
              <NavLink
                key={item.path}
                label={item.label}
                leftSection={item.icon}
                active={location.pathname === item.path}
                onClick={() => handleNavClick(item.path)}
                mb={2}
              />
            ));
          }

          const isOpen = openGroups.includes(section.group);
          const groupActive = isGroupActive(section.items);

          return (
            <Box key={section.group} mb={4}>
              <NavLink
                label={section.group}
                leftSection={section.icon}
                rightSection={
                  <IconChevronDown
                    size={14}
                    style={{
                      transition: 'transform 0.2s ease',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                }
                active={groupActive && !isOpen}
                onClick={() => toggleGroup(section.group!)}
              />
              {isOpen && (
                <Box ml="sm" pl="sm" style={{ borderLeft: '2px solid var(--mantine-color-gray-3)' }}>
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      label={item.label}
                      leftSection={item.icon}
                      active={location.pathname === item.path}
                      onClick={() => handleNavClick(item.path)}
                      mb={2}
                    />
                  ))}
                </Box>
              )}
            </Box>
          );
        })}
      </ScrollArea>

      <Box p="sm" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
        <Group mb="sm">
          <Avatar radius="xl" size="sm">
            {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Text size="sm" fw={600}>{user.fullName || user.username || 'User'}</Text>
            <Text size="xs" c="dimmed">{user.email || ''}</Text>
          </Box>
        </Group>
        <Button
          leftSection={<IconLogout size={15} />}
          variant="light"
          color="red"
          onClick={handleLogout}
          fullWidth
          size="xs"
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  // ── Layout ────────────────────────────────────────────────────────────────

  return (
    <AppShell
      header={{ height: HEADER_HEIGHT }}
      navbar={{
        width: NAVBAR_WIDTH,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding={0}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
            <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
            <Divider orientation="vertical" />
            <Text fw={600} size="sm">{pageTitle}</Text>
          </Group>
          <Text size="xs" c="dimmed" visibleFrom="sm">
            Welcome, {user.fullName || user.username || 'User'}
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p={0}>{navContent}</AppShell.Navbar>

      <AppShell.Main
        style={{
          backgroundColor: 'var(--mantine-color-gray-0)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Box
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: '24px',
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};

export default AppLayout;
