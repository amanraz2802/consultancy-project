import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoMdDocument } from "react-icons/io";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { apiConnector } from "../../services/apiConnectors";
// import "@fontsource/poppins";

function GenerateForms() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [forms, setForms] = useState({});
  const data = [
    { name: "Consent Forms", addPath: "/consent-form" },
    { name: "Work Orders", addPath: "/work-order" },
    { name: "Bill of Supply", addPath: "/bill-supply" },
    { name: "Payment Details", addPath: "/payment-detail" },
    { name: "Vouchers", addPath: "/voucher" },
    { name: "Closure Forms", addPath: "/closure-form" },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiConnector(
          "GET",
          "/user/dashboard",
          {},
          {
            Authorization: `Bearer ${token}`,
          }
        );
        // console.log(response.data.data);
        setForms(response.data.data || {}); // Ensure forms is always an object
        // console.log(forms);
        // console.log(response);
      } catch (err) {
        console.error("Error in fetching dashboard", err);
      }
    };
    fetchDashboard();
  }, [token]);

  const colors = [
    "#eb5c76",
    "#f5ac72",
    "#95c794",
    "#4ab9b4",
    "#f04f3a",
    "#cfd7e0",
  ];

  return (
    <div className="px-4 lg:px-10">
      <h2 className="font-semibold text-lg mt-10 mb-7">Generate Forms:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.keys(forms).map((key, index) => (
          <div
            key={key}
            className="relative group cursor-pointer"
            onClick={() => {
              navigate(`${data[index]?.addPath}`);
            }}
          >
            <div
              style={{ backgroundColor: colors[index % colors.length] }}
              className="rounded-md px-4 py-4 h-auto group-hover:opacity-80 transition-all duration-400"
            >
              <h3 className="text-base lg:text-lg mb-3 font-poppins break-words">
                {data[index].name}
              </h3>
              <p className="text-3xl text-gray-700 font-bold font-poppins">
                {forms[key]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GenerateForms;
