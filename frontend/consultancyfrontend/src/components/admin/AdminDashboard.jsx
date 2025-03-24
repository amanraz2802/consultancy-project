import React, { useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { HiOutlineDownload } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdNotifications, MdDashboard } from "react-icons/md";
import { FaEdit, FaUsersCog, FaFileAlt } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { IoHome } from "react-icons/io5";
import { MdContacts, MdExpandMore, MdExpandLess } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../slices/authSlice.jsx";

const AdminDashboard = ({ children, title }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isFormDropdownOpen, setIsFormDropdownOpen] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);

  // Function to determine if a link is active based on the current path
  const isActive = (path) => {
    return window.location.pathname === path;
  };

  return (
    <div className="relative min-h-screen bg-[#34357c] overflow-hidden">
      <div className="flex">
        {/* Sidebar - properly handle the width based on isExpandable state */}
        <div
          className={`flex flex-col ${
            isExpandable ? "w-20" : "w-20 lg:w-64"
          } bg-[#1f2048] text-white min-h-screen fixed transition-all duration-300 z-10`}
        >
          {/* Logo */}
          <div className="w-full p-4 flex justify-center lg:justify-start items-center">
            <img
              src="https://res.cloudinary.com/dpyurrpfa/image/upload/v1742117068/ry46xbwnlh1qttam6inp.png"
              alt="svnitLogoImg"
              className="w-12 h-12 lg:w-16 lg:h-16"
            />
            {!isExpandable && (
              <span className="hidden lg:block ml-2 text-xl font-bold">
                Consultancy
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col mx-auto flex-grow mt-8 w-[95%]">
            <Link
              to="/admin"
              className={`flex items-center rounded-2xl py-3 px-5 ${
                isActive("/admin") ? "bg-[#34357c]" : ""
              }`}
            >
              <MdDashboard className="w-6 h-6" />
              {!isExpandable && (
                <span className="hidden lg:block ml-2">Dashboard</span>
              )}
            </Link>

            <Link
              to="/admin/userManagement"
              className={`flex items-center rounded-2xl py-3 px-4 ${
                isActive("/admin/userManagement") ? "bg-[#34357c]" : ""
              }`}
            >
              <FaUsersCog className="w-6 h-6" />
              {!isExpandable && (
                <span className="hidden lg:block ml-2">User Management</span>
              )}
            </Link>

            {/* Project Forms Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFormDropdownOpen(!isFormDropdownOpen)}
                className={`flex items-center rounded-2xl justify-between w-full py-3 px-4 ${
                  [
                    "/admin/consentForms",
                    "/admin/workOrders",
                    "/admin/billOfSupply",
                    "/admin/paymentDetails",
                    "/admin/vouchers",
                    "/admin/closureForms",
                  ].includes(window.location.pathname)
                    ? "bg-[#34357c]"
                    : ""
                }`}
              >
                <div className="flex items-center">
                  <FaFileAlt className="w-6 h-6" />
                  {!isExpandable && (
                    <span className="hidden lg:block ml-2">Project Forms</span>
                  )}
                </div>
                {!isExpandable && (
                  <span className="hidden lg:block">
                    {isFormDropdownOpen ? <MdExpandLess /> : <MdExpandMore />}
                  </span>
                )}
              </button>

              {isFormDropdownOpen && (
                <div className="lg:pl-8 rounded-2xl bg-[#0e0e25]">
                  <Link
                    to="/admin/consentForms"
                    className={`flex items-center w-full py-2 px-4 ${
                      isActive("/admin/consentForms") ? "text-blue-300" : ""
                    }`}
                  >
                    {!isExpandable ? (
                      <span className="hidden lg:block ml-2">
                        Consent Forms
                      </span>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white mx-auto"></div>
                    )}
                  </Link>
                  <Link
                    to="/admin/workOrders"
                    className={`flex items-center w-full py-2 px-4 ${
                      isActive("/admin/workOrders") ? "text-blue-300" : ""
                    }`}
                  >
                    {!isExpandable ? (
                      <span className="hidden lg:block ml-2">Work Orders</span>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white mx-auto"></div>
                    )}
                  </Link>
                  <Link
                    to="/admin/billOfSupply"
                    className={`flex items-center w-full py-2 px-4 ${
                      isActive("/admin/billOfSupply") ? "text-blue-300" : ""
                    }`}
                  >
                    {!isExpandable ? (
                      <span className="hidden lg:block ml-2">
                        Bill of Supply
                      </span>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white mx-auto"></div>
                    )}
                  </Link>
                  <Link
                    to="/admin/paymentDetails"
                    className={`flex items-center w-full py-2 px-4 ${
                      isActive("/admin/paymentDetails") ? "text-blue-300" : ""
                    }`}
                  >
                    {!isExpandable ? (
                      <span className="hidden lg:block ml-2">
                        Payment Details
                      </span>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white mx-auto"></div>
                    )}
                  </Link>
                  <Link
                    to="/admin/vouchers"
                    className={`flex items-center w-full py-2 px-4 ${
                      isActive("/admin/vouchers") ? "text-blue-300" : ""
                    }`}
                  >
                    {!isExpandable ? (
                      <span className="hidden lg:block ml-2">Vouchers</span>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white mx-auto"></div>
                    )}
                  </Link>
                  <Link
                    to="/admin/closureForms"
                    className={`flex items-center w-full py-2 px-4 ${
                      isActive("/admin/closureForms") ? "text-blue-300" : ""
                    }`}
                  >
                    {!isExpandable ? (
                      <span className="hidden lg:block ml-2">
                        Closure Forms
                      </span>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white mx-auto"></div>
                    )}
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/admin/contacts"
              className={`flex items-center rounded-2xl py-3 px-4 ${
                isActive("/admin/contacts") ? "bg-[#34357c]" : ""
              }`}
            >
              <MdContacts className="w-6 h-6" />
              {!isExpandable && (
                <span className="hidden lg:block ml-2">Contact Messages</span>
              )}
            </Link>

            <Link
              to="/admin/projects"
              className={`flex items-center rounded-2xl py-3 px-4 ${
                isActive("/admin/projects") ? "bg-[#34357c]" : ""
              }`}
            >
              <FaFileAlt className="w-6 h-6" />
              {!isExpandable && (
                <span className="hidden lg:block ml-2">Projects</span>
              )}
            </Link>
          </div>

          {/* Bottom Icons */}
          <div className="mt-auto p-4 flex items-center justify-around">
            <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-2">
              {!isExpandable && (
                <div
                  className="rounded-xl bg-[#34357c] p-2 cursor-pointer hidden lg:block ml-2"
                  onClick={() => navigate("/admin")}
                >
                  <IoHome className="w-6 h-6  text-white" />
                </div>
              )}
            </div>

            {!isExpandable && (
              <div
                className="rounded-xl bg-[#34357c] p-2 cursor-pointer hidden lg:block ml-2"
                onClick={() => {
                  dispatch(logout());
                  navigate("/login");
                }}
              >
                <LuLogOut className="w-6 h-6" />
              </div>
            )}

            <div
              className="rounded-xl bg-[#34357c] p-2 cursor-pointer"
              onClick={() => setIsExpandable(!isExpandable)}
            >
              <GiHamburgerMenu className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Main Content - adjust margin based on the sidebar state */}
        <div
          className={`${
            isExpandable ? "ml-20" : "ml-20 lg:ml-64"
          } w-[calc(100%-5rem)] ${
            isExpandable ? "lg:w-[calc(100%-5rem)]" : "lg:w-[calc(100%-16rem)]"
          } min-h-screen p-3`}
        >
          <div className="bg-[#efefef] h-full rounded-xl shadow-lg">
            <div className="bg-white border-8 font-extrabold border-[#efefef] rounded-3xl p-6 text-2xl lg:text-4xl font-poppins">
              {title ||
                window.location.pathname
                  .slice(1)
                  .replace(/([A-Z])/g, " $1")
                  .charAt(0)
                  .toUpperCase() +
                  window.location.pathname
                    .slice(1)
                    .replace(/([A-Z])/g, " $1")
                    .slice(1) ||
                "Dashboard"}
            </div>
            <div className="p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
