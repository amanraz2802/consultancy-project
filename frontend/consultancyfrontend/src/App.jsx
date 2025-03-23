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
import NotFoundPage from "./components/NotFoundPage.jsx";
import Notification from "./pages/Notification.jsx";
import PrivateRoute from "./components/auth/PrivateRoute.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import ComplaintForm from "./pages/ComplaintForm.jsx";

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
        {role === "PI" && (
          <Route
            path="/"
            element={
              <OpenRoute>
                <Homepage />
              </OpenRoute>
            }
          />
        )}
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
        <Route path="/login" element={<Loginpage />} />
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
                title="Consent Form View"
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
            <OpenRoute>
              <ReusableComponent
                title="Projects: Consent Form"
                element={<ConsentForm />}
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
        <Route
          path="notification"
          element={
            <OpenRoute>
              <ReusableComponent
                title="Notification"
                element={<Notification />}
              />
            </OpenRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
        {/* ===================ADMIN===================== */}
        {role === "ADMIN" && (
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        )}

        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
        {/* <Route
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
        /> */}
      </Routes>
    </>
  );
}

export default App;
