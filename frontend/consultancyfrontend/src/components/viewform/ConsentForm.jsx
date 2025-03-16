import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";

const ConsentForm = () => {
  const [data, setData] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllForms = async () => {
      try {
        const response = await apiConnector(
          "GET",
          "/form/getProjects/consult",
          {},
          {
            Authorization: `Bearer ${token}`,
          }
        );
        setData(response.data.data || []);
      } catch (err) {
        console.error("Error in fetching consent forms:", err);
        setData([]);
      }
    };

    fetchAllForms();
  }, []);

  return (
    <div className="w-9/12 max-w-6xl mx-auto p-4 mt-4">
      {/* Create New Button */}
      <Link
        to="/create/consent-form"
        className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg text-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg max-w-[250px] ml-auto"
      >
        Create New <CiCirclePlus size={28} />
      </Link>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((project) => (
                <tr
                  key={project.projectID}
                  className="border-b hover:bg-gray-50 cursor-pointer transition-all"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">
                    {project.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {project.title}
                  </td>
                  <td className="px-4 py-3">
                    {/* Conditional Button */}
                    {project.consentStatus ? (
                      <div className="flex gap-4">
                        <Link
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
                          // onClick={() => {
                          //   // e.stopPropagation();
                          //   navigate(`project/${project.id}`);
                          // }}
                          to={`/view/consent-form/${project.id}`}
                        >
                          View Form
                        </Link>
                        <Link
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
                          // onClick={() => {
                          //   // e.stopPropagation();
                          //   navigate(`project/${project.id}`);
                          // }}
                          to={`/view/project/18`}
                          // onClick={() => navigate("/view/project/18")}
                        >
                          View Project
                        </Link>
                      </div>
                    ) : (
                      <Link
                        className="px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-orange-700 hover:shadow-lg"
                        to={`/create/consent-form/${project.id}`}
                      >
                        Complete Draft
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center text-gray-500 py-4 text-sm"
                >
                  No projects available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsentForm;
