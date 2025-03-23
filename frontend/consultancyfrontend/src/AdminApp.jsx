import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "./store"; // You would need to create this
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import ReusableComponent from "./pages/ReusableComponent.jsx";
import Dashboard from "./components/admin/Dashboard";
import UserManagement from "./components/admin/UserManagement";
import FormSearch from "./components/admin/FormSearch";
import ContactSection from "./components/admin/ContactSection";
import ProjectSection from "./components/admin/ProjectSection";

function AdminApp() {
  return (
    // <Provider store={store}>

    <Routes>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route
        path="/consentForms"
        element={
          <ReusableComponent
            title="Consent Forms"
            element={<FormSearch formType="Consent Forms" />}
          />
        }
      />
      <Route
        path="/workOrders"
        element={
          <ReusableComponent
            title="Work Orders"
            element={<FormSearch formType="Work Orders" />}
          />
        }
      />
      <Route
        path="/billOfSupply"
        element={
          <ReusableComponent
            title="Bill of Supply"
            element={<FormSearch formType="Bill of Supply" />}
          />
        }
      />
      <Route
        path="/paymentDetails"
        element={
          <ReusableComponent
            title="Payment Details"
            element={<FormSearch formType="Payment Details" />}
          />
        }
      />
      <Route
        path="/vouchers"
        element={
          <ReusableComponent
            title="Vouchers"
            element={<FormSearch formType="Vouchers" />}
          />
        }
      />
      <Route
        path="/closureForms"
        element={
          <ReusableComponent
            title="Closure Forms"
            element={<FormSearch formType="Closure Forms" />}
          />
        }
      />
      <Route
        path="/contacts"
        element={
          <ReusableComponent title="Contacts" element={<ContactSection />} />
        }
      />
      <Route
        path="/projects"
        element={
          <ReusableComponent title="Projects" element={<ProjectSection />} />
        }
      />
      {/* <Route
        path="/"
        element={
          <ReusableComponent
            title="Dashboard"
            element={
              <AdminDashboard>
                <Dashboard />
              </AdminDashboard>
            }
          />
        }
      /> */}
    </Routes>

    // </Provider>
  );
}

export default AdminApp;
