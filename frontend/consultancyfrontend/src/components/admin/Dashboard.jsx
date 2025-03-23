import React, { useEffect, useState } from "react";
import { FaUsers, FaFileAlt, FaCheck, FaTimes } from "react-icons/fa";
import { MdContactMail } from "react-icons/md";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";
const Dashboard = () => {
  const { token } = useSelector((state) => state.auth);
  // Mock data for dashboard stats
  const [stats, setStats] = useState([
    { title: "Total Users", count: 0, icon: FaUsers, color: "bg-blue-500" },
    {
      title: "Active Projects",
      count: 0,
      icon: FaFileAlt,
      color: "bg-green-500",
    },
    {
      title: "Pending Forms",
      count: 0,
      icon: FaFileAlt,
      color: "bg-yellow-500",
    },
    {
      title: "Unread Messages",
      count: 0,
      icon: MdContactMail,
      color: "bg-red-500",
    },
  ]);

  // Mock data for recent activities
  const [recentActivities, setRecentActivities] = useState([]);
  //   [
  //     {
  //       type: "Project Approved",
  //       project: "PROJ-2023-089",
  //       time: "2 hours ago",
  //       status: "approved",
  //     },
  //     {
  //       type: "New Form Submission",
  //       project: "PROJ-2023-092",
  //       time: "4 hours ago",
  //       status: "pending",
  //     },
  //     {
  //       type: "Project Rejected",
  //       project: "PROJ-2023-078",
  //       time: "1 day ago",
  //       status: "rejected",
  //     },
  //     {
  //       type: "New Contact Message",
  //       project: "PROJ-2023-085",
  //       time: "1 day ago",
  //       status: "pending",
  //     },
  //     {
  //       type: "Form Updated",
  //       project: "PROJ-2023-081",
  //       time: "2 days ago",
  //       status: "updated",
  //     },
  //   ];
  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await apiConnector(
          "GET",
          "/admin/dashboard",
          {},
          {
            Authorization: `Bearer ${token}`,
          }
        );
        console.log(response.data.data);
        if (response && response.data) {
          const { totalUsers, activeProjects, pendingForms, unreadMessages } =
            response.data.data;
          setRecentActivities(response.data.data.projectDetails);
          // Update the stats dynamically
          setStats([
            {
              title: "Total Users",
              count: totalUsers || 0,
              icon: FaUsers,
              color: "bg-blue-500",
            },
            {
              title: "Active Projects",
              count: activeProjects || 0,
              icon: FaFileAlt,
              color: "bg-green-500",
            },
            {
              title: "Pending Forms",
              count: pendingForms || 0,
              icon: FaFileAlt,
              color: "bg-yellow-500",
            },
            {
              title: "Unread Messages",
              count: unreadMessages || 0,
              icon: MdContactMail,
              color: "bg-red-500",
            },
          ]);
        }
      } catch (err) {
        console.log(err, "in admin dashboard");
      }
    }
    fetchDashboard();
  }, []);
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold mt-1">{stat.count}</p>
              </div>
              <div className={`${stat.color} p-4 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Project ID</th>
                <th className="py-3 px-4 text-left">Time</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            {console.log(recentActivities)}
            <tbody>
              {recentActivities.map((activity, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{activity.title}</td>
                  <td className="py-3 px-4">{activity.projectId}</td>
                  <td className="py-3 px-4">
                    {activity.updatedAt.split(" ")[0]}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        activity.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : activity.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : activity.status === "ongoing"
                          ? "bg-yellow-100 text-blue-800"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {/* {activity.status.charAt(0).toUpperCase() +
                        activity.status.slice(1)} */}
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
