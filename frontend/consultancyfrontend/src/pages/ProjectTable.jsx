import React, { useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProjectTable = ({ data }) => {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState(new Set());
  // const { role, email, department } = useSelector((state) => state.auth);

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
      case "completed":
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      case "pending":
      case "in progress":
      case "ongoing":
        return "text-yellow-500";
      case "submitted":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  // Function to format timestamp if needed
  const formatTimestamp = (timestamp) => {
    if (!timestamp || timestamp === "N/A") return "N/A";
    // You can add custom formatting here if needed
    return timestamp;
  };

  // Function to render form details
  const renderFormDetails = (formObject, formName) => {
    return (
      <div className="bg-white p-4 rounded shadow-sm">
        <div className="font-medium text-gray-700 mb-2">{formName}</div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Status:</span>
            <span className={`ml-2 ${getStatusColor(formObject.status)}`}>
              {formObject.status}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Email:</span>
            <span className="ml-2">{formObject.email}</span>
          </div>
          <div>
            <span className="text-gray-500">Date:</span>
            <span className="ml-2">
              {formatTimestamp(formObject.timestamp)}
            </span>
          </div>
        </div>
      </div>
    );
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
            {data.map((project) => (
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
                        {/* Dynamically render all form objects */}
                        {project.form &&
                          typeof project.form === "object" &&
                          Object.entries(project.form).map(
                            ([formKey, formValue]) => {
                              // Format the form name to be more readable
                              const formName = formKey
                                .replace(/([A-Z])/g, " $1") // Add space before capital letters
                                .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
                                .replace(/Form$/, " Form"); // Add space before "Form" if it's at the end

                              return renderFormDetails(formValue, formName);
                            }
                          )}

                        <button
                          className="self-start px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/view/project/${project.projectID}`);
                          }}
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
