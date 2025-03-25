import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function NotFoundPage() {
  const navigate = useNavigate();
  const { role, token } = useSelector((state) => state.auth);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 ">
      <div className="bg-white p-8 rounded-lg shadow-md text-center ">
        <div className="w-32 h-32 mx-auto mb-4 ">
          <img
            src="https://res.cloudinary.com/dpyurrpfa/image/upload/v1742797050/o92mbnrdmrf5encoemx9.png"
            alt="404"
            className="w-full h-full object-contain rounded-full scale-150 "
          />
        </div>
        {/* <div className="w-16 h-8 bg-[#0e7490] mx-auto mb-4 transform skew-x-12"></div>
        <div className="w-32 border-t-4 border-dashed border-gray-300 mx-auto mb-8"></div> */}
        <h1 className="text-2xl font-bold mb-4 text-[#0e7490] mt-12">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          You can search for the page you want here
          <br />
          or return to the homepage.
        </p>
        {/* {token && role === "ADMIN" && (
          <button
            className="bg-[#0e7490] text-white px-6 py-2 rounded hover:bg-[#0c6277] transition duration-300"
            onClick={() => navigate("/admin")}
          >
            GO HOME
          </button>
        )}
        {role === "PI" && (
          <button
            className="bg-[#0e7490] text-white px-6 py-2 rounded hover:bg-[#0c6277] transition duration-300"
            onClick={() => navigate("/home")}
          >
            GO HOME
          </button>
        )}
        {!token && (
          <button
            className="bg-[#0e7490] text-white px-6 py-2 rounded hover:bg-[#0c6277] transition duration-300"
            onClick={() => navigate("/login")}
          >
            GO HOME
          </button>
        )} */}
        <button
          className="bg-[#0e7490] text-white px-6 py-2 rounded hover:bg-[#0c6277] transition duration-300"
          onClick={() => navigate("/")}
        >
          GO HOME
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
