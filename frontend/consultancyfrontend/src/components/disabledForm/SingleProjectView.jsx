import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors";
import Spinner from "../spinner/Spinner";
import { useNavigate } from "react-router-dom";
import ViewDetailButton from "./ViewDetailButton";

const SingleProjectView = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await apiConnector(
          "GET",
          `/form/project/${projectId}/details`,
          {},
          {
            Authorization: `Bearer ${token}`,
          }
        );
        console.log(response.data.data);
        setProjectData(response.data.data);

        // Set the first available form as active tab
        const formTypes = [
          "consult_form",
          "work_form",
          "bill_form",
          "payment_bill",
          "voucher_form",
          "closure_form",
          "distribution_form",
        ];
        for (const form of formTypes) {
          if (response.data.data[form]) {
            setActiveTab(form);
            break;
          }
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        setLoading(false);
      }
      setLoading(false);
    }
    fetchData();
  }, [projectId, token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 5: // Completed/Approved
      case 1:
        return "bg-green-100 text-green-800";
      case 0: // Pending
        return "bg-yellow-100 text-yellow-800";
      case -1: // Rejected
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 5:
      case 1:
        return "Completed";
      case 0:
        return "Pending";
      case -1:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const formTypes = [
    {
      key: "consult_form",
      title: "Consultancy Form",
      link: "/view/consent-form/",
      icon: "📝",
      getData: (data) => data?.consult_form,
    },
    {
      key: "work_form",
      title: "Work Form",
      link: "/view/work-order/",
      icon: "🔨",
      getData: (data) => data?.work_form,
    },
    {
      key: "bill_form",
      title: "Bill of Supply",
      link: "/view/bill-supply/",
      icon: "🧾",
      getData: (data) => data?.bill_form,
    },
    {
      key: "payment_bill",
      title: "Payment Details",
      link: "/view/payment-detail/",
      icon: "💰",
      getData: (data) => data?.payment_bill,
    },
    {
      key: "voucher_form",
      title: "Voucher",
      link: "/view/voucher/",
      icon: "🎫",
      getData: (data) => data?.voucher_form,
    },
    {
      key: "closure_form",
      title: "Closure",
      link: "/view/closure/",
      icon: "🔒",
      getData: (data) => data?.closure_form,
    },
    {
      key: "distribution_form",
      title: "Distribution",
      link: "/view/distribution/",
      icon: "📊",
      getData: (data) => data?.distribution_form,
    },
  ];

  if (!projectData) {
    return <Spinner text={"Preparing your dashboard..."} />;
  }

  if (loading) {
    return <Spinner text={"Preparing your dashboard..."} />;
  }
  const { project } = projectData;

  // Get only available forms
  const availableForms = formTypes.filter((form) => form.getData(projectData));

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        {/* Project Header */}
        <div className="bg-gradient-to-r from-[#373877] to-[#2d2e70] text-white p-6">
          <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
          <div className="flex flex-wrap items-center justify-start gap-16 text-sm">
            <div className="flex items-center">
              <span className="opacity-75">ID:</span>
              <span className="ml-2 font-medium">{project.projectId}</span>
            </div>
            <div className="flex items-center">
              <span className="opacity-75">Department:</span>
              <span className="ml-2 font-medium">{project.dept}</span>
            </div>
            <div className="flex items-center">
              <span className="opacity-75">Created By:</span>
              <span className="ml-2 font-medium">{project.createdBy}</span>
            </div>
            <div className="flex items-center">
              <span className="opacity-75">Status:</span>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  project.status
                )}`}
              >
                {getStatusText(project.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto p-2 gap-2">
            {availableForms.map(({ key, title, icon }) => (
              <button
                key={key}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2
                  ${
                    activeTab === key
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                onClick={() => setActiveTab(key)}
              >
                <span>{icon}</span>
                <span>{title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {activeTab &&
            (() => {
              const formType = formTypes.find((f) => f.key === activeTab);
              const formData = formType.getData(projectData);

              const getStatusForForm = () => {
                switch (activeTab) {
                  case "consult_form":
                    return project.consultStatus;
                  case "work_form":
                    return project.workStatus;
                  case "bill_form":
                    return project.billStatus;
                  case "payment_bill":
                    return project.paymentStatus;
                  case "voucher_form":
                    return project.voucherStatus;
                  case "closure_form":
                    return project.closureStatus;
                  case "distribution_form":
                    return 5;
                  default:
                    return 0;
                }
              };

              const renderFormContent = () => {
                switch (activeTab) {
                  case "consult_form":
                    return (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-gray-500 text-sm font-medium mb-2">
                              Title
                            </label>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200">
                              {formData.consultancyTitle}
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-500 text-sm font-medium mb-2">
                              Firm Name
                            </label>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200">
                              {formData.firmName}
                            </div>
                          </div>
                        </div>
                        <ViewDetailButton
                          link={`/view/consent-form/${projectId}`}
                        />
                      </>
                    );
                  case "work_form":
                    return (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-gray-500 text-sm font-medium mb-2">
                              Estimated Cost
                            </label>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200 font-medium">
                              ₹{formData.estimatedCost}
                            </div>
                          </div>
                        </div>
                        <div className="mb-6">
                          <label className="block text-gray-500 text-sm font-medium mb-2">
                            Description
                          </label>
                          <div className="bg-gray-50 p-3 rounded border border-gray-200">
                            {formData.description}
                          </div>
                        </div>
                        <ViewDetailButton
                          link={`/view/work-order/${projectId}`}
                        />
                      </>
                    );
                  case "payment_bill":
                    return (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-gray-500 text-sm font-medium mb-2">
                              Invoice No
                            </label>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200">
                              {formData.invoiceNo}
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-500 text-sm font-medium mb-2">
                              Client Name
                            </label>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200">
                              {formData.clientName}
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-500 text-sm font-medium mb-2">
                              Total Amount
                            </label>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200 font-medium">
                              ₹{formData.totalAmount}
                            </div>
                          </div>
                        </div>
                        <ViewDetailButton
                          link={`/view/payment-detail/${projectId}`}
                        />
                      </>
                    );
                  case "voucher_form":
                    return (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-gray-500 text-sm font-medium mb-2">
                              Voucher No
                            </label>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200">
                              {formData.voucherNo}
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-500 text-sm font-medium mb-2">
                              Amount
                            </label>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200 font-medium">
                              ₹{formData.amount}
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-500 text-sm font-medium mb-2">
                              OnAccount
                            </label>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200 font-medium">
                              {formData.onAccount}
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-500 text-sm font-medium mb-2">
                              Reference
                            </label>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200 font-medium">
                              {formData.reference}
                            </div>
                          </div>
                        </div>
                        <ViewDetailButton link={`/view/voucher/${projectId}`} />
                      </>
                    );
                  case "closure_form":
                    return (
                      <>
                        <div className="mb-6">
                          <label className="block text-gray-500 text-sm font-medium mb-2">
                            Objective Achieved
                          </label>
                          <div className="bg-gray-50 p-3 rounded border border-gray-200">
                            {formData.objectivesAchieved}
                          </div>
                        </div>
                        <ViewDetailButton link={`/view/closure/${projectId}`} />
                      </>
                    );
                  case "distribution_form":
                    return (
                      <>
                        <div className="mb-6">
                          <label className="block text-gray-500 text-sm font-medium mb-2">
                            Subject
                          </label>
                          <div className="bg-gray-50 p-3 rounded border border-gray-200">
                            {formData.subject}
                          </div>
                        </div>
                        <div className="mb-6">
                          <label className="block text-gray-500 text-sm font-medium mb-2">
                            Body
                          </label>
                          <div className="bg-gray-50 p-3 rounded border border-gray-200">
                            {formData.body}
                          </div>
                        </div>
                        <ViewDetailButton
                          link={`/view/distribution/${projectId}`}
                        />
                      </>
                    );
                  default:
                    return null;
                }
              };

              return (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-gray-800">
                        {formType.title}
                      </span>
                      <span
                        className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          getStatusForForm()
                        )}`}
                      >
                        {getStatusText(getStatusForForm())}
                      </span>
                    </div>
                  </div>

                  {renderFormContent()}
                </div>
              );
            })()}
        </div>
      </div>
    </div>
  );
};

export default SingleProjectView;
