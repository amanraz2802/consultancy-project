import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import toast from "react-hot-toast";
import Spinner from "../spinner/Spinner";
import {
  HiCheck,
  HiX,
  HiInformationCircle,
  HiOutlineEye,
  HiOutlineClipboardList,
} from "react-icons/hi";
import { FiFolder, FiEdit } from "react-icons/fi";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";

const ConsentForm = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [approvalModal, setApprovalModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [remarks, setRemarks] = useState("");

  const { token, role } = useSelector((state) => state.auth);
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
        console.log(response.data.data);
      } catch (err) {
        console.error("Error in fetching consent forms:", err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllForms();
  }, [token]);

  const handleApprovalAction = async (action) => {
    if (!selectedForm) return;
    setIsLoading(true);
    try {
      const endpoint =
        action === "accept"
          ? `/form/consult/accept/${selectedForm.id}`
          : `/form/consult/reject/${selectedForm.id}`;

      const response = await apiConnector(
        "POST",
        endpoint,
        { remarks },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      // Refresh data or update the item's status
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedForm.id
            ? { ...item, consentStatus: action === "accept" ? 3 : 2 }
            : item
        )
      );
      setApprovalModal(false);
      setSelectedForm(null);
      console.log(response);
      if (response) {
        toast.success("Reviewed Successfully");
      }
      setRemarks("");
    } catch (error) {
      console.error("Error in approval action:", error);
      toast.error("Reviewed failed");
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const ApprovalModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {modalType === "accept" ? "Accept Form" : "Reject Form"}
          </h2>
          <button
            onClick={() => setApprovalModal(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            <HiX size={24} />
          </button>
        </div>

        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 min-h-[120px]"
          placeholder="Enter your remarks..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-4 flex items-center">
          <HiInformationCircle className="text-yellow-600 mr-3" size={24} />
          <p className="text-yellow-800 text-sm">
            {modalType === "accept"
              ? "You are about to approve this consent form."
              : "You are about to reject this consent form."}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setApprovalModal(false)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => handleApprovalAction(modalType)}
            className={`px-4 py-2 rounded-lg text-white ${
              modalType === "accept"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {modalType === "accept" ? "Confirm Accept" : "Confirm Reject"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderProjectRows = () => {
    if (role === "PI") {
      return data.map((project) => (
        <tr
          key={project.id}
          className="hover:bg-blue-50 transition-colors border-b border-gray-100"
        >
          <td className="px-6 py-4 text-sm font-medium text-gray-700">
            #{project.id}
          </td>
          <td className="px-6 py-4 text-sm text-gray-700">
            <div className="font-medium">{project.title}</div>
          </td>
          <td className="px-6 py-4">
            {project.consentStatus ? (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                Completed
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full">
                Draft
              </span>
            )}
          </td>
          <td className="px-6 py-4">
            {project.consentStatus ? (
              <div className="flex gap-3">
                <Link
                  to={`/view/consent-form/${project.id}`}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-blue-700"
                >
                  <HiOutlineEye className="text-lg" />
                  <span>View Form</span>
                </Link>
                <Link
                  to={`/view/project/${project.id}`}
                  className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-indigo-700"
                >
                  <FiFolder className="text-lg" />
                  <span>View Project</span>
                </Link>
              </div>
            ) : (
              <Link
                to={`/create/consent-form/${project.id}`}
                className="flex w-36 items-center gap-1 px-3 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-orange-700"
              >
                <FiEdit className="text-lg" />
                <span>Complete Draft</span>
              </Link>
            )}
          </td>
        </tr>
      ));
    }

    if (role === "HOD") {
      // Filter projects by status
      const pendingForms = data.filter(
        (project) => project.consentStatus === 1
      );
      const acceptedForms = data.filter(
        (project) => [3, 4, 5].includes(project.consentStatus)
        // project.consentStatus === 2
      );
      const rejectedForms = data.filter(
        (project) => project.consentStatus === 2
      );

      return (
        <>
          {[...pendingForms, ...acceptedForms, ...rejectedForms].map(
            (project) => (
              <tr
                key={project.id}
                className="hover:bg-blue-50 transition-colors border-b border-gray-100"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-700">
                  #{project.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="font-medium">{project.title}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      project.consentStatus === 1
                        ? "bg-amber-100 text-amber-800"
                        : [3, 5].includes(project.consentStatus)
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {project.consentStatus === 1
                      ? "Pending Review"
                      : [3, 4, 5].includes(project.consentStatus)
                      ? "Accepted"
                      : "Rejected"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <Link
                      to={`/view/consent-form/${project.id}`}
                      className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-blue-700"
                    >
                      <HiOutlineEye className="text-lg" />
                      <span>View Details</span>
                    </Link>
                    {project.consentStatus === 1 && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedForm(project);
                            setModalType("accept");
                            setApprovalModal(true);
                          }}
                          className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-green-700"
                        >
                          <HiCheck className="text-lg" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedForm(project);
                            setModalType("reject");
                            setApprovalModal(true);
                          }}
                          className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-red-700"
                        >
                          <HiX className="text-lg" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )
          )}
        </>
      );
    }

    if (role === "DEAN") {
      // Separate sections for different statuses
      const pendingForms = data.filter(
        (project) => project.consentStatus === 6
      );
      const acceptedForms = data.filter(
        (project) => project.consentStatus === 5
      );
      const rejectedForms = data.filter(
        (project) => project.consentStatus === 2
      );

      const renderFormSection = (forms, title, statusColor) =>
        forms.length > 0 && (
          <div className="mb-8 pl-4 pr-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
              {title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transform transition-all hover:scale-105 hover:shadow-lg"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor}`}
                      >
                        {title}
                      </span>
                      <span className="text-sm text-gray-500">
                        #{project.id}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {project.title}
                    </h3>
                    <div className="mt-4 flex space-x-3">
                      <Link
                        to={`/view/consent-form/${project.id}`}
                        className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      return (
        <div className="space-y-8">
          {renderFormSection(
            pendingForms,
            "Pending Forms",
            "bg-yellow-100 text-yellow-800"
          )}
          {renderFormSection(
            acceptedForms,
            "Accepted Forms",
            "bg-green-100 text-green-800"
          )}
          {renderFormSection(
            rejectedForms,
            "Rejected Forms",
            "bg-red-100 text-red-800"
          )}
        </div>
      );
    }

    return null;
  };
  if (isLoading) {
    return <Spinner text={"Preparing your dashboard..."} />;
  }
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pt-4">
          <div>
            <p className="text-gray-600 mt-1">
              Manage your project consent forms
            </p>
          </div>

          {role === "PI" && (
            <Link
              to="/create/consent-form"
              className="flex items-center justify-center gap-2 px-5 py-3 mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg text-lg font-medium shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <CiCirclePlus size={24} />
              <span>Create New Form</span>
            </Link>
          )}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          {/* Table Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <HiOutlineClipboardList className="text-blue-600 text-2xl" />
              <h2 className="text-xl font-semibold text-gray-800">
                Project Forms
              </h2>
            </div>
          </div>

          {/* Table or Content */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : data.length > 0 ? (
            role === "DEAN" ? (
              renderProjectRows()
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Project ID
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Project Name
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>{renderProjectRows()}</tbody>
                </table>
              </div>
            )
          ) : (
            <div className="text-center py-12 text-gray-500">
              No projects available.
            </div>
          )}
        </div>
      </div>

      {approvalModal && <ApprovalModal />}
    </div>
  );
};

export default ConsentForm;
