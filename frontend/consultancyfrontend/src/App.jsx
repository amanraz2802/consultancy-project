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
import ComplaintDetails from "./pages/ComplaintDetails.jsx";
import IndexRoute from "./components/auth/IndexRoute.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import AdminRoute from "./components/auth/AdminRoute.jsx";
function App() {
  const { token, role } = useSelector((state) => state.auth);
  return (
    <>
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
      <WorkOrderFormPage />
      <InvoiceForm /> */}
        {/* <ProjectTable /> */}
        {/* <ConsentForm /> */}
      </>
      <Routes>
        <Route path="/" element={<IndexRoute />} />
        <Route path="/login" element={<Loginpage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route
          path="notification"
          element={
            <ReusableComponent
              title="Notification"
              element={<Notification />}
            />
          }
        />
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
          path="complain/:id"
          element={
            <ReusableComponent
              title="Complaint Detail"
              element={<ComplaintDetails />}
            />
          }
        />
        <Route
          path="view/project/:projectId"
          element={
            <ReusableComponent
              title="Project details"
              element={<SingleProjectView />}
            />
          }
        />
        {/* ==========================Consent-form route===================================== */}
        <Route
          path="consent-form"
          element={
            <ReusableComponent
              title="Projects: Consent Form"
              element={<ConsentForm />}
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

        {/* ==========================Work-order routes============================ */}
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

        {/* <Route
          path=":formname"
          element={
            <OpenRoute>
              {" "}
              <ReusableComponent title="" element={<Bill />} />
            </OpenRoute>
          }
        /> */}

        {/* ===================================ADMIN======================================== */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminApp />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/userManagement"
          element={
            <AdminRoute>
              <AdminDashboard title="User Management">
                <UserManagement />
              </AdminDashboard>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/consentForms"
          element={
            <AdminRoute>
              <AdminDashboard title="Consent Forms">
                <FormSearch formType="consult" />
              </AdminDashboard>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/workOrders"
          element={
            <AdminRoute>
              <AdminDashboard title="Work Orders">
                <FormSearch formType="work" />
              </AdminDashboard>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/billOfSupply"
          element={
            <AdminRoute>
              <AdminDashboard title="Bill of Supply">
                <FormSearch formType="bill" />
              </AdminDashboard>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/paymentDetails"
          element={
            <AdminRoute>
              <AdminDashboard title="Payment Details">
                <FormSearch formType="payment" />
              </AdminDashboard>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/vouchers"
          element={
            <AdminRoute>
              <AdminDashboard title="Vouchers">
                <FormSearch formType="voucher" />
              </AdminDashboard>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/closureForms"
          element={
            <AdminRoute>
              <AdminDashboard title="Closure Forms">
                <FormSearch formType="closure" />
              </AdminDashboard>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/contacts"
          element={
            <AdminRoute>
              <AdminDashboard title="Contacts">
                <ContactSection />
              </AdminDashboard>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/projects"
          element={
            <AdminRoute>
              <AdminDashboard title="Projects">
                <ProjectSection />
              </AdminDashboard>
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
