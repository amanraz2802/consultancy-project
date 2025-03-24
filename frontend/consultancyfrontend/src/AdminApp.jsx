import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "./store"; // You would need to create this
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import Dashboard from "./components/admin/Dashboard";
import UserManagement from "./components/admin/UserManagement";
import FormSearch from "./components/admin/FormSearch";
import ContactSection from "./components/admin/ContactSection";
import ProjectSection from "./components/admin/ProjectSection";

function AdminApp() {
  return (
    // <Provider store={store}>
    <Routes>
      <Route
        path="/"
        element={
          <AdminDashboard title="Dashboard">
            <Dashboard />
          </AdminDashboard>
        }
      />

      <Route
        path="/admin/userManagement"
        element={
          <AdminDashboard title="User Management">
            <UserManagement />
          </AdminDashboard>
        }
      />

      <Route
        path="/admin/consentForms"
        element={
          <AdminDashboard title="Consent Forms">
            <FormSearch formType="consult" />
          </AdminDashboard>
        }
      />

      <Route
        path="/admin/workOrders"
        element={
          <AdminDashboard title="Work Orders">
            <FormSearch formType="work" />
          </AdminDashboard>
        }
      />

      <Route
        path="/admin/billOfSupply"
        element={
          <AdminDashboard title="Bill of Supply">
            <FormSearch formType="bill" />
          </AdminDashboard>
        }
      />

      <Route
        path="/admin/paymentDetails"
        element={
          <AdminDashboard title="Payment Details">
            <FormSearch formType="payment" />
          </AdminDashboard>
        }
      />

      <Route
        path="/admin/vouchers"
        element={
          <AdminDashboard title="Vouchers">
            <FormSearch formType="voucher" />
          </AdminDashboard>
        }
      />

      <Route
        path="/admin/closureForms"
        element={
          <AdminDashboard title="Closure Forms">
            <FormSearch formType="closure" />
          </AdminDashboard>
        }
      />

      <Route
        path="/admin/contacts"
        element={
          <AdminDashboard title="Contacts">
            <ContactSection />
          </AdminDashboard>
        }
      />

      <Route
        path="/admin/projects"
        element={
          <AdminDashboard title="Projects">
            <ProjectSection />
          </AdminDashboard>
        }
      />
    </Routes>
    // </Provider>
  );
}

export default AdminApp;
