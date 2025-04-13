import "./App.css";
import { useSelector } from "react-redux";
import ConsultancyProjectRegistrationForm from "./components/forms/ConsultancyProjectRegistrationForm";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import { Filter } from "lucide-react";
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
import InvoiceView from "./components/disabledForm/BillFormView.jsx";
import BillFormView from "./components/disabledForm/BillFormView.jsx";
import PaymentDetailView from "./components/viewform/Payment.jsx";
import ReceiptVoucherForm from "./components/forms/ReceiptVoucherForm.jsx";
import VoucherView from "./components/viewform/Voucher.jsx";
import ReceiptVoucherViewForm from "./components/disabledForm/VoucherFormView.jsx";
import LogsDashboard from "./components/admin/LogsDashboard.jsx";
import DistributionForm from "./components/forms/DistributionForm.jsx";
import WorkOrderView from "./components/viewform/Workorder";
import ClosureView from "./components/viewform/Closure.jsx";
import ConsultancyProjectCompletionReportView from "./components/disabledForm/ConsultancyProjectCompletionReportView.jsx";
import DistributionView from "./components/viewform/DistributionView.jsx";
import PaymentViewForm from "./components/disabledForm/PaymentFormView.jsx";
import DistributionViewForm from "./components/disabledForm/DistributionFormView.jsx";
function App() {
  const { token, role } = useSelector((state) => state.auth);
  return (
    <>
      {/* <> */}
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
      {/* </> */}
      {/* <PaymentReceiptForm /> */}
      {/* <BillOfSupply /> */}
      {/* <DistributionForm /> */}
      {/* <ConsultancyProjectCompletionReport /> */}
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
        {/* ==========================Bill-of-supply routes============================ */}
        <Route
          path="bill-supply"
          element={
            <OpenRoute>
              <ReusableComponent
                title="Projects: Bill of Supply"
                element={<Bill />}
              />
            </OpenRoute>
          }
        />
        <Route
          path="create/bill-supply/:projectId"
          element={
            <OpenRoute>
              {" "}
              <ReusableComponent
                title="Bill of Supply"
                element={<BillOfSupply />}
              />
            </OpenRoute>
          }
        />
        <Route
          path="/view/bill-supply/:projectId"
          element={
            <OpenRoute>
              {" "}
              <ReusableComponent
                title="Bill of Supply View"
                element={<BillFormView />}
              />
            </OpenRoute>
          }
        />
        {/* ==========================Payment-details routes============================ */}
        <Route
          path="payment-detail"
          element={
            <OpenRoute>
              <ReusableComponent
                title="Projects: Payment Details"
                element={<PaymentDetailView />}
              />
            </OpenRoute>
          }
        />
        <Route
          path="create/payment-detail/:projectId"
          element={
            <OpenRoute>
              {" "}
              <ReusableComponent
                title="Payment Detail"
                element={<PaymentReceiptForm />}
              />
            </OpenRoute>
          }
        />
        <Route
          path="/view/payment-detail/:projectId"
          element={
            <OpenRoute>
              {" "}
              <ReusableComponent
                title="Payment Detail View"
                element={<PaymentViewForm />}
              />
            </OpenRoute>
          }
        />
        <Route
          path="create/receipt-voucher/:projectId"
          element={
            <OpenRoute>
              {" "}
              <ReusableComponent
                title="Receipt Voucher"
                element={<ReceiptVoucherForm />}
              />
            </OpenRoute>
          }
        />
        <Route
          path="voucher"
          element={
            <OpenRoute>
              <ReusableComponent
                title="Projects: Voucher"
                element={<VoucherView />}
              />
            </OpenRoute>
          }
        />
        <Route
          path="closure"
          element={
            <OpenRoute>
              <ReusableComponent
                title="Projects: Closure"
                element={<ClosureView />}
              />
            </OpenRoute>
          }
        />
        <Route
          path="create/closure/:projectId"
          element={
            <OpenRoute>
              {" "}
              <ReusableComponent
                title="Closure"
                element={<ConsultancyProjectCompletionReport />}
              />
            </OpenRoute>
          }
        />

        <Route
          path="/view/closure/:projectId"
          element={
            <OpenRoute>
              {" "}
              <ReusableComponent
                title="Closure Form View"
                element={<ConsultancyProjectCompletionReportView />}
              />
            </OpenRoute>
          }
        />
        <Route
          path="view/voucher/:projectId"
          element={
            <OpenRoute>
              <ReusableComponent
                title="Projects: Voucher"
                element={<ReceiptVoucherViewForm />}
              />
            </OpenRoute>
          }
        />
        <Route
          path="distribution"
          element={
            <OpenRoute>
              <ReusableComponent
                title="Projects: Distributions form"
                element={<DistributionView />}
              />
            </OpenRoute>
          }
        />
        <Route
          path="create/distribution/:projectId"
          element={
            <OpenRoute>
              {" "}
              <ReusableComponent
                title="Distribution form: Create"
                element={<DistributionForm />}
              />
            </OpenRoute>
          }
        />
        <Route
          path="view/distribution/:projectId"
          element={
            <OpenRoute>
              {" "}
              <ReusableComponent
                title="Distribution form: View"
                element={<DistributionViewForm />}
              />
            </OpenRoute>
          }
        />
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
          path="admin/view/project/:projectId"
          element={
            <AdminRoute>
              <AdminDashboard title="Project details">
                <SingleProjectView />
              </AdminDashboard>
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
                <FormSearch formType="consult" formTypeF="consent-form" />
              </AdminDashboard>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/view/consent-form/:projectId"
          element={
            <AdminRoute>
              <AdminDashboard title="Work Order View">
                <ConsentFormView />
              </AdminDashboard>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/workOrders"
          element={
            <AdminRoute>
              <AdminDashboard title="Work Orders">
                <FormSearch formType="work" formTypeF="work-order" />
              </AdminDashboard>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/view/work-order/:projectId"
          element={
            <AdminRoute>
              <AdminDashboard title="Work Order View">
                <WorkFormView />
              </AdminDashboard>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/billOfSupply"
          element={
            <AdminRoute>
              <AdminDashboard title="Bill of Supply">
                <FormSearch formType="bill" formTypeF="bill-supply" />
              </AdminDashboard>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/view/bill-supply/:projectId"
          element={
            <AdminRoute>
              <AdminDashboard title="Bill of Supply View">
                <BillFormView />
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
          path="/admin/view/payment-detail/:projectId"
          element={
            <AdminRoute>
              <AdminDashboard title="Payment Details View">
                <PaymentReceiptForm />
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
        <Route
          path="/admin/logs"
          element={
            <AdminRoute>
              <AdminDashboard
                title={
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <Filter className="mr-3 text-blue-600" /> Logs Dashboard
                  </h1>
                }
              >
                <LogsDashboard />
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
