import React, { useState, useEffect } from "react";
import Spinner from "../spinner/Spinner";
import { useSelector } from "react-redux";
import { FaEye } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors.jsx";

const ConsultancyProjectCompletionReportView = () => {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    consultancyProjectNo: "",
    nameOfWork: "",
    nameOfPI: "",
    departmentSection: "",
    objectivesAchieved: "",
    objectivesUnfulfilled: "",
    manpowerAssociatedFrom: "",
    manpowerAssociatedTo: "",
    manpowerHiredFrom: "",
    manpowerHiredTo: "",
    publicationsPublished: "",
    patentsFiled: "",
    pendingAdvances: "",
    disbursementsComplete: "",
    finalReportAttached: true,
    fileUrl: "",
  });

  const [payments, setPayments] = useState([]);
  const [researchStudents, setResearchStudents] = useState([]);

  // Fetch project data on component mount
  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        const response = await apiConnector(
          "GET",
          `/form/closureForm/${projectId}`,
          {},
          { Authorization: `Bearer ${token}` }
        );

        console.log(response, "get closure form");
        console.log(response.data?.researchStudents, "students");
        console.log(
          response.data.paymentDetails.consultancyProjectNo,
          "projectNo"
        );
        setResearchStudents(response.data?.researchStudents || null);
        setPayments(response.data.paymentDetails.payments || null);
        setFormData({
          consultancyProjectNo:
            response.data.paymentDetails.consultancyProjectNo,
          nameOfWork: response.data.paymentDetails.nameOfWork,
          nameOfPI: response.data.paymentDetails.nameOfPI,
          departmentSection: response.data.paymentDetails.departmentSection,
          objectivesAchieved: response.data.closureForm.objectivesAchieved,
          objectivesUnfulfilled:
            response.data.closureForm.objectivesUnfulfilled,
          manpowerAssociatedFrom:
            response.data.closureForm.manpowerAssociatedFrom,
          manpowerAssociatedTo: response.data.closureForm.manpowerAssociatedTo,
          manpowerHiredFrom: response.data.closureForm.manpowerHiredFrom,
          manpowerHiredTo: response.data.closureForm.manpowerHiredTo,
          publicationsPublished:
            response.data.closureForm.publicationsPublished,
          patentsFiled: response.data.closureForm.patentsFiled,
          pendingAdvances: response.data.closureForm.pendingAdvances,
          disbursementsComplete:
            response.data.closureForm.disbursementsComplete,
          finalReportAttached: true,
          fileUrl: response.data.closureForm.fileUrl,
        });

        // This would be used in a real implementation to set the data from the API response
        // For now, we're using the hardcoded data from the JSON you provided
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, token]);

  const getTotalNetPaymentReceived = () => {
    return payments.reduce(
      (sum, payment) => sum + Number(payment.netPaymentReceived || 0),
      0
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return <Spinner text={"Preparing your dashboard..."} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <header className="max-w-6xl mx-auto p-4 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="https://res.cloudinary.com/dpyurrpfa/image/upload/v1742117068/ry46xbwnlh1qttam6inp.png"
              alt="SVNIT Logo"
              className="h-20 w-20 scale-150"
            />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-center mb-2 mx-16">
                Sardar Vallabhbhai National Institute of Technology Surat -
                395007 (GUJARAT)
              </h1>
              <h3 className="text-xl font-semibold text-center mb-1">
                Office of the Dean Research & Consultancy
              </h3>
              <h3 className="text-xl font-semibold text-center mb-4">
                Form-CP-1.3-Consultancy Project Completion Report
              </h3>
            </div>
          </div>
          <div className="text-5xl font-bold transform -rotate-90 absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
            SVNIT
          </div>
        </div>
      </header>
      <h1 className="text-2xl font-bold mb-6 text-center underline">
        CLOSURE REPORT
      </h1>
      <div>
        {/* Prefetched Read-only Fields */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Consultancy Project No.
          </label>
          <input
            type="text"
            value={formData.consultancyProjectNo}
            readOnly
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name of Work
          </label>
          <input
            type="text"
            value={formData.nameOfWork}
            readOnly
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name of Person Involved
          </label>
          <input
            type="text"
            value={formData.nameOfPI}
            readOnly
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Department/Section
          </label>
          <input
            type="text"
            value={formData.departmentSection}
            readOnly
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Payments Section - Read-only */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Total Payments Received (INR)
            </h2>
          </div>

          {payments.length > 0 ? (
            payments.map((payment, index) => (
              <div
                key={index}
                className="mb-6 p-4 border rounded-lg bg-gray-50 relative"
              >
                <div className="grid sm:grid-cols-4 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Receipt No.
                    </label>
                    <input
                      type="text"
                      value={payment.receiptNo || ""}
                      readOnly
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="text"
                      value={formatDate(payment.date) || ""}
                      readOnly
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Total Bill Amount
                    </label>
                    <input
                      type="text"
                      value={payment.totalBill || 0}
                      readOnly
                      className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Net Payment Received
                    </label>
                    <input
                      type="text"
                      value={payment.netPaymentReceived || 0}
                      readOnly
                      className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                </div>
                <FaEye
                  className="flex justify-end items-end rounded mt-4 absolute -top-1 right-5"
                  size={20}
                  title="View details"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No payment records found.
            </p>
          )}

          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-lg font-semibold">
              Total Net Amount Received: ₹
              {getTotalNetPaymentReceived().toFixed(2)}
            </p>
            <p className="mt-2">
              100% Net Amount ₹{getTotalNetPaymentReceived().toFixed(2)}/- is
              distributed (after deducting G.S.T. / Expenditure and add GST TDS)
            </p>
          </div>
        </div>

        {/* User Filled Fields - Now Read Only */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Objectives Achieved
          </label>
          <textarea
            value={formData.objectivesAchieved}
            readOnly
            rows={4}
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Objectives Unfulfilled
          </label>
          <textarea
            value={formData.objectivesUnfulfilled}
            readOnly
            rows={4}
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manpower Associated From
            </label>
            <input
              type="text"
              value={formatDate(formData.manpowerAssociatedFrom)}
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manpower Associated To
            </label>
            <input
              type="text"
              value={formatDate(formData.manpowerAssociatedTo)}
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manpower Hired From
            </label>
            <input
              type="text"
              value={formatDate(formData.manpowerHiredFrom)}
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manpower Hired To
            </label>
            <input
              type="text"
              value={formatDate(formData.manpowerHiredTo)}
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Publications / Patents</h2>
          <div>
            <label className="block mb-2">Publications Published:</label>
            <div className="ml-8">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  checked={formData.publicationsPublished === "yes"}
                  readOnly
                  disabled
                  className="form-radio"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={formData.publicationsPublished === "no"}
                  readOnly
                  disabled
                  className="form-radio"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block mb-2">Patents Filed:</label>
            <div className="ml-8">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  checked={formData.patentsFiled === "yes"}
                  readOnly
                  disabled
                  className="form-radio"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={
                    formData.patentsFiled === "no" || !formData.patentsFiled
                  }
                  readOnly
                  disabled
                  className="form-radio"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Research Students Supported
            </h2>
          </div>

          {researchStudents.length > 0 ? (
            researchStudents.map((student, index) => (
              <div
                key={index}
                className="mb-4 p-4 border rounded-lg bg-gray-50 relative"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Student {index + 1} Name:
                    </label>
                    <input
                      type="text"
                      value={student.name}
                      readOnly
                      className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Student ID:
                    </label>
                    <input
                      type="text"
                      value={student.studentId}
                      readOnly
                      className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Type:
                  </label>
                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        checked={student.type === "Research Scholar"}
                        readOnly
                        disabled
                        className="form-radio"
                      />
                      <span className="ml-2">Research Scholar</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        checked={student.type === "M.Tech Student"}
                        readOnly
                        disabled
                        className="form-radio"
                      />
                      <span className="ml-2">M.Tech Student</span>
                    </label>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No research students added.
            </p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Statements</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Are there any pending advances?
            </label>
            <div className="space-x-4 ml-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={formData.pendingAdvances === "yes"}
                  readOnly
                  disabled
                  className="form-radio text-cyan-600"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={formData.pendingAdvances === "no"}
                  readOnly
                  disabled
                  className="form-radio text-cyan-600"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Are all the disbursements and expenditure complete?
            </label>
            <div className="space-x-4 ml-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={formData.disbursementsComplete === "yes"}
                  readOnly
                  disabled
                  className="form-radio text-cyan-600"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={formData.disbursementsComplete === "no"}
                  readOnly
                  disabled
                  className="form-radio text-cyan-600"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Final Report</h2>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={formData.finalReportAttached}
              readOnly
              disabled
              className="form-checkbox"
            />
            <span className="ml-2">
              A Copy of the Final Report submitted to the Client, duly
              counter-signed by the Dean (R&C) is attached herewith.
            </span>
          </div>
          {formData.fileUrl && (
            <div className="mt-2 p-2 bg-gray-50 border rounded">
              <p className="flex items-center">
                <FaEye className="mr-2" />
                <span>Attachment: {formData.fileUrl}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultancyProjectCompletionReportView;
