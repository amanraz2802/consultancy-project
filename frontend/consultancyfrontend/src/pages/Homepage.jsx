import React from "react";
import { FaCircleUser } from "react-icons/fa6";
import { HiOutlineDownload } from "react-icons/hi";
import { MdNotifications } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { useSelector } from "react-redux";
import Dashboard from "../components/home/Dashboard";
import ConsultancyProjectRegistrationForm from "../components/forms/ConsultancyProjectRegistrationForm";
import ReusableComponent from "./ReusableComponent";
function Homepage() {
  const { name, email, role } = useSelector((state) => state.auth);
  return (
    <div>
      {" "}
      <ReusableComponent
        title={`Welcome ${name} (${role})`}
        element={<Dashboard />}
      />{" "}
    </div>
    // <div className="relative min-h-screen bg-[#34357c] overflow-hidden ">
    //   <div className="flex">
    //     {/* Sidebar */}
    //     <div className="flex flex-col w-20 lg:w-32 p-4 items-center justify-between min-h-screen fixed">
    //       <div className="w-full">
    //         <img
    //           src="../../images/svnitLogo.png"
    //           alt="svnitLogoImg"
    //           className="w-full max-w-[80px] mx-auto"
    //         />
    //       </div>

    //       <div className="flex flex-col gap-6">
    //         <div className="rounded-xl bg-[#1f2048] p-2">
    //           <MdNotifications className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
    //         </div>
    //         <div className="rounded-xl bg-[#1f2048] p-2">
    //           <HiOutlineDownload className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
    //         </div>
    //       </div>

    //       <div className="group relative mb-4">
    //         <FaCircleUser className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
    //         <div className="absolute left-full bottom-0 opacity-0 bg-[#1f2048] text-white rounded-md z-50 transition-opacity duration-300 group-hover:opacity-100 ml-2">
    //           <ul className="flex flex-col whitespace-nowrap">
    //             <li className="p-2 gap-2 text-sm lg:text-base rounded flex items-center">
    //               <FaEdit className="w-5 h-5" />
    //               Change Password
    //             </li>
    //             <li className="border border-gray-600"></li>
    //             <li className="flex gap-2 p-2 rounded text-sm lg:text-base items-center">
    //               <LuLogOut className="w-5 h-5" />
    //               Logout
    //             </li>
    //           </ul>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Main Content */}
    //     <div className="ml-20 lg:ml-32 w-[calc(100%-5rem)] lg:w-[calc(100%-8rem)] min-h-screen p-3">
    //       <div className="bg-[#efefef] h-full rounded-xl  shadow-lg">
    //         {/* <Dashboard /> */}
    //         <ConsultancyProjectRegistrationForm />
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default Homepage;
