import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Spinner from "../spinner/Spinner";
import {
  HiCheck,
  HiX,
  HiInformationCircle,
  HiOutlineEye,
  HiOutlineClipboardList,
} from "react-icons/hi";
import { CiCirclePlus } from "react-icons/ci";
import { FiFolder } from "react-icons/fi";

const VoucherView = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { token, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllForms = async () => {
      setIsLoading(true);
      try {
        const response = await apiConnector(
          "GET",
          "/form/getProjects/voucher",
          {},
          {
            Authorization: `Bearer ${token}`,
          }
        );
        setData(response.data.data || []);
        console.log(response.data.data);
      } catch (err) {
        console.error("Error in fetching voucher", err);
        setData([]);
        toast.error("Failed to fetch voucher");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllForms();
  }, [token]);

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
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/view/voucher/${project.id}`)}
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-blue-700"
              >
                <HiOutlineEye className="text-lg" />
                <span>View voucher</span>
              </button>
              <button
                onClick={() => navigate(`/view/project/${project.id}`)}
                className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-indigo-700"
              >
                <FiFolder className="text-lg" />
                <span>View Project</span>
              </button>
            </div>
          </td>
        </tr>
      ));
    }

    if (role === "HOD") {
      return (
        <>
          {data.map((project) => (
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
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/view/voucher/${project.id}`)}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-blue-700"
                  >
                    <HiOutlineEye className="text-lg" />
                    <span>View Voucher</span>
                  </button>
                  <button
                    onClick={() => navigate(`/view/project/${project.id}`)}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-blue-700"
                  >
                    <HiOutlineEye className="text-lg" />
                    <span>View Project</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </>
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
            <p className="text-gray-600 mt-1">View your project vouchers</p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          {/* Table Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <HiOutlineClipboardList className="text-blue-600 text-2xl" />
              <h2 className="text-xl font-semibold text-gray-800">
                Project vouchers
              </h2>
            </div>
          </div>

          {/* Table or Content */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : data.length > 0 ? (
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>{renderProjectRows()}</tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No Vouchers available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoucherView;
