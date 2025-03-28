import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaUserPlus, FaCheck, FaTimes } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Spinner from "../spinner/Spinner";
const UserManagement = () => {
  // Mock data for users

  const [users, setUsers] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  async function handleFilter() {
    const filterdata = {
      dept: filterDept,
      role: filterRole,
    };
    try {
      setLoading(true);
      const response = await apiConnector("POST", "/admin/users", filterdata, {
        Authorization: `Bearer ${token}`,
      });
      console.log(response);
      const data = response.data.data.map((user) => ({
        ...user,
        name: user.fname + user.lname,
        id: user.email,
      }));
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.log(err), setLoading(false);
    }
  }
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterDept, setFilterDept] = useState("all");

  const filteredUsers = users.filter((user) => {
    const userName = user.name ? user.name.toLowerCase() : "";
    const userEmail = user.email ? user.email.toLowerCase() : "";
    const userDepartment = user.department ? user.department.toLowerCase() : "";

    const matchesSearch =
      userName.includes(searchTerm.toLowerCase()) ||
      userEmail.includes(searchTerm.toLowerCase()) ||
      userDepartment.includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  async function handleFreeze(id) {
    setLoading(true);
    try {
      const response = await apiConnector(
        "POST",
        `/admin/user/${encodeURIComponent(id)}/freeze`,
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      );
      console.log(response);
      handleFilter();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }
  async function handleUnfreeze(id) {
    try {
      setLoading(true);
      const response = await apiConnector(
        "POST",
        `/admin/user/${encodeURIComponent(id)}/unfreeze`,
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      );
      console.log(response);
      handleFilter();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }
  if (loading) {
    return <Spinner text={"Please wait a moment..."} />;
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full md:w-64 pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="all">DEPT</option>
            <option value="coed">COED</option>
            <option value="med">MED</option>
            <option value="eced">ECED</option>
            <option value="ahmd">AHMD</option>
            <option value="ched">CHED</option>
            <option value="ced">CED</option>
            <option value="eed">EED</option>
          </select>
          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="PI">PI</option>
            <option value="HOD">HOD</option>
            <option value="Dean">Dean</option>
          </select>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center"
            onClick={handleFilter}
          >
            <FaFilter className="mr-2" color="white" />
            Apply
          </button>
        </div>
      </div>
      {users.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg">
          <p className="text-gray-500">
            No users found Try a different user ID or apply filters.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Department</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "PI"
                            ? "bg-blue-100 text-blue-800"
                            : user.role === "HOD"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">{user.dept}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.freeze === 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.freeze === 0 ? "Active" : "Restricted"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                          onClick={() => handleUnfreeze(user.id)}
                          disabled={user.freeze === 0}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                          onClick={() => handleFreeze(user.id)}
                          disabled={user.freeze === 1}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
