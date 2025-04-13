import React, { useEffect, useState } from "react";
import { FaSearch, FaEye, FaEdit, FaDownload } from "react-icons/fa";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../spinner/Spinner";

const FormSearch = ({ formType, formTypeF }) => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [projectId, setProjectId] = useState("");
  const [showAllForms, setShowAllForms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  if (loading) {
    return <Spinner text={"Please wait a moment..."} />;
  }
  useEffect(() => {
    setLoading(true);
    async function fetchForms() {
      try {
        const response = await apiConnector(
          "GET",
          `/admin/forms/${formType}`,
          {},
          { Authorization: `Bearer ${token}` }
        );
        console.log(response);
        if (response?.data?.data) {
          setData(response.data.data);
        } else {
          setData([]); // Set an empty array if response is invalid
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
        setData([]); // Handle errors properly
        setLoading(false);
      }
    }

    fetchForms();
    setLoading(false);
  }, [formType, token]);

  const filteredForms = showAllForms
    ? data
    : data.filter(
        (form) =>
          form.id || form.title.toLowerCase().includes(projectId.toLowerCase())
      );

  const handleSearch = (e) => {
    e.preventDefault();
    if (projectId.trim() === "") {
      setShowAllForms(true); // If empty, show all forms
    } else {
      setShowAllForms(false);
    }
  };

  const handleViewAll = () => {
    setProjectId("");
    setShowAllForms(true);
  };
  if (loading) {
    return <Spinner text={"Preparing your dashboard..."} />;
  }
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* <h2 className="text-xl font-semibold mb-4">{formType}</h2> */}

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 md:items-center"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Project ID"
                className="w-full md:w-64 pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <FaSearch />
              </button>
            </div>
            <button
              type="button"
              onClick={handleViewAll}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              View All
            </button>
          </form>
        </div>

        {filteredForms.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left">Project ID</th>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredForms.map((form) => (
                  <tr key={form.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{form.id}</td>
                    {/* <td className="py-3 px-4">{form.}</td> */}
                    <td className="py-3 px-4">
                      {formType.charAt(0).toUpperCase() + formType.slice(1)}
                      {" for "} {form.title}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          form.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : form.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : form.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {form.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {form.updatedAt.split(" ")[0]}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                          title="View"
                        >
                          <FaEye
                            onClick={() => {
                              navigate(`/admin/view/${formTypeF}/${form.id}`);
                            }}
                          />
                        </button>
                        {/* <button
                          className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                          title="Edit"
                        >
                          <FaEdit />
                        </button> */}
                        {/* <button
                          className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                          title="Download"
                        >
                          <FaDownload />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 p-8 text-center rounded-lg">
            <p className="text-gray-500">
              No forms found for the specified Project ID. Try a different ID or
              view all forms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormSearch;
