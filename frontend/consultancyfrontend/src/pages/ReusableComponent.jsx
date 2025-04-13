import React, { useState, useEffect } from "react";
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
import { apiConnector } from "../services/apiConnectors.jsx";
import { useSelector } from "react-redux";
import { MdContactMail, MdReportProblem } from "react-icons/md";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

function ReusableComponent(props) {
  const { token } = useSelector((state) => state.auth);
  const { formname } = useParams();
  const [totalNotification, setTotalNotification] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchNotificationCount() {
      const response = await apiConnector(
        "GET",
        `user/notifications/unread`,
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      );
      console.log(response);
      setTotalNotification(response.data.total);
    }
    fetchNotificationCount();
  }, []);
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
              src="https://res.cloudinary.com/dpyurrpfa/image/upload/v1742117068/ry46xbwnlh1qttam6inp.png"
              alt="svnitLogoImg"
              className="w-full max-w-[80px] mx-auto"
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-xl bg-[#1f2048] p-2 relative">
              {totalNotification !== 0 && (
                <>
                  <MdNotifications
                    className="w-6 h-6 lg:w-8 lg:h-8 text-white"
                    onClick={() => {
                      navigate("/notification");
                    }}
                  />
                  <div className="rounded-full bg-red-600 flex items-center justify-center text-xl font-bold h-7 w-7 text-white absolute -top-3 -right-3">
                    {totalNotification}
                  </div>
                </>
              )}
              {totalNotification === 0 && (
                <>
                  <MdNotifications
                    className="w-6 h-6 lg:w-8 lg:h-8 text-white"
                    onClick={() => {
                      navigate("/notification");
                    }}
                  />
                </>
              )}
            </div>
            {/* <div className="rounded-xl bg-[#1f2048] p-2">
              <HiOutlineDownload className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div> */}
            <div
              className="rounded-xl bg-[#1f2048] p-2 "
              onClick={() => navigate("/home")}
            >
              <IoHome className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div
              className="rounded-xl bg-[#1f2048] p-2 "
              onClick={() => navigate("/contact-us")}
            >
              <MdContactMail className="w-6 h-6 lg:w-8 lg:h-8 text-white p-1" />
            </div>
            <div
              className="rounded-xl bg-[#1f2048] p-2 "
              onClick={() => navigate("/complaint-form")}
            >
              <MdReportProblem className="w-6 h-6 lg:w-8 lg:h-8 text-white p-1" />
            </div>
          </div>

          <div className="group relative mb-4">
            <div
              className="flex gap-2 p-2  text-sm lg:text-base items-center rounded-xl bg-[#1f2048] "
              onClick={() => {
                dispatch(logout());
                navigate("/login");
              }}
            >
              <LuLogOut className="w-7 h-7 lg:w-8 lg:h-8 text-white p-1" />
              {/* Logout */}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-20 lg:ml-32 w-[calc(100%-5rem)] lg:w-[calc(100%-8rem)] min-h-screen p-3">
          <div className="bg-[#efefef] h-full rounded-xl  shadow-lg">
            <div className="bg-white border-8 font-extrabold border-[#efefef] rounded-3xl p-6  text-4xl font-poppins ">
              {props.title === "" ? formatText(formname) : props.title}
              <div
                className="absolute right-24 top-12   rounded-lg  text-[24px]"
                onClick={() => {
                  navigate(-1);
                }}
                title="Back"
              >
                <FaArrowCircleLeft size={40} color="#1f2048" />
              </div>
              <div
                className="absolute right-12 top-12   rounded-lg  text-[24px]"
                onClick={() => {
                  navigate(1);
                }}
                title="Next"
              >
                <FaArrowCircleRight size={40} color="#1f2048" />
              </div>
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
