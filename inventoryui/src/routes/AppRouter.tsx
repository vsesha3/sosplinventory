import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/login/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import UsersPage from '../pages/users/UsersPage';
import RolesPage from '../pages/roles/RolesPage';
import PermissionsPage from '../pages/permissions/PermissionsPage';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';

// Masters
import CountryPage           from '../pages/masters/CountryPage';
import TransporterPage       from '../pages/masters/TransporterPage';
import ProductGroupPage      from '../pages/masters/ProductGroupPage';
import RmGroupPage           from '../pages/masters/RmGroupPage';
import PmGroupPage           from '../pages/masters/PmGroupPage';
import UomPage               from '../pages/masters/UomPage';
import CustomerPage          from '../pages/masters/CustomerPage';
import ProductPage           from '../pages/masters/ProductPage';
import RawMaterialPage       from '../pages/masters/RawMaterialPage';
import PackingMaterialPage   from '../pages/masters/PackingMaterialPage';
import SupplierPage          from '../pages/masters/SupplierPage';
import CapitalGoodsPage      from '../pages/masters/CapitalGoodsPage';
import LabTestPage           from '../pages/masters/LabTestPage';
import SubitemPage           from '../pages/masters/SubitemPage';
import MiscellaneousPage     from '../pages/masters/MiscellaneousPage';
import BrandPage             from '../pages/masters/BrandPage';

// Procurement — folder stays as pages/purchase-order/
import PurchaseOrderPage     from '../pages/purchase-order/PurchaseOrderPage';
import SalesOrderPage from '../pages/sales-order/SalesOrderPageList';

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>

          {/* Root */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* User Management */}
          <Route path="/users"       element={<UsersPage />} />
          <Route path="/roles"       element={<RolesPage />} />
          <Route path="/permissions" element={<PermissionsPage />} />

          {/* Procurement — nav shows under "Procurement" group, files live in pages/purchase-order/ */}
            <Route path="/procurement/purchase-orders" element={<PurchaseOrderPage />} />
            <Route path="/commercial/sales-orders" element={<SalesOrderPage />} />

          {/* Masters */}
          <Route path="/masters/country"           element={<CountryPage />} />
          <Route path="/masters/transporter"       element={<TransporterPage />} />
          <Route path="/masters/product-group"     element={<ProductGroupPage />} />
          <Route path="/masters/rm-group"          element={<RmGroupPage />} />
          <Route path="/masters/pm-group"          element={<PmGroupPage />} />
          <Route path="/masters/uom"               element={<UomPage />} />
          <Route path="/masters/customer"          element={<CustomerPage />} />
          <Route path="/masters/product"           element={<ProductPage />} />
          <Route path="/masters/raw-material"      element={<RawMaterialPage />} />
          <Route path="/masters/packing-material"  element={<PackingMaterialPage />} />
          <Route path="/masters/supplier"          element={<SupplierPage />} />
          <Route path="/masters/capital-goods"     element={<CapitalGoodsPage />} />
          <Route path="/masters/lab-test"          element={<LabTestPage />} />
          <Route path="/masters/subitem"           element={<SubitemPage />} />
          <Route path="/masters/miscellaneous"     element={<MiscellaneousPage />} />
          <Route path="/masters/brand"             element={<BrandPage />} />

        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
