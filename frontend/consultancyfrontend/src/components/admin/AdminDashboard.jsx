import React, { useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { HiOutlineDownload } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdNotifications, MdDashboard } from "react-icons/md";
import { FaEdit, FaUsersCog, FaFileAlt } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { IoHome } from "react-icons/io5";
import { MdContacts, MdExpandMore, MdExpandLess } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Dashboard from "./Dashboard";
import UserManagement from "./UserManagement";
// import ProjectForms from "./ProjectForms";
import ContactSection from "./ContactSection";
import ProjectSection from "./ProjectSection";
import FormSearch from "./FormSearch.jsx";
import { logout } from "../slices/authSlice.jsx";
// import { useDispatch } from "react-redux";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeSection, setActiveSection] = useState("dashboard");
  const [isFormDropdownOpen, setIsFormDropdownOpen] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);

  // Mock logout function since we don't have the actual implementation
  const handleLogout = () => {
    // dispatch(logout());
    console.log("Logging out");
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "userManagement":
        return <UserManagement />;
      case "consentForms":
        return <FormSearch formType="consult" />;
      case "workOrders":
        return <FormSearch formType="work" />;
      case "billOfSupply":
        return <FormSearch formType="bill" />;
      case "paymentDetails":
        return <FormSearch formType="payment" />;
      case "vouchers":
        return <FormSearch formType="voucher" />;
      case "closureForms":
        return <FormSearch formType="closure" />;
      case "contacts":
        return <ContactSection />;
      case "projects":
        return <ProjectSection />;
      default:
        return <Dashboard />;
    }
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
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`flex items-center rounded-2xl py-3 px-5 ${
                activeSection === "dashboard" ? "bg-[#34357c]" : ""
              }`}
            >
              <MdDashboard className="w-6 h-6" />
              {!isExpandable && (
                <span className="hidden lg:block ml-2">Dashboard</span>
              )}
            </button>

            <button
              onClick={() => setActiveSection("userManagement")}
              className={`flex items-center rounded-2xl py-3 px-4 ${
                activeSection === "userManagement" ? "bg-[#34357c]" : ""
              }`}
            >
              <FaUsersCog className="w-6 h-6" />
              {!isExpandable && (
                <span className="hidden lg:block ml-2">User Management</span>
              )}
            </button>

            {/* Project Forms Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFormDropdownOpen(!isFormDropdownOpen)}
                className={`flex items-center rounded-2xl justify-between w-full py-3 px-4 ${
                  [
                    "consentForms",
                    "workOrders",
                    "billOfSupply",
                    "paymentDetails",
                    "vouchers",
                    "closureForms",
                  ].includes(activeSection)
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
                  <button
                    onClick={() => setActiveSection("consentForms")}
                    className={`flex items-center w-full py-2 px-4 ${
                      activeSection === "consentForms" ? "text-blue-300" : ""
                    }`}
                  >
                    {!isExpandable ? (
                      <span className="hidden lg:block ml-2">
                        Consent Forms
                      </span>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white mx-auto"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveSection("workOrders")}
                    className={`flex items-center w-full py-2 px-4 ${
                      activeSection === "workOrders" ? "text-blue-300" : ""
                    }`}
                  >
                    {!isExpandable ? (
                      <span className="hidden lg:block ml-2">Work Orders</span>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white mx-auto"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveSection("billOfSupply")}
                    className={`flex items-center w-full py-2 px-4 ${
                      activeSection === "billOfSupply" ? "text-blue-300" : ""
                    }`}
                  >
                    {!isExpandable ? (
                      <span className="hidden lg:block ml-2">
                        Bill of Supply
                      </span>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white mx-auto"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveSection("paymentDetails")}
                    className={`flex items-center w-full py-2 px-4 ${
                      activeSection === "paymentDetails" ? "text-blue-300" : ""
                    }`}
                  >
                    {!isExpandable ? (
                      <span className="hidden lg:block ml-2">
                        Payment Details
                      </span>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white mx-auto"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveSection("vouchers")}
                    className={`flex items-center w-full py-2 px-4 ${
                      activeSection === "vouchers" ? "text-blue-300" : ""
                    }`}
                  >
                    {!isExpandable ? (
                      <span className="hidden lg:block ml-2">Vouchers</span>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white mx-auto"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveSection("closureForms")}
                    className={`flex items-center w-full py-2 px-4 ${
                      activeSection === "closureForms" ? "text-blue-300" : ""
                    }`}
                  >
                    {!isExpandable ? (
                      <span className="hidden lg:block ml-2">
                        Closure Forms
                      </span>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white mx-auto"></div>
                    )}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveSection("contacts")}
              className={`flex items-center rounded-2xl py-3 px-4 ${
                activeSection === "contacts" ? "bg-[#34357c]" : ""
              }`}
            >
              <MdContacts className="w-6 h-6" />
              {!isExpandable && (
                <span className="hidden lg:block ml-2">Contact Messages</span>
              )}
            </button>

            <button
              onClick={() => setActiveSection("projects")}
              className={`flex items-center rounded-2xl py-3 px-4 ${
                activeSection === "projects" ? "bg-[#34357c]" : ""
              }`}
            >
              <FaFileAlt className="w-6 h-6" />
              {!isExpandable && (
                <span className="hidden lg:block ml-2">Projects</span>
              )}
            </button>
          </div>

          {/* Bottom Icons */}
          <div className="mt-auto p-4 flex items-center justify-around">
            <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-2">
              {!isExpandable && (
                <div
                  className="rounded-xl bg-[#34357c] p-2 cursor-pointer hidden lg:block ml-2"
                  onClick={() => navigate("/")}
                >
                  <IoHome className="w-6 h-6  text-white" />
                </div>
              )}
            </div>

            {!isExpandable && (
              <div
                className="rounded-xl bg-[#34357c] p-2 cursor-pointer hidden lg:block ml-2"
                onClick={() => dispatch(logout())}
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
              {activeSection.charAt(0).toUpperCase() +
                activeSection.slice(1).replace(/([A-Z])/g, " $1")}
            </div>
            <div className="p-6">{renderActiveSection()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
