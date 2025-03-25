import React, { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaCheck,
  FaExclamationCircle,
  FaTimes,
} from "react-icons/fa";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ContactSection = () => {
  // Mock data for contact messages
  const { token } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [filter, setFilter] = useState("all");
  if (loading) {
    return <Spinner text={"Please wait a moment..."} />;
  }
  useEffect(() => {
    setLoading(true);
    async function fetchMessages() {
      const response = await apiConnector(
        "GET",
        "/admin/complains",
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      );
      setMessages(response.data.data);
      //   console.log(response);
    }
    fetchMessages();
    setLoading(false);
  }, []);
  async function handleStatusChange(complainId, newStatus) {
    setLoading(true);
    const response = await apiConnector(
      "POST",
      `/admin/complain/${complainId}/${newStatus}`,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (response) {
      toast.success(response.data.message);
    }
    setLoading(false);
    // console.log(response);
  }

  const handleEmailOpen = (message) => {
    setSelectedMessage(message);
    setReply("");
    setEmailModal(true);
  };

  async function handleSendReply(id, message) {
    setLoading(true);
    const formdata = { complainId: id.toString(), response: message };
    const response = await apiConnector("POST", "/admin/complain", formdata, {
      Authorization: `Bearer ${token}`,
    });
    if (response) {
      toast.success(response.data.message);
    }
    handleStatusChange(id, "resolve");
    // console.log(response);
    setEmailModal(false);
    setLoading(false);
  }

  const filteredMessages =
    filter === "all"
      ? messages
      : messages.filter((msg) => msg.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-full text-xs ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded-full text-xs ${
              filter === "Pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("Pending")}
          >
            Pending
          </button>
          <button
            className={`px-3 py-1 rounded-full text-xs ${
              filter === "Noted"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("Noted")}
          >
            Noted
          </button>
          <button
            className={`px-3 py-1 rounded-full text-xs ${
              filter === "Resolved"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("Resolved")}
          >
            Resolved
          </button>
          <button
            className={`px-3 py-1 rounded-full text-xs ${
              filter === "Rejected"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("Rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">From</th>
                <th className="py-3 px-4 text-left">Project ID</th>
                <th className="py-3 px-4 text-left">Subject</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((message) => (
                <tr key={message.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{message.userEmail}</td>
                  <td className="py-3 px-4">{message.projectId}</td>
                  <td className="py-3 px-4">{message.subject}</td>
                  <td className="py-3 px-4">
                    {message.createdAt.split(" ")[0]}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        message.status === "Resolved"
                          ? "bg-green-100 text-green-800"
                          : message.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : message.status === "Noted"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {message.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                        onClick={() => handleEmailOpen(message)}
                        title="Reply"
                      >
                        <FaEnvelope />
                      </button>
                      <button
                        className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                        onClick={() => handleStatusChange(message.id, "noted")}
                        title="Mark as Noted"
                      >
                        <FaExclamationCircle />
                      </button>
                      <button
                        className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                        onClick={() =>
                          handleStatusChange(message.id, "resolve")
                        }
                        title="Mark as Resolved"
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                        onClick={() => handleStatusChange(message.id, "reject")}
                        title="Mark as Rejected"
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

      {/* Email Modal */}
      {emailModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">Reply to Message</h3>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p>
                <strong>Complain Id:</strong> {selectedMessage.id}
              </p>
              <p>
                <strong>From:</strong> {selectedMessage.userEmail}
              </p>
              <p>
                <strong>Project:</strong> {selectedMessage.projectId}
              </p>
              <p>
                <strong>Subject:</strong> {selectedMessage.subject}
              </p>
              <p className="mt-2">
                <strong>Message:</strong>
              </p>
              <p className="bg-white p-2 rounded border">
                {selectedMessage.message}
              </p>
            </div>

            <div className="mb-4">
              <label className="block mb-2">Your Reply:</label>
              <textarea
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="5"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setEmailModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => handleSendReply(selectedMessage.id, reply)}
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSection;
