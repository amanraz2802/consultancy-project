import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors";

const SingleProjectView = () => {
  const { token } = useSelector((state) => state.auth);
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiConnector(
          "GET",
          `/form/project/${projectId}/details`,
          {},
          {
            Authorization: `Bearer ${token}`,
          }
        );
        setProjectData(response.data.data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    }
    fetchData();
  }, [projectId, token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 5: // Completed/Approved
        return "text-green-500";
      case 0: // Pending
        return "text-orange-500";
      case -1: // Rejected
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 5:
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
      getData: (data) => data?.consult_form,
    },
    {
      key: "work_form",
      title: "Work Form",
      getData: (data) => data?.work_form,
    },
    {
      key: "bill_form",
      title: "Bill of Supply",
      getData: (data) => data?.bill_form,
    },
    {
      key: "payment_bill",
      title: "Payment Details",
      getData: (data) => data?.payment_bill,
    },
    {
      key: "voucher_form",
      title: "Voucher",
      getData: (data) => data?.voucher_form,
    },
  ];

  if (!projectData) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const { project } = projectData;

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Project ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Project Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Department
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Created By
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                {project.projectId}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {project.title}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {project.dept}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {project.createdBy}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-sm font-medium ${getStatusColor(
                    project.status
                  )}`}
                >
                  {getStatusText(project.status)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="px-4 py-3 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formTypes.map(({ key, title, getData }) => {
              const formData = getData(projectData);

              return formData ? (
                <div key={key} className="bg-white p-4 rounded shadow-sm">
                  <div className="font-medium text-gray-700 mb-2">{title}</div>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {key === "consult_form" && (
                      <>
                        <div>
                          <span className="text-gray-500">Title:</span>
                          <span className="ml-2">
                            {formData.consultancyTitle}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Firm:</span>
                          <span className="ml-2">{formData.firmName}</span>
                        </div>
                      </>
                    )}
                    {key === "work_form" && (
                      <>
                        <div>
                          <span className="text-gray-500">Estimated Cost:</span>
                          <span className="ml-2">
                            ₹{formData.estimatedCost}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Description:</span>
                          <span className="ml-2">{formData.description}</span>
                        </div>
                      </>
                    )}
                    {key === "payment_bill" && (
                      <>
                        <div>
                          <span className="text-gray-500">Total Amount:</span>
                          <span className="ml-2">₹{formData.totalAmount}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Invoice No:</span>
                          <span className="ml-2">{formData.invoiceNo}</span>
                        </div>
                      </>
                    )}
                    {key === "voucher_form" && (
                      <>
                        <div>
                          <span className="text-gray-500">Voucher No:</span>
                          <span className="ml-2">{formData.voucherNo}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Amount:</span>
                          <span className="ml-2">₹{formData.amount}</span>
                        </div>
                      </>
                    )}
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`ml-2 ${getStatusColor(
                          key === "consult_form"
                            ? project.consultStatus
                            : key === "work_form"
                            ? project.workStatus
                            : key === "bill_form"
                            ? project.billStatus
                            : key === "payment_bill"
                            ? project.paymentStatus
                            : key === "voucher_form"
                            ? project.voucherStatus
                            : 0
                        )}`}
                      >
                        {getStatusText(
                          key === "consult_form"
                            ? project.consultStatus
                            : key === "work_form"
                            ? project.workStatus
                            : key === "bill_form"
                            ? project.billStatus
                            : key === "payment_bill"
                            ? project.paymentStatus
                            : key === "voucher_form"
                            ? project.voucherStatus
                            : 0
                        )}
                      </span>
                    </div>
                  </div>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm w-full"
                    onClick={() => console.log(`View ${key} details`)}
                  >
                    View Form
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProjectView;
