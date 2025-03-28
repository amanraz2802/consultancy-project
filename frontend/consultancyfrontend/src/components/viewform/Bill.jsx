import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";
import { FaEye, FaPlus, FaProjectDiagram } from "react-icons/fa";

const WorkOrderView = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllForms = async () => {
      try {
        const response = await apiConnector(
          "GET",
          `/form/getProjects/bill`,
          {},
          {
            Authorization: `Bearer ${token}`,
          }
        );

        setData(response.data.data || []);
        // console.log(response);
        setIsLoading(false);
      } catch (err) {
        console.error("Error in fetching consent forms:", err);
        setData([]);
        setIsLoading(false);
      }
    };

    fetchAllForms();
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white max-w-4xl flex justify-center flex-col mx-auto shadow-xl rounded-2xl overflow-hidden">
        {/* Page Header */}
        {/* <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <FaProjectDiagram className="mr-4" />
            Project Bill Management
          </h1>
        </div> */}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-300 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Project ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                      <span className="ml-4 text-gray-600">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((project) => (
                  <tr
                    key={project.projectID}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {project.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {project.bill === -1 ? (
                        <button
                          onClick={() =>
                            navigate(`/create/bill-supply/${project.id}`)
                          }
                          className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                        >
                          <FaPlus className="mr-2" />
                          Create Bill
                        </button>
                      ) : (
                        <div className="flex justify-center space-x-4">
                          <button
                            onClick={() =>
                              navigate(`/view/bill-supply/${project.id}`)
                            }
                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                          >
                            <FaEye className="mr-2" />
                            View Bill
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/view/project/${project.id}`)
                            }
                            className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-300"
                          >
                            <FaProjectDiagram className="mr-2" />
                            View Project
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center text-gray-500 py-8 text-sm"
                  >
                    No projects available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderView;
