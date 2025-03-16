import React from "react";
import "@fontsource/poppins"; // Defaults to 400 weight
import GenerateForms from "./GenerateForms";
import FindForms from "./FindForms";

function Dashboard() {
  // const user = "abc xyz";
  return (
    <div className="">
      {/* <div className="bg-white border-8 border-[#efefef] rounded-3xl p-6  text-3xl font-poppins ">
        Welcome, <span className="font-extrabold">{user}!</span>
      </div> */}

      <GenerateForms />

      <FindForms />
    </div>
  );
}

export default Dashboard;
