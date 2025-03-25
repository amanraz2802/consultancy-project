import React, { useEffect, useState } from "react";
import { Info, Bell, Shield, Star, BadgeAlert } from "lucide-react";
import Pagination from "@mui/material/Pagination";
import { apiConnector } from "../services/apiConnectors";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  console.log("inside notification compo");
  // Dummy notification data with added type field
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  //   const currentPage = 1;
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    async function fetchNotification() {
      try {
        const response = await apiConnector(
          "GET",
          `user/notifications?page=${currentPage - 1}`,
          {},
          {
            Authorization: `Bearer ${token}`,
          }
        );
        console.log(response);
        setNotifications(response.data.data);
        setTotal(response.data.pagination.totalPages);
      } catch (error) {
        console.log(error, "Error in fetching notifications.");
      }
    }
    fetchNotification();
  }, []);

  async function markAsRead(id) {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, readStatus: 1 }
          : notification
      )
    );
    const response = await apiConnector(
      "POST",
      `user/notification/read/${id}`,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log(response);
  }
  // Function to mark a notification as read
  //   const markAsRead = (id) => {
  //     setNotifications(
  //       notifications.map((notification) =>
  //         notification.id === id
  //           ? { ...notification, readStatus: 1 }
  //           : notification
  //       )
  //     );
  //   };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        readStatus: 1,
      }))
    );
  };

  // Get icon based on notification type
  const getIcon = (type) => {
    switch (type) {
      case "admin":
        return <Shield className="text-purple-500" size={20} />;
      case "info":
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notification) => notification.readStatus === 0
  ).length;

  return (
    <div className="w-[90%] mx-auto mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bell size={20} />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <span className="bg-white text-blue-600 rounded-full px-2 py-1 text-sm font-bold">
          {unreadCount}
        </span>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 ${
                notification.readStatus === 0 ? "bg-blue-50" : "bg-white"
              }`}
            >
              <div className="flex items-start">
                <div className="mt-1 mr-3">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p
                      className={`text-sm ${
                        notification.readStatus === 0
                          ? "font-semibold"
                          : "text-gray-600"
                      }`}
                    >
                      {notification.message}
                    </p>
                    {notification.readStatus === 0 && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-xs hover:bg-blue-200 transition-colors"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <div
                    onClick={() => {
                      navigate(notification.linkTo);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-xs mt-1 inline-block"
                  >
                    View details
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-gray-200 px-4 py-1 text-center">
        <Pagination
          count={Math.ceil(total)}
          page={currentPage}
          onChange={handlePageChange}
          className="flex justify-center w-full my-3"
        />
      </div>
    </div>
  );
};

export default Notification;
