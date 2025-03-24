import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";
import {
  PlusCircle,
  FileText,
  Folder,
  Search,
  ChevronRight,
  Calendar,
} from "lucide-react";

const ConsentForm = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllForms = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllForms();
  }, [token]);

  const filteredData = data.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.id.toString().includes(searchTerm)
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* Header Section */}
        <div className="mb-8">
          <p className="text-gray-500 mt-2">
            Manage and create consent forms for your projects
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by project name or ID..."
              className="pl-10 pr-4 py-3 w-full bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Create Button */}
          <Link
            to="/create/consent-form"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 group w-full md:w-auto justify-center"
          >
            <span>Create New Form</span>
            <PlusCircle
              size={20}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {filteredData.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredData.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 md:p-6 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Folder size={20} className="text-blue-600" />
                          </div>
                          <h3 className="font-semibold text-gray-800">
                            {project.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <FileText size={14} />
                            <span>ID: {project.id}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>
                              Status:{" "}
                              {project.consentStatus ? "Complete" : "Draft"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        {project.consentStatus ? (
                          <>
                            <Link
                              to={`/view/consent-form/${project.id}`}
                              className="flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
                            >
                              <span>View Form</span>
                              <ChevronRight size={16} />
                            </Link>
                            <Link
                              to={`/view/project/18`}
                              className="flex items-center justify-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full md:w-auto"
                            >
                              <span>View Project</span>
                              <ChevronRight size={16} />
                            </Link>
                          </>
                        ) : (
                          <Link
                            to={`/create/consent-form/${project.id}`}
                            className="flex items-center justify-center gap-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors w-full md:w-auto"
                          >
                            <span>Complete Draft</span>
                            <ChevronRight size={16} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <FileText size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-500 text-center mb-6">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Create your first consent form to get started"}
                </p>
                {!searchTerm && (
                  <Link
                    to="/create/consent-form"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium"
                  >
                    <PlusCircle size={20} />
                    <span>Create New Form</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsentForm;
