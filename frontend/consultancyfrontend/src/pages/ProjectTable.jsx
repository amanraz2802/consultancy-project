import React, { useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useNavigate } from "react-router-dom";
const dummyData = [
  {
    projectID: "873498dabcd",
    projectName: "External Civil Work",
    dept: "Civil",
    createBy: "keyur@coed.svnit.ac.in",
    status: "Ongoing",
    form: {
      consentForm: {
        status: "Approved",
        email: "hod@coed.svnit.ac.in",
        timestamp: "2024-01-15",
      },
      workForm: {
        status: "Not yet created",
        email: "pending@svnit.ac.in",
        timestamp: "N/A",
      },
    },
  },
  {
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
    },
  },
];

const ProjectTable = () => {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (projectID) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(projectID)) {
      newExpandedRows.delete(projectID);
    } else {
      newExpandedRows.add(projectID);
    }
    setExpandedRows(newExpandedRows);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "ongoing":
        return "text-orange-500";
      case "completed":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 mt-4 -ml-6">
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
            {dummyData.map((project) => (
              <React.Fragment key={project.projectID}>
                <tr
                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => toggleRow(project.projectID)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">
                    {project.projectID}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {project.projectName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {project.dept}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {project.createBy}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-medium ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                      {expandedRows.has(project.projectID) ? (
                        <IoMdArrowDropup className="w-5 h-5 text-gray-500" />
                      ) : (
                        <IoMdArrowDropdown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </td>
                </tr>
                {expandedRows.has(project.projectID) && (
                  <tr>
                    <td colSpan="5" className="px-4 py-3 bg-gray-50">
                      <div className="flex flex-col space-y-4">
                        {/* Consent Form Details */}
                        <div className="bg-white p-4 rounded shadow-sm">
                          <div className="font-medium text-gray-700 mb-2">
                            Consent Form
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Status:</span>
                              <span className="ml-2 text-green-600">
                                {project.form.consentForm.status}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Email:</span>
                              <span className="ml-2">
                                {project.form.consentForm.email}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Date:</span>
                              <span className="ml-2">
                                {project.form.consentForm.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Work Form Details */}
                        <div className="bg-white p-4 rounded shadow-sm">
                          <div className="font-medium text-gray-700 mb-2">
                            Work Form
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Status:</span>
                              <span className="ml-2 text-orange-500">
                                {project.form.workForm.status}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Email:</span>
                              <span className="ml-2">
                                {project.form.workForm.email}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Date:</span>
                              <span className="ml-2">
                                {project.form.workForm.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          className="self-start px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                          // onClick={(e) => {
                          //   e.stopPropagation();
                          //   console.log(
                          //     `Navigate to project ${project.projectID}`
                          //   );
                          // }}
                          onClick={() => navigate("/view/project/18")}
                        >
                          View Project Details
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;
