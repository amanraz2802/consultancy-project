import React from "react";

const SingleProjectView = () => {
  const projectData = {
    projectID: "873498d2acd",
    projectName: "External ECE Work",
    dept: "Electronics",
    createBy: "keyur@ece.svnit.ac.in",
    status: "Completed",
    form: {
      consentForm: {
        status: "Approved",
        email: "hod@ece.svnit.ac.in",
        timestamp: "2024-01-20",
      },
      workForm: {
        status: "Completed",
        email: "supervisor@ece.svnit.ac.in",
        timestamp: "2024-01-25",
      },
      billOfSupply: {
        status: "Generated",
        email: "accounts@ece.svnit.ac.in",
        timestamp: "2024-02-05",
      },
      paymentDetails: {
        status: "Processed",
        email: "finance@ece.svnit.ac.in",
        timestamp: "2024-02-10",
      },
      voucher: {
        status: "Issued",
        email: "admin@ece.svnit.ac.in",
        timestamp: "2024-02-15",
      },
      closureForm: {
        status: "Finalized",
        email: "director@ece.svnit.ac.in",
        timestamp: "2024-02-20",
      },
    },
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "approved":
      case "generated":
      case "processed":
      case "issued":
      case "finalized":
        return "text-green-500";
      case "ongoing":
      case "pending":
        return "text-orange-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const formTypes = [
    { key: "consentForm", title: "Consent Form" },
    { key: "workForm", title: "Work Form" },
    { key: "billOfSupply", title: "Bill of Supply" },
    { key: "paymentDetails", title: "Payment Details" },
    { key: "voucher", title: "Voucher" },
    { key: "closureForm", title: "Closure Form" },
  ];

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
                {projectData.projectID}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {projectData.projectName}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {projectData.dept}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {projectData.createBy}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-sm font-medium ${getStatusColor(
                    projectData.status
                  )}`}
                >
                  {projectData.status}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="px-4 py-3 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formTypes.map(({ key, title }) => (
              <div key={key} className="bg-white p-4 rounded shadow-sm">
                <div className="font-medium text-gray-700 mb-2">{title}</div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span
                      className={`ml-2 ${getStatusColor(
                        projectData.form[key].status
                      )}`}
                    >
                      {projectData.form[key].status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2">{projectData.form[key].email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <span className="ml-2">
                      {projectData.form[key].timestamp}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProjectView;
