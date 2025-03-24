import "./App.css";
import { useSelector } from "react-redux";
import ConsultancyProjectRegistrationForm from "./components/forms/ConsultancyProjectRegistrationForm";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ReusableComponent from "./pages/ReusableComponent";
import ProjectTable from "./pages/ProjectTable";
import ConsultancyProjectCompletionReport from "./components/forms/ConsultancyProjectCompletionReport";
import ChequeDepositForm from "./components/forms/ChequeDepositForm";
import FinalLetter from "./components/forms/FinalLetter";
import PaymentReceiptForm from "./components/forms/PaymentReceiptForm";
import WorkOrderFormPage from "./components/forms/WorkOrderFormPage";
import InvoiceForm from "./components/forms/BillOfSupply";
import Workorder from "./components/viewform/Workorder";
import OpenRoute from "./components/auth/OpenRoute";
import ConsentForm from "./components/viewform/ConsentForm.jsx";
import ConsentFormView from "./components/disabledForm/ConsentFormView.jsx";
import WorkFormView from "./components/disabledForm/WorkFormView.jsx";
import SingleProjectView from "./components/disabledForm/SingleProjectView.jsx";
import BillOfSupply from "./components/forms/BillOfSupply.jsx";
import Bill from "./components/viewform/Bill.jsx";

import AdminApp from "./AdminApp.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Notification from "./pages/Notification.jsx";
import PrivateRoute from "./components/auth/PrivateRoute.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import ComplaintForm from "./pages/ComplaintForm.jsx";
import UserManagement from "./components/admin/UserManagement.jsx";
import FormSearch from "./components/admin/FormSearch.jsx";
import ContactSection from "./components/admin/ContactSection.jsx";
import ProjectSection from "./components/admin/ProjectSection.jsx";
function App() {
  const { token, role } = useSelector((state) => state.auth);
  // const role = "admin";
  // if (role == "admin") {
  //   return <AdminApp />;
  // }
  return (
    <>
      {/* <Homepage /> */}
      {/* <Loginpage /> */}
      {/* <ProjectTable /> */}
      {/* <ConsultancyProjectRegistrationForm />
      <BillOfSupply />
      <ChequeDepositForm />
      <ConsultancyProjectCompletionReport />
      <FinalLetter />
      <PaymentReceiptForm />
      <WorkOrderFormPage /> */}
      {/* <InvoiceForm /> */}
      {/* <ProjectTable /> */}
      {/* <ConsentForm /> */}
      <Routes>
        <Route
          path="/home"
          element={
            <OpenRoute>
              <Homepage />
            </OpenRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminApp />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Loginpage />} />
        <Route
          path="contact-us"
          element={
            <ReusableComponent title="Contact Us" element={<ContactUs />} />
          }
        />
        <Route
          path="complaint-form"
          element={
            <ReusableComponent
              title="Complaint form"
              element={<ComplaintForm />}
            />
          }
        />

        <Route
          path="/create/consent-form"
          element={
            <OpenRoute>
              {" "}
              <ReusableComponent
                title="Consent form"
                element={<ConsultancyProjectRegistrationForm />}
              />
            </OpenRoute>
          }
        />
        <Route
          path="view/project/:abc"
          element={
            <ReusableComponent
              title="Project details"
              element={<SingleProjectView />}
            />
          }
        />
        <Route
          path="create/consent-form/:projectId"
          element={
            <OpenRoute>
              {" "}
              <ReusableComponent
                title="Consent form"
                element={<ConsultancyProjectRegistrationForm />}
              />
            </OpenRoute>
          }
        />
        <Route
          path="create/work-order/:projectId"
          element={
            <OpenRoute>
              {" "}
              <ReusableComponent
                title="Work Order"
                element={<WorkOrderFormPage />}
              />
            </OpenRoute>
          }
        />
        <Route
          path="/view/consent-form/:projectId"
          element={
            <OpenRoute>
              {" "}
              <ReusableComponent
                title="Consent Form: View"
                element={<ConsentFormView />}
              />
            </OpenRoute>
          }
        />
        <Route
          path="/view/work-order/:projectId"
          element={
            <OpenRoute>
              {" "}
              <ReusableComponent
                title="Work Order View"
                element={<WorkFormView />}
              />
            </OpenRoute>
          }
        />
        <Route
          path="work-order"
          element={
            <OpenRoute>
              <ReusableComponent
                title="Projects: Work Order"
                element={<Workorder />}
              />
            </OpenRoute>
          }
        />
        <Route
          path="consent-form"
          element={
            <ReusableComponent
              title="Projects: Consent Form"
              element={<ConsentForm />}
            />
          }
        />
        {/* <Route
          path=":formname"
          element={
            <OpenRoute>
              {" "}
              <ReusableComponent title="" element={<Bill />} />
            </OpenRoute>
          }
        /> */}
        <Route
          path="notification"
          element={
            <ReusableComponent
              title="Notification"
              element={<Notification />}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
        {/* ===================ADMIN===================== */}

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
    </>
  );
}

export default App;
