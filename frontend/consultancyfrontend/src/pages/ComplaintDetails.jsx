import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Mail,
  FileText,
  AlertCircle,
  MessageSquare,
  ArrowLeft,
  MessageCircle,
  Loader,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnectors";
import { useSelector } from "react-redux";

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [complaintData, setComplaintData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchComplaintResponse() {
      setLoading(true);
      try {
        const response = await apiConnector(
          "GET",
          `user/complain/${id}`,
          {},
          { Authorization: `Bearer ${token}` }
        );
        setComplaintData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching complaint:", err);
        setError("Failed to load complaint details");
        setLoading(false);
      }
    }

    if (token) {
      fetchComplaintResponse();
    }
  }, [id, token]);

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Function to format time
  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "";
    }
  };

  // Function to get status text and color
  const getStatusInfo = (status) => {
    switch (status) {
      case 2:
        return { text: "Resolved", color: "bg-green-100 text-green-800" };
      case 0:
        return { text: "Pending", color: "bg-yellow-100 text-yellow-800" };
      case -1:
        return { text: "Rejected", color: "bg-red-100 text-red-800" };
      case 1:
        return { text: "Noted", color: "bg-gray-100 text-gray-800" };
    }
  };

  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error || !complaintData || !complaintData.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Unable to load complaint details"}
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Complaints
          </button>
        </div>
      </div>
    );
  }

  // Now we can safely extract the data
  const { complains, complain_response } = complaintData.data;
  const statusInfo = getStatusInfo(complains?.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-gray-600">
            View information about your complaint and its response
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Header with ID and status */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div className="flex items-center space-x-2">
              <FileText className="text-blue-600" size={20} />
              <span className="text-sm text-gray-500">Complaint ID:</span>
              <span className="font-medium text-gray-900">
                #{complains?.id || "N/A"}
              </span>
            </div>
            <div
              className={`px-3 py-1 rounded-full ${statusInfo?.color} text-sm font-medium`}
            >
              {statusInfo?.text}
            </div>
          </div>

          {/* Subject */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              {complains?.subject || "No Subject"}
            </h2>
            <div className="mt-4 flex flex-wrap items-center text-sm text-gray-500 gap-4">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                {formatDate(complains?.createdAt)}
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                {formatTime(complains?.createdAt)}
              </div>
            </div>
          </div>

          {/* Complaint details */}
          <div className="p-6 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <AlertCircle className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Project Information
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Project ID: {complains?.projectId || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Mail className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Submitted By
                </h3>
                <p className="mt-1 text-sm text-gray-600 break-all">
                  {complains?.userEmail || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Response section */}
          {complain_response ? (
            <div className="bg-blue-50 p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <MessageSquare className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Official Response
                  </h3>
                  <p className="mt-2 text-gray-700">
                    {complain_response.response}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 text-center">
              <MessageCircle className="mx-auto text-gray-400" size={24} />
              <p className="mt-2 text-gray-500">No response yet</p>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Complaints
          </button>
          <button
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            onClick={() => {
              navigate("/complaint-form");
            }}
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
