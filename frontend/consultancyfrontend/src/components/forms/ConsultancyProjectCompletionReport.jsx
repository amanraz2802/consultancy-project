import React, { useState, useEffect } from "react";
import Spinner from "../spinner/Spinner";
import { useSelector } from "react-redux";
import { FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors";

const ConsultancyProjectCompletionReport = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    researchStudents: [],
    pendingAdvances: "",
    disbursementsComplete: "",
    finalReportAttached: false,
  });

  const [payments, setPayments] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileUrl, setFileUrl] = useState("abcd");

  // Fetch project data on component mount
  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        const response = await apiConnector(
          "GET",
          `/form/prefetch/closure/${projectId}`,
          {},
          { Authorization: `Bearer ${token}` }
        );
        console.log(response);
        if (response.data && response.data.data) {
          const {
            consultancyProjectNo,
            nameOfWork,
            nameOfPI,
            departmentSection,
            payments,
          } = response.data.data;

          setFormData((prevData) => ({
            ...prevData,
            consultancyProjectNo,
            nameOfWork,
            nameOfPI,
            departmentSection,
          }));

          if (payments && payments.length > 0) {
            setPayments(payments);
          }
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        toast.error("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddStudent = () => {
    setFormData((prevData) => ({
      ...prevData,
      researchStudents: [
        ...prevData.researchStudents,
        { name: "", studentId: "", type: "" },
      ],
    }));
  };

  const handleRemoveStudent = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      researchStudents: prevData.researchStudents.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleResearchStudentChange = (index, field, value) => {
    setFormData((prevData) => {
      const newResearchStudents = [...prevData.researchStudents];
      newResearchStudents[index] = {
        ...newResearchStudents[index],
        [field]: value,
      };
      return { ...prevData, researchStudents: newResearchStudents };
    });
  };

  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      setFileUploaded(true);
      // Here you would typically handle file upload to a server
      // and get back a URL to store in fileUrl
      // For now, we'll just set a placeholder
      setFileUrl("file-uploaded");
      setFormData((prevData) => ({ ...prevData, finalReportAttached: true }));
    } else {
      setFileUploaded(false);
      setFileUrl("");
      setFormData((prevData) => ({ ...prevData, finalReportAttached: false }));
    }
  };

  const getTotalNetPaymentReceived = () => {
    return payments.reduce(
      (sum, payment) => sum + Number(payment.netPaymentReceived || 0),
      0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.set("objectivesAchieved", formData.objectivesAchieved);
      formDataToSubmit.set(
        "objectivesUnfulfilled",
        formData.objectivesUnfulfilled
      );
      formDataToSubmit.set(
        "manpowerAssociatedFrom",
        formData.manpowerAssociatedFrom
      );
      formDataToSubmit.set(
        "manpowerAssociatedTo",
        formData.manpowerAssociatedTo
      );
      formDataToSubmit.set("manpowerHiredFrom", formData.manpowerHiredFrom);
      formDataToSubmit.set("manpowerHiredTo", formData.manpowerHiredTo);
      formDataToSubmit.set(
        "publicationsPublished",
        formData.publicationsPublished
      );
      formDataToSubmit.set("patentsFiled", formData.patentsFiled);
      formDataToSubmit.set(
        "researchStudents",
        JSON.stringify(formData.researchStudents)
      );
      formDataToSubmit.set("projectId", projectId);
      formDataToSubmit.set("pendingAdvances", formData.pendingAdvances);
      formDataToSubmit.set(
        "disbursementsComplete",
        formData.disbursementsComplete
      );
      formDataToSubmit.set("finalReportAttached", formData.finalReportAttached);
      formDataToSubmit.set("fileUrl", fileUrl);

      const response = await apiConnector(
        "POST",
        "/form/closureForm",
        formDataToSubmit,
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      );
      console.log(response);
      if (response.data) {
        toast.success("Form submitted successfully");
        navigate("/closure");
      }
    } catch (err) {
      console.error("Error submitting closure form:", err);
      toast.error("Something went wrong. Please try again later");
    } finally {
      setSubmitting(false);
    }
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
    return <Spinner text="Preparing your dashboard..." />;
  }

  if (submitting) {
    return <Spinner text="Submitting form..." />;
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
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-2">
              Date
            </label>
          </div>
          <div>
            <input
              type="text"
              value={formatDate(new Date())}
              readOnly
              className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Prefetched Read-only Fields */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Consultancy Project No.
          </label>
          <input
            type="text"
            value={formData.consultancyProjectNo}
            readOnly
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
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
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
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
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
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
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
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

        {/* User Editable Fields */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Objectives Achieved
          </label>
          <textarea
            name="objectivesAchieved"
            value={formData.objectivesAchieved}
            onChange={handleInputChange}
            maxLength={1000}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Objectives Unfulfilled
          </label>
          <textarea
            name="objectivesUnfulfilled"
            value={formData.objectivesUnfulfilled}
            onChange={handleInputChange}
            maxLength={1000}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manpower Associated From
            </label>
            <input
              type="date"
              name="manpowerAssociatedFrom"
              value={formData.manpowerAssociatedFrom}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manpower Associated To
            </label>
            <input
              type="date"
              name="manpowerAssociatedTo"
              value={formData.manpowerAssociatedTo}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manpower Hired From
            </label>
            <input
              type="date"
              name="manpowerHiredFrom"
              value={formData.manpowerHiredFrom}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manpower Hired To
            </label>
            <input
              type="date"
              name="manpowerHiredTo"
              value={formData.manpowerHiredTo}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
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
                  name="publicationsPublished"
                  value="yes"
                  checked={formData.publicationsPublished === "yes"}
                  onChange={handleInputChange}
                  className="form-radio"
                  required
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="publicationsPublished"
                  value="no"
                  checked={formData.publicationsPublished === "no"}
                  onChange={handleInputChange}
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
                  name="patentsFiled"
                  value="yes"
                  checked={formData.patentsFiled === "yes"}
                  onChange={handleInputChange}
                  className="form-radio"
                  required
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="patentsFiled"
                  value="no"
                  checked={formData.patentsFiled === "no"}
                  onChange={handleInputChange}
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
            <button
              type="button"
              onClick={handleAddStudent}
              className="px-4 py-2 bg-[#734b9e] text-white rounded-md hover:bg-[#574092] focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Add Student
            </button>
          </div>

          {formData.researchStudents.length > 0 ? (
            formData.researchStudents.map((student, index) => (
              <div
                key={index}
                className="mb-4 p-4 border rounded-lg bg-gray-50 relative"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveStudent(index)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Student {index + 1} Name:
                    </label>
                    <input
                      type="text"
                      value={student.name}
                      onChange={(e) =>
                        handleResearchStudentChange(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                      placeholder="Enter student name"
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Student ID:
                    </label>
                    <input
                      type="text"
                      value={student.studentId}
                      onChange={(e) =>
                        handleResearchStudentChange(
                          index,
                          "studentId",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                      placeholder="Enter student ID"
                      required
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
                        name={`studentType${index}`}
                        value="Research Scholar"
                        checked={student.type === "Research Scholar"}
                        onChange={(e) =>
                          handleResearchStudentChange(
                            index,
                            "type",
                            e.target.value
                          )
                        }
                        className="form-radio"
                        required
                      />
                      <span className="ml-2">Research Scholar</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`studentType${index}`}
                        value="M.Tech Student"
                        checked={student.type === "M.Tech Student"}
                        onChange={(e) =>
                          handleResearchStudentChange(
                            index,
                            "type",
                            e.target.value
                          )
                        }
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
              No research students added. Click the "Add Student" button to add
              students.
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
                  name="pendingAdvances"
                  value="yes"
                  checked={formData.pendingAdvances === "yes"}
                  onChange={handleInputChange}
                  className="form-radio text-cyan-600"
                  required
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="pendingAdvances"
                  value="no"
                  checked={formData.pendingAdvances === "no"}
                  onChange={handleInputChange}
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
                  name="disbursementsComplete"
                  value="yes"
                  checked={formData.disbursementsComplete === "yes"}
                  onChange={handleInputChange}
                  className="form-radio text-cyan-600"
                  required
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="disbursementsComplete"
                  value="no"
                  checked={formData.disbursementsComplete === "no"}
                  onChange={handleInputChange}
                  className="form-radio text-cyan-600"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Final Report</h2>
          <label className="flex items-center">
            <input
              type="file"
              onChange={handleFileUpload}
              className="form-input"
              required={!fileUploaded}
            />
          </label>
          <label className="flex items-center mt-2">
            <input
              type="checkbox"
              name="finalReportAttached"
              checked={formData.finalReportAttached}
              onChange={handleInputChange}
              className="form-checkbox"
              required
            />
            <span className="ml-2">
              A Copy of the Final Report submitted to the Client, duly
              counter-signed by the Dean (R&C) is attached herewith.
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3e1b86] hover:bg-[#5f26a9] focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ConsultancyProjectCompletionReport;
