import React from "react";
// import "@fontsource/poppins";
import GoogleSignInButton from "./GoogleSignInButton.jsx";

function Loginpage() {
  return (
    <div className="relative min-h-screen bg-[#34357c] overflow-x-hidden">
      <div
        className="absolute top-[2.5%] left-[2.5%] w-[95%] h-[95%] bg-white z-10 rounded-xl flex flex-col 
      justify-center items-center gap-4"
      >
        <img
          src="../../images/svnitLogo.png"
          alt=""
          className="w-[300px] h-[300px]"
        />
        <div className="font-bold text-6xl font-poppins"> Consultancy</div>
        <div className="text-xl tracking-wide">A project for SVNIT</div>
        <div className="bg-black h-[2px] w-[700px]"></div>
        <div className="border-gray-600 border-2 rounded-md scale-125 mt-4">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}

export default Loginpage;
