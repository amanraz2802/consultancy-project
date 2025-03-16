import React from "react";
import { FaCircleUser } from "react-icons/fa6";
import { HiOutlineDownload } from "react-icons/hi";
import { MdNotifications } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import Dashboard from "../components/home/Dashboard";
import { useDispatch } from "react-redux";
import { logout } from "../components/slices/authSlice.jsx";
import { IoHome } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function ReusableComponent(props) {
  const { formname } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function formatText(input) {
    return input
      .replace(/([A-Z])/g, " $1") // Insert space before uppercase letters
      .trim() // Remove leading space
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
  }
  return (
    <div className="relative min-h-screen bg-[#34357c] overflow-hidden ">
      <div className="flex">
        {/* Sidebar */}
        <div className="flex flex-col w-20 lg:w-32 p-4 items-center justify-between min-h-screen fixed">
          <div className="w-full">
            <img
              src="../../images/svnitLogo.png"
              alt="svnitLogoImg"
              className="w-full max-w-[80px] mx-auto"
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-xl bg-[#1f2048] p-2">
              <MdNotifications className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="rounded-xl bg-[#1f2048] p-2">
              <HiOutlineDownload className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div
              className="rounded-xl bg-[#1f2048] p-2 "
              onClick={() => navigate("/")}
            >
              <IoHome className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
          </div>

          <div className="group relative mb-4">
            <FaCircleUser className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            <div className="absolute left-full bottom-0 opacity-0 bg-[#1f2048] text-white rounded-md z-50 transition-opacity duration-300 group-hover:opacity-100 ml-2">
              <ul className="flex flex-col whitespace-nowrap">
                <li className="p-2 gap-2 text-sm lg:text-base rounded flex items-center">
                  <FaEdit className="w-5 h-5" />
                  Change Password
                </li>
                <li className="border border-gray-600"></li>

                <li
                  className="flex gap-2 p-2 rounded text-sm lg:text-base items-center"
                  onClick={() => dispatch(logout())}
                >
                  <LuLogOut className="w-5 h-5" />
                  Logout
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-20 lg:ml-32 w-[calc(100%-5rem)] lg:w-[calc(100%-8rem)] min-h-screen p-3">
          <div className="bg-[#efefef] h-full rounded-xl  shadow-lg">
            <div className="bg-white border-8 font-extrabold border-[#efefef] rounded-3xl p-6  text-4xl font-poppins ">
              {props.title === "" ? formatText(formname) : props.title}
            </div>
            {/* <Dashboard /> */}
            {props.element}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReusableComponent;
