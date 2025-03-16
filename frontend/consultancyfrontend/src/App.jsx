import "./App.css";
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

function App() {
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
          path="/"
          element={
            <OpenRoute>
              <Homepage />
            </OpenRoute>
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
        <Route
          path=":formname"
          element={
            <OpenRoute>
              {" "}
              <ReusableComponent title="" element={<Bill />} />
            </OpenRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
