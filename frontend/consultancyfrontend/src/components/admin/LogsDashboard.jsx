import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { apiConnector } from "../../services/apiConnectors";
import Spinner from "../spinner/Spinner";
const LogsDashboard = () => {
  // State for filters
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectId, setProjectId] = useState(0);
  const [selectRole, setSelectRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState([]);
  const { token } = useSelector((state) => state.auth);
  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        const response = await apiConnector(
          "POST",
          `/admin/logs`,
          {},
          {
            Authorization: `Bearer ${token}`,
          }
        );
        console.log(response);
        setLogs(response.data.data);
        setLoading(false);
      } catch (err) {
        console.log(err, "in fetching logs");
        setLoading(false);
      }
      setLoading(false);
    }
    fetchLogs();
  }, []);

  async function handleFilter() {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("startDate", startDate);
      formData.set("endDate", endDate);
      formData.set("projectId", projectId);
      formData.set("role", selectRole);

      const response = await apiConnector("POST", `/admin/logs`, formData, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });
      console.log(response);
      setLogs(response.data.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLoading(false);
    }
    setLoading(false);
  }
  if (loading) {
    return <Spinner text={"Preparing your dashboard..."} />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      {/* Filters Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Range Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Project ID Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project ID
            </label>
            <input
              type="number"
              value={projectId || ""}
              onChange={(e) => setProjectId(Number(e.target.value) || 0)}
              placeholder="All Projects"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="relative">
              <select
                value={selectRole}
                onChange={(e) => setSelectRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="PI">Person Involved</option>
                <option value="HOD">Head of Department</option>
                <option value="DEAN">Dean</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleFilter}
            className="bg-blue-600 h-12 flex justify-center items-center mt-6 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Apply
          </button>
          <br />
          {/* Search Filter */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by email, description, or form type"
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Form
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.logs.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.logs.projectId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {log.logs.form}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium 
                                        ${
                                          log.logs.action === "INSERT"
                                            ? "bg-green-100 text-green-800"
                                            : log.logs.action === "UPDATE"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                  >
                    {log.logs.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.logs.createdBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.logs.createdAt}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {log.logs.description || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* No Results Message */}
        {logs.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No logs found matching the current filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsDashboard;
